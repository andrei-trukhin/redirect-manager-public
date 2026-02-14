import {ErrorRequestHandler} from "express";
import {FilterParsingError} from "../../../dtos";
import {ParsingError} from "bookish-potato-dto";
import {
    ForbiddenActionError,
    InvalidCredentialsError,
    RedirectNotFoundError,
    UniqueConstraintError
} from "../../../shared";
import {UserAlreadyExistsError, UserNotFoundError} from "../../../domains/users";
import {ApiTokenNotFoundError, InvalidApiTokenError} from "../../../domains/authentication";
import {
    BadRequestHttpError,
    ConflictHttpError,
    ForbiddenHttpError,
    NotFoundHttpError,
    UnauthorizedHttpError
} from "../errors";

/**
 * Maps known error types to appropriate HTTP errors.
 * If an error is thrown in a router, it checks if the error is an instance of the known error types
 *  and throws a corresponding HTTP error with a relevant message.
 * If the error type is not recognized, it rethrows the original error,
 *  which will be handled by the global error handler as an internal server error.
 */
export const errorMapperHandler: ErrorRequestHandler = async (error, req, res, next) => {
    const message = (error as Error)?.message;

    if (isBadRequestError(error)) {
        throw new BadRequestHttpError(message || 'Invalid request body or validation error');
    } else if (isConflictError(error)) {
        throw new ConflictHttpError(message || 'Conflict error');
    } else if (isNotFoundError(error)) {
        throw new NotFoundHttpError(message || 'Resource not found');
    } else if (isUnauthorizedError(error)) {
        throw new UnauthorizedHttpError(message || 'Unauthorized');
    } else if (isForbiddenError(error)) {
        throw new ForbiddenHttpError(message || 'Forbidden');
    }

    throw error;
}

function isBadRequestError(error: unknown): boolean {
    return error instanceof FilterParsingError
        || error instanceof ParsingError;
}

function isConflictError(error: unknown): boolean {
    return error instanceof UniqueConstraintError
        || error instanceof UserAlreadyExistsError;
}

function isNotFoundError(error: unknown): boolean {
    return error instanceof RedirectNotFoundError
        || error instanceof ApiTokenNotFoundError
        || error instanceof UserNotFoundError;
}

function isUnauthorizedError(error: unknown): boolean {
    return error instanceof InvalidCredentialsError
        || error instanceof InvalidApiTokenError;
}

function isForbiddenError(error: unknown): boolean {
    return error instanceof ForbiddenActionError;
}