import {UsersService} from "../domains/users";
import {Configuration} from "../config";
import {bootstrapInfrastructure} from "./bootstrap-infrastructure";
import {ApiTokensService, AuthService, JwtService} from "../domains/authentication";
import {createHandleRedirect, RedirectsService, RedirectsServiceCache} from "../domains/redirects";
import {RedirectsCacheType} from "../config/app.config";


export async function bootstrapServices({
                                            configuration,
                                            infrastructure,
                                        }: {
    configuration: Configuration;
    infrastructure: ReturnType<typeof bootstrapInfrastructure>
}) {

    const {usersRepository, refreshTokensRepository, apiTokensRepository, redirectsRepository} = await infrastructure;

    const usersService = new UsersService(
        usersRepository,
        configuration.authConfig
    );

    const jwtService = new JwtService();

    const authService = new AuthService(
        usersService,
        refreshTokensRepository,
        jwtService,
        configuration.authConfig
    );

    const apiTokensService = new ApiTokensService(
        apiTokensRepository,
        configuration.authConfig
    );

    const originalRedirectsService = new RedirectsService(redirectsRepository);
    const redirectsService: RedirectsService = configuration.appConfig.REDIRECTS_CACHE_TYPE === RedirectsCacheType.IN_MEMORY ?
        new RedirectsServiceCache(originalRedirectsService, configuration.appConfig.REDIRECT_CACHE_TTL_SECONDS) as unknown as RedirectsService :
        originalRedirectsService;

    const handleRedirect = createHandleRedirect(configuration, redirectsService);

    return {
        usersService,
        authService,
        jwtService,
        apiTokensService,
        redirectsService,
        handleRedirect,
    };
}