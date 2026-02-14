import {RequestHandler} from "express";
import http from 'node:http';
import https from 'node:https';
import {createLogger} from "../../../logger";
import {Configuration} from "../../../config";
import {RedirectBySourceResult} from "../repositories";
import {RedirectsService} from "./redirects.service";

const logger = createLogger('Redirect Handler')

export const createHandleRedirect = (
    configuration: Configuration,
    redirectFinder: RedirectsService
): RequestHandler => {
    const handleRedirectsConfig = configuration.handleRedirectsConfig;
    const hopByHop = new Set(handleRedirectsConfig.HOB_BY_HOP_HEADERS);
    const customHeaders = handleRedirectsConfig.CUSTOM_HEADERS;
    const TARGET_BASE = handleRedirectsConfig.REVERSE_PROXY_TARGET_BASE_URL;
    const REVERSE_PROXY_TIMEOUT = handleRedirectsConfig.REVERSE_PROXY_TIMEOUT_MILLISECONDS;

    return async (req, res) => {
        const timeBeforeQuery = Date.now();
        let redirect: RedirectBySourceResult | null;

        const [url, queryParams] = req.originalUrl.split('?');

        try {
            redirect = await redirectFinder.findRedirectBySource(url.toLowerCase());
        } catch (e) {
            redirect = null;
            logger.error('Redirect lookup failed:', (e as Error).message || (e as any).toString());
        }
        logger.debug(`Redirect lookup took ${Date.now() - timeBeforeQuery}ms for ${req.originalUrl}`);

        const searchParams = queryParams ? '?' + new URLSearchParams(queryParams).toString() : '';

        if (redirect) {
            if (redirect.domain) {
                const url = new URL(redirect.destination, `https://${redirect.domain}`);
                redirect.destination = url.toString();
            }

            redirect.destination = redirect.destination + searchParams;
            res.redirect(redirect.statusCode, redirect.destination);
            return;
        }

        // Build upstream URL (preserve path + query)
        // If TARGET_BASE includes a path, it will be combined.
        const targetUrl = new URL(req.originalUrl, TARGET_BASE).toString();

        // Choose http or https module
        const urlObj = new URL(targetUrl);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;

        // Copy headers but remove hop-by-hop headers and make adjustments
        const headers: Record<string, any> = {};
        for (const [k, v] of Object.entries(req.headers)) {
            if (hopByHop.has(k.toLowerCase())) continue;
            // Optionally rewrite host header to target host
            if (k.toLowerCase() === 'host') {
                headers['host'] = urlObj.host;
                continue;
            }
            headers[k] = v;
        }

        // Add custom headers if desired
        for (const customHeader of customHeaders ? Object.entries(customHeaders) : []) {
            const [key, value] = customHeader;
            headers[key] = value;
        }


        // Example: inject a header for tracing or auth if desired
        // headers['x-proxy-by'] = 'my-redirect-proxy/1.0';
        // headers['x-forwarded-for'] = req.ip || req.connection.remoteAddress;

        const requestOptions = {
            protocol: urlObj.protocol,
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            method: req.method,
            path: urlObj.pathname + urlObj.search,
            headers,
            timeout: REVERSE_PROXY_TIMEOUT
        };

        const upstreamReq = client.request(requestOptions, upstreamRes => {
            // Filter hop-by-hop headers from upstream response
            for (const [name, value] of Object.entries(upstreamRes.headers)) {
                if (hopByHop.has(name.toLowerCase())) continue;
                if (value === undefined) continue;
                // Optionally rewrite set-cookie domain/path here
                res.setHeader(name, value);
            }

            res.status(upstreamRes.statusCode || 200);
            upstreamRes.pipe(res);
        });

        upstreamReq.on('timeout', () => {
            upstreamReq.destroy(new Error('Upstream request timed out'));
        });

        upstreamReq.on('error', (err: unknown) => {
            logger.error('Upstream request error:', err && (err as Error).message || err);
            if (res.headersSent) {
                res.destroy();
            } else {
                res.status(502).send('Bad Gateway (upstream error)');
            }
        });

        // Pipe the incoming request body to upstream
        // For GET/HEAD there typically is no body; piping handles streaming uploads.
        req.pipe(upstreamReq);
    }
}