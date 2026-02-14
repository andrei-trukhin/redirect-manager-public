import {EnumProperty, NumberProperty, StringProperty, BooleanProperty} from "bookish-potato-dto";

export enum RedirectsCacheType {
    IN_MEMORY = 'in-memory',
    NONE = 'none'
}

export class AppConfig {

    @NumberProperty({ defaultValue: 8080})
    readonly PORT!: number;

    @StringProperty({ defaultValue: '0.0.0.0' })
    readonly HOST!: string;

    /**
     * Base path for API endpoints.
     */
    @StringProperty({ defaultValue: '/api' })
    readonly BASE_API_PATH!: string;

    /**
     * Path for health check endpoint.
     */
    @StringProperty({ defaultValue: '/health' })
    readonly HEALTH_CHECK_PATH!: string;

    /**
     * Username for initial admin user.
     * Application will create this user on startup if it doesn't exist yet.
     */
    @StringProperty({
        defaultValue: 'admin'
    })
    readonly ADMIN_USERNAME!: string;

    /**
     * Password for initial admin user.
     * Application will create this user on startup if it doesn't exist yet.
     * (!) In a production environment, make sure to change this to a strong password via environment variables.
     */
    @StringProperty({
        defaultValue: 'admin'
    })
    readonly ADMIN_PASSWORD!: string;

    /**
     * TTL for cached redirects.
     * Will be ignored if REDIRECTS_CACHE_TYPE is set to 'none'.
     */
    @NumberProperty({
        defaultValue: 120,
        useDefaultValueOnParseError: true
    })
    readonly REDIRECT_CACHE_TTL_SECONDS!: number;

    /**
     * Type of redirects cache.
     */
    @EnumProperty(RedirectsCacheType, {
        defaultValue: RedirectsCacheType.IN_MEMORY,
        useDefaultValueOnParseError: true
    })
    readonly REDIRECTS_CACHE_TYPE!: RedirectsCacheType;

    /**
     * CORS origin configuration.
     * Specifies which origins are allowed to access the API.
     * Use '*' to allow all origins (default), or specify a specific origin like 'https://example.com'.
     * For multiple origins, use a comma-separated list.
     */
    @StringProperty({
        defaultValue: '*'
    })
    readonly CORS_ORIGIN!: string;

    /**
     * CORS credentials configuration.
     * Specifies if the API should allow sharing authentication credentials (like cookies).
     */
    @BooleanProperty({
        defaultValue: false
    })
    readonly CORS_ALLOW_CREDENTIALS!: boolean;
}
