import express, {Application, Router} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {Configuration} from "../config";
import {createLogger} from "../logger";
import {errorMapperHandler, httpErrorHandler} from "../api";
import {bootstrapRoutes} from "./bootstrap-routes";
import {bootstrapServices} from "./bootstrap-services";

const logger = createLogger('Application');

export async function bootstrapApp({configuration, routes, services}: {
    configuration: Configuration,
    routes: ReturnType<typeof bootstrapRoutes>,
    services: ReturnType<typeof bootstrapServices>,
}) {

    const {appConfig} = configuration;
    const {apiRouterV1} = await routes;
    const {handleRedirect} = await services;

    const app: Application = express();

    // Enable CORS for all routes
    const corsOrigin = appConfig.CORS_ORIGIN;
    let origin: string | string[] | boolean;
    if (corsOrigin === '*') {
        origin = appConfig.CORS_ALLOW_CREDENTIALS ? true : '*';
    } else {
        origin = corsOrigin.split(',').map(o => o.trim());
    }

    const corsOptions = {
        origin,
        credentials: appConfig.CORS_ALLOW_CREDENTIALS
    };
    app.use(cors(corsOptions));

    if (corsOrigin === '*') {
        if (appConfig.CORS_ALLOW_CREDENTIALS) {
            logger.warn('CORS is configured to allow all origins with credentials. This is not recommended for production environments.');
        } else {
            logger.warn('CORS is configured to allow all origins (*). This is not recommended for production environments.');
        }
    }

    app.use(cookieParser())

    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    // API v1
    const apiBasePath = appConfig.BASE_API_PATH + '/v1';
    app.use(apiBasePath, apiRouterV1.initRoutes());

    // Redirect handling for all other paths
    const router: Router = Router();
    router.all('/{*path}', handleRedirect);

    app.use(router);

    // Global error handlers
    app.use(errorMapperHandler);
    app.use(httpErrorHandler);

    return app;
}