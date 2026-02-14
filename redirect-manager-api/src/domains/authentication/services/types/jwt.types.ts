import {NumberProperty, StringProperty} from "bookish-potato-dto";

export class JwtTokenPayload {
    /**
     * Expiration time.
     */
    @NumberProperty()
    readonly exp!: number;
    /**
     * Issued at time.
     */
    @NumberProperty()
    readonly iat!: number;

    @StringProperty()
    readonly scope!: string;

    @StringProperty()
    readonly sub!: string;
}

export type VerificationResult = {
    /**
     * Provided token payload if verification was successful.
     */
    jwtPayload: JwtTokenPayload | null,
    /**
     * Verification error if verification failed: jwtPayload will be null in this case except for EXPIRED_TOKEN, which will contain the valid payload.
     */
    error: VerificationError | null
}

export enum VerificationError {
    INVALID_TOKEN = 'Invalid token',
    EXPIRED_TOKEN = 'Token expired',
    TOKEN_NOT_PROVIDED = 'Token not provided',
    INVALID_PAYLOAD = 'Invalid payload'
}