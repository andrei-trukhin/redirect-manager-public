/**
 * ForbiddenHttpError is thrown when a user is authenticated but does not have the necessary permissions to access the resource.
 * This results in a 403 Forbidden HTTP status code.
 */
export class ForbiddenHttpError extends Error {
    constructor(message: string = 'Forbidden') {
        super(message);
        this.name = 'ForbiddenHttpError';
    }
}

