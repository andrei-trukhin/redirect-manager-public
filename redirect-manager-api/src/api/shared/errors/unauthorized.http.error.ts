/**
 * UnauthorizedHttpError is thrown when a user tries to access a resource that they are not authorized to access.
 * This error should be used when the user is authenticated but does not have the necessary permissions to access the resource.
 */
export class UnauthorizedHttpError extends Error {}