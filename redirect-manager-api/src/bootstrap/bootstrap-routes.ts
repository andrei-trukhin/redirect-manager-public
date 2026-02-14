import {BaseApiRouter, createAuthBearerTokenMiddleware} from "../api";
import {ApiTokensRouter, AuthRouter, HealthCheckRouter, RedirectsRouter, UsersRouter} from "../api/v1";
import {Configuration} from "../config";
import {bootstrapServices} from "./bootstrap-services";

export async function bootstrapRoutes({ configuration, services }: {
    configuration: Configuration,
    services: ReturnType<typeof bootstrapServices>
}) {

    const { appConfig, appVersion } = configuration;
    const { redirectsService, authService, apiTokensService, usersService } = await services;

    const authMiddleware = createAuthBearerTokenMiddleware(authService, apiTokensService, usersService);

    const apiRouterV1 = new BaseApiRouter([
        new RedirectsRouter(redirectsService, authMiddleware),
        new AuthRouter(authService),
        new ApiTokensRouter(apiTokensService, authMiddleware),
        new UsersRouter(usersService, authMiddleware),
        // Health check endpoint
        new HealthCheckRouter({
            healthCheckPath: appConfig.HEALTH_CHECK_PATH,
            appVersion
        })
    ]);

    return {
        apiRouterV1
    };
}