import {ConsoleLogger} from "./console.logger";
import {defineLoggerLevel, LoggerLevel} from "./logger";

export * from './logger';

const loggerSeverity = defineLoggerLevel(process.env.LOGGER_LEVEL as LoggerLevel ?? LoggerLevel.INFO);

export const createLogger = (name: string) => {
    return new ConsoleLogger(name, loggerSeverity);
};