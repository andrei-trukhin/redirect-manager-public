/**
 * Thrown when an API token is not found.
 */
export class ApiTokenNotFoundError extends Error {
    constructor(message: string = 'API token not found') {
        super(message);
        this.name = 'ApiTokenNotFoundError';
    }
}

