import {Request, Response, NextFunction, RequestHandler} from 'express';
import {ApiTokensService, AuthService} from "../../../domains/authentication";
import {UsersService} from "../../../domains/users";
import {UnauthorizedHttpError} from "../../shared";

enum TokenType {
    JWT,
    API_TOKEN,
    UNKNOWN
}

function detectTokenType(token: string): TokenType {
    if (token.split('.').length === 3) {
        return TokenType.JWT;
    }
    // API tokens are 32-byte hex strings (64 characters)
    if (/^[0-9a-f]{64}$/i.test(token)) {
        return TokenType.API_TOKEN;
    }
    return TokenType.UNKNOWN;
}

export const createAuthBearerTokenMiddleware = (
    authService: AuthService,
    apiTokensService: ApiTokensService,
    usersService: UsersService
): RequestHandler => {

    async function handleJwtToken(token: string) {
        try {
            return await authService.validateJwt(token);
        } catch {
            throw new UnauthorizedHttpError('Invalid or expired token');
        }
    }

    async function handleApiToken(token: string) {
        try {
            const apiToken = await apiTokensService.validateApiToken(token);
            const user = await usersService.findById(apiToken.userId);

            if (user) return {user, scope: apiToken.scope};

        } catch {
            throw new UnauthorizedHttpError('Invalid or expired token');
        }

        throw new UnauthorizedHttpError('User associated with token not found');
    }

    return async (req: Request, res: Response, next: NextFunction) => {

        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new UnauthorizedHttpError('No token provided');
        }

        const tokenType = detectTokenType(token);

        if (tokenType === TokenType.JWT) {
            res.locals.user = await handleJwtToken(token);
            // JWT tokens from the UI have full access and session privileges
            res.locals.tokenScope = 'JWT_SESSION';
        } else if (tokenType === TokenType.API_TOKEN) {
            const {user, scope} = await handleApiToken(token);
            res.locals.user = user;
            res.locals.tokenScope = scope;
        } else {
            throw new UnauthorizedHttpError('Invalid token format');
        }

        next();
    }
}
