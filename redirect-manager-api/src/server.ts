import {createLogger} from "./logger";
import {createServer} from 'node:http';
import {ConfigurationParsingError} from "./shared";
import {bootstrap} from "./bootstrap";

const logger = createLogger('Application Server');
logger.info('Starting redirect manager API...');

process.on('uncaughtException', (err) => {
    if (err instanceof ConfigurationParsingError) {
        logger.error('Configuration parsing failed. Exiting...');
        process.exit(1);
    }

    logger.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, _promise) => {
    logger.error('Unhandled rejection:', reason);
});

async function start() {
    try {
        const {app, configuration} = await bootstrap();
        const appConfig = configuration.appConfig;

        const hostname = appConfig.HOST;
        const port = appConfig.PORT;

        const server = createServer(app);

        server.listen(port, hostname, () => {
            logger.info(`Server running...`);
            logger.info(`Listening on http://${hostname}:${port}`);
        });
    } catch (e) {
        logger.error('Failed to bootstrap application:', e);
        process.exit(1);
    }
}

start();
