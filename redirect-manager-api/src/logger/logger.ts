
export interface Logger {
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
    debug(...data: any[]): void;
}

export enum LoggerLevel {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    DEBUG = 'debug',
}

export function defineLoggerLevel(level: LoggerLevel): number {
    switch (level) {
        case LoggerLevel.ERROR: return 3;
        case LoggerLevel.WARN: return 4;
        case LoggerLevel.INFO: return 6;
        case LoggerLevel.DEBUG: return 7;
        default: return 6;
    }
}