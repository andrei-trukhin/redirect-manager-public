import {Request, Response, NextFunction} from 'express';
import {ForbiddenHttpError} from "../../shared";

/**
 * User roles.
 */
export type UserRole = 'USER' | 'ADMIN';

/**
 * Middleware to restrict access based on the user's role.
 * Returns 403 Forbidden if the user's role doesn't match any of the required roles.
 *
 * @param requiredRoles Roles that are allowed to access the endpoint.
 */
export const requireRole = (requiredRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user;

        if (!user) {
            throw new ForbiddenHttpError('User not found in session');
        }

        const userRole: UserRole = user.role;

        if (!userRole) {
            throw new ForbiddenHttpError('Role not found for user');
        }

        if (!requiredRoles.includes(userRole)) {
            throw new ForbiddenHttpError('Insufficient permissions: required role not met');
        }

        next();
    };
};

