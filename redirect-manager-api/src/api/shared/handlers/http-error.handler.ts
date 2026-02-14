import {ErrorRequestHandler, Response} from "express";
import {
    BadRequestHttpError,
    ConflictHttpError,
    ForbiddenHttpError,
    NotFoundHttpError,
    UnauthorizedHttpError
} from "../errors";
import {createLogger} from "../../../logger";
import {RefreshTokenReuseError} from "../../../domains/authentication";

export enum HttpErrorCode {
    BadRequest = 'BAD_REQUEST',
    NotFound = 'NOT_FOUND',
    InternalServerError = 'INTERNAL_SERVER_ERROR',
    Conflict = 'CONFLICT',
    Unauthorized = 'AUTHENTICATION_FAILED',
    Forbidden = 'FORBIDDEN',
    RefreshTokenReuse = 'REFRESH_TOKEN_REUSE_DETECTED'
}

const logger = createLogger('HttpErrorHandler');

export const httpErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {

    if (err instanceof BadRequestHttpError) {
        handleBadRequest(res, `Invalid request data: ${err.message}`);
        return;
    }

    if (err instanceof NotFoundHttpError) {
        handleNotFound(res, err.message);
        return;
    }

    if (err instanceof ConflictHttpError) {
        handleConflict(res, err.message);
        return;
    }

    if (err instanceof UnauthorizedHttpError) {
        handleUnauthorized(res, err.message);
        return;
    }

    if (err instanceof RefreshTokenReuseError) {
        handleRefreshTokenReuseError(res);
        return;
    }

    if (err instanceof ForbiddenHttpError) {
        handleForbidden(res, err.message);
        return;
    }

    handleInternalServerError(res, err);
}

const handleBadRequest = (res: Response, message: string) => {
    res.status(400).json({
        code: HttpErrorCode.BadRequest,
        message
    });
}

const handleNotFound = (res: Response, message: string) => {
    res.status(404).json({
        code: HttpErrorCode.NotFound,
        message
    });
}

const handleConflict = (res: Response, message: string) => {
    res.status(409).json({
        code: HttpErrorCode.Conflict,
        message
    });
}

const handleUnauthorized = (res: Response, message: string) => {
    res.status(401).json({
        code: HttpErrorCode.Unauthorized,
        message
    });
}

const handleRefreshTokenReuseError = (res: Response) => {
    res.status(401).json({
        code: HttpErrorCode.RefreshTokenReuse,
        message: 'Refresh token reuse detected. All refresh tokens for this user have been invalidated. Please log in again.'
    });
}

const handleForbidden = (res: Response, message: string) => {
    res.status(403).json({
        code: HttpErrorCode.Forbidden,
        message
    });
}

const handleInternalServerError = (res: Response, err: unknown) => {
    logger.error('Unexpected error while API call:', err, (err as Error)?.stack);
    res.status(500).json({
        code: HttpErrorCode.InternalServerError,
        message: 'Internal server error'
    });
}
