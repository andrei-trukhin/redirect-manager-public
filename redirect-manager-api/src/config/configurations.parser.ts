require('dotenv').config()
import {DatabaseConfig} from "./database.config";
import {AppConfig} from "./app.config";
import {HandleRedirectsConfig} from "./handle-redirects.config";
import {parseObject, ParsingError} from "bookish-potato-dto";
import {AuthConfig} from "./auth.config";
import {createLogger} from "../logger";
import {ConfigurationParsingError} from "../shared";
import {readFileSync} from 'node:fs';
import {join} from 'node:path';

const { version } = JSON.parse(
    readFileSync(join('package.json'), 'utf8')
);

const secretKeys = new Set(['JWT_SECRET', 'TOKEN_HASH_PEPPER', 'DATABASE_URL', 'ADMIN_USERNAME', 'ADMIN_PASSWORD']);

export class ConfigurationsParser {

    private readonly logger = createLogger('Configuration');

    get appVersion(): string {
        return version;
    }

    private _databaseConfig?: DatabaseConfig;
    get databaseConfig(): DatabaseConfig {
        return this._databaseConfig!;
    }

    private _appConfig?: AppConfig;
    get appConfig(): AppConfig {
        return this._appConfig!;
    }

    private _handleRedirectsConfig?: HandleRedirectsConfig;
    get handleRedirectsConfig(): HandleRedirectsConfig {
        return this._handleRedirectsConfig!;
    }

    private _authConfig?: AuthConfig;
    get authConfig(): AuthConfig {
        return this._authConfig!;
    }

    constructor() {
        this.parse();
    }

    private parse(): void {
        const errors: ParsingError[] = [];

        try {
            this._databaseConfig = parseObject(DatabaseConfig, process.env);
        } catch (e) {
            errors.push(e as ParsingError);
        }

        try {
            this._appConfig = parseObject(AppConfig, process.env);
        } catch (e) {
            errors.push(e as ParsingError);
        }

        try {
            this._handleRedirectsConfig = parseObject(HandleRedirectsConfig, process.env);
        } catch (e) {
            errors.push(e as ParsingError);
        }

        try {
            this._authConfig = parseObject(AuthConfig, process.env);
        } catch (e) {
            errors.push(e as ParsingError);
        }

        if (errors.length > 0) {
            this.logger.error('Failed to parse configuration:', errors.map(e => e.message).join(', '));
            this.logger.error('Cannot start application due to invalid configuration.');
            throw new ConfigurationParsingError('Configuration parsing failed.');
        }

        this.logger.info('--- Using following configuration ---')

        this.logger.info('Application version:', this.appVersion);

        // Log everything except secrets
        for (const key of Object.keys(this.databaseConfig)) {
            if (secretKeys.has(key)) {
                continue;
            }
            this.logger.info(`${key}: ${this.databaseConfig[key]}`);
        }

        for (const key of Object.keys(this.appConfig)) {
            if (secretKeys.has(key)) {
                continue;
            }
            this.logger.info(`${key}: ${this.appConfig[key]}`);
        }

        for (const key of Object.keys(this.handleRedirectsConfig)) {
            if (secretKeys.has(key)) {
                continue;
            }
            this.logger.info(`${key}: ${JSON.stringify(this.handleRedirectsConfig[key])}`);
        }

        this.logger.info('-----------------------------------');
    }

}