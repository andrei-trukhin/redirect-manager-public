export type RefreshTokenEntity = {
    id: string;
    /**
     * Hashed token value.
     */
    hashedToken: string;
    userId: string;
    expiresAt: Date,
    createdAt: Date
    revoked: boolean;
}