import {RefreshTokenEntity} from "../entities";

export interface RefreshTokenRepository {
    /**
     * Save token.
     * @param token
     */
    save(token: Pick<RefreshTokenEntity, 'userId' | 'expiresAt' | 'hashedToken'>): Promise<RefreshTokenEntity>;

    /**
     * Find token by hashed value.
     * @param token - Hashed token value.
     */
    findByToken(token: string): Promise<RefreshTokenEntity | null>;

    /**
     * Find tokens by user id.
     * @param userId - User id to find tokens for.
     */
    findByUserId(userId: string): Promise<RefreshTokenEntity[]>;

    /**
     * Update token.
     * @param token - Token to update.
     */
    update(token: Partial<RefreshTokenEntity> & {id: string}): Promise<RefreshTokenEntity>;

    /**
     * Delete token.
     * @param token - Token to delete.
     */
    delete(token: RefreshTokenEntity): Promise<void>;

    /**
     * Delete token by id.
     * @param id - Id of token to delete.
     */
    deleteById(id: string): Promise<void>;

    /**
     * Delete multiple tokens.
     * @param tokens
     */
    deleteAll(tokens: RefreshTokenEntity[]): Promise<void>;
}