import {Request, Response, NextFunction} from 'express';
import {ForbiddenHttpError} from "../../shared";
import {TokenScope as PrismaTokenScope} from "../../../generated/prisma/enums";

/**
 * Supported token scopes.
 */
export type TokenScope = PrismaTokenScope | 'JWT_SESSION';

/**
 * Middleware to restrict access based on the token scope.
 * JWT_SESSION scope is for full UI-like management access.
 * READ_WRITE scope allows everything.
 * READ scope only allows GET, HEAD, OPTIONS methods.
 *
 * @param requiredScopes Scopes that are allowed to access the endpoint.
 */
export const requireScope = (requiredScopes: TokenScope[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const tokenScope: TokenScope = res.locals.tokenScope;

        if (!tokenScope) {
            throw new ForbiddenHttpError('Scope not found in token');
        }

        // If the token has JWT_SESSION, it can access everything
        if (tokenScope === 'JWT_SESSION') {
            return next();
        }

        // If the token has READ_WRITE, it can access READ and READ_WRITE
        if (tokenScope === 'READ_WRITE' && (requiredScopes.includes('READ_WRITE') || requiredScopes.includes('READ'))) {
            return next();
        }

        // If the token has READ, it can only access if READ is in requiredScopes
        if (tokenScope === 'READ' && requiredScopes.includes('READ')) {
            // Additional safety: READ scope should only be used for read operations
            const isReadMethod = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
            if (isReadMethod) {
                return next();
            }
            throw new ForbiddenHttpError('READ scope is not authorized for write operations');
        }

        throw new ForbiddenHttpError('Insufficient token scope');
    };
};

