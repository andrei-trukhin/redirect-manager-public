// JobService.ts

export type JobFn<T extends any[] = any[], R = any> = (...args: T) => R | Promise<R>;

export interface JobOptions<T extends any[] = any[]> {
    /**
     * Run once immediately when the job is started (default: false).
     */
    readonly immediate?: boolean;

    /**
     * Milliseconds between runs. Required by factory (must be > 0).
     */
    readonly intervalMs: number;

    /**
     * If true, skip a tick while the previous invocation is still running (default: true).
     * If false, allow overlapping executions.
     */
    readonly preventOverrun?: boolean;

    /**
     * Called when the scheduled invocation throws or rejects.
     */
    readonly onError?: (err: unknown, context: { lastRunAt?: Date; attemptArgs?: T }) => void;

    /**
     * Optional maximum number of consecutive failures before auto-stopping the job.
     * undefined = never auto-stop.
     */
    readonly maxConsecutiveFailures?: number;

    /**
     * Optional name for the job (useful for logging/debugging).
     */
    readonly name?: string;
}

/**
 * Handle returned by JobService.createIntervalJob
 */
export interface IntervalJob<T extends any[] = any[]> {
    /**
     * Start the job. Any args provided here will be passed to each invocation of the job function.
     * If already started this is a no-op.
     */
    readonly start: (...args: T) => void;

    /**
     * Stop the job. Clears interval and prevents further invocations.
     */
    readonly stop: () => void;

    /**
     * True if the timer is currently active (setInterval created).
     */
    readonly isRunning: () => boolean;

    /**
     * The last successful run start time (or undefined if never run).
     */
    readonly lastRunAt?: Date;

    /**
     * Number of consecutive failures since the last success.
     */
    readonly consecutiveFailures: () => number;

    /**
     * Name of the job (if provided in options).
     */
    readonly name?: string;

    /**
     * For testing / advanced: low-level wrapped function that is actually invoked each tick.
     */
    readonly _invoke: (...args: T) => Promise<void>;
}

/**
 * JobService: factory for interval jobs
 */
export class JobService {
    private constructor() {
        /* static-only */
    }

    /**
     * Create an interval job.
     *
     * @param fn Function to run each tick (sync or async).
     * @param options Options including intervalMs, immediate, etc.
     * @returns IntervalJob handle with control methods.
     */
    public static createIntervalJob<T extends any[] = any[]>(
        fn: JobFn<T, unknown>,
        options: JobOptions<T>
    ): IntervalJob<T> {
        if (typeof fn !== 'function') throw new TypeError('fn must be a function');
        const { intervalMs, immediate = false, preventOverrun = true, onError, maxConsecutiveFailures, name } = options;

        if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
            throw new TypeError('options.intervalMs must be a positive number');
        }

        let timer: NodeJS.Timeout | null = null;
        let active = false;
        let running = false;
        let lastRunAt: Date | undefined = undefined;
        let consecutiveFailuresCount = 0;
        let latestArgs: T | undefined = undefined;

        const invoke = async (...args: T): Promise<void> => {
            if (preventOverrun && running) return;
            running = true;
            lastRunAt = new Date();
            try {
                await Promise.resolve(fn(...args));
                consecutiveFailuresCount = 0;
            } catch (err) {
                consecutiveFailuresCount += 1;
                onError?.(err, { lastRunAt, attemptArgs: args });
                if (typeof maxConsecutiveFailures === 'number' && consecutiveFailuresCount >= maxConsecutiveFailures) {
                    // auto-stop the job
                    jobHandle.stop();
                }
            } finally {
                running = false;
            }
        };

        const jobHandle: IntervalJob<T> = {
            start: (...args: T) => {
                if (active) return;
                active = true;
                latestArgs = args;
                if (immediate) {
                    // fire-and-forget immediate execution
                    void invoke(...(args));
                }
                timer = setInterval(() => {
                    // use latestArgs captured at start time
                    void invoke(...(latestArgs as T));
                }, intervalMs);
            },
            stop: () => {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
                active = false;
            },
            isRunning: () => active,
            lastRunAt,
            consecutiveFailures: () => consecutiveFailuresCount,
            name,
            _invoke: async (...args: T) => {
                await invoke(...args);
            },
        };

        return jobHandle;
    }
}
