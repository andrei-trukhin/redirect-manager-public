import {Logger} from "./logger";

export class ConsoleLogger implements Logger {

    constructor(private readonly prefix: string = '', private readonly loggerLevel: number) {

    }

    info(...data: any[]): void {
        if (this.loggerLevel < 6) return;
        console.log(`[INFO] [${this.prefix}]`, data.join(' '));
    }

    warn(...data: any[]): void {
        if (this.loggerLevel < 4) return;
        console.warn(`[WARN] [${this.prefix}]`, data.join(' '));
    }

    error(...data: any[]): void {
        if (this.loggerLevel < 3) return;
        console.error(`[ERROR] [${this.prefix}]`, data.join(' '));
    }

    debug(...data: any[]): void {
        if (this.loggerLevel < 7) return;
        console.debug(`[DEBUG] [${this.prefix}]`, data.join(' '));
    }
}