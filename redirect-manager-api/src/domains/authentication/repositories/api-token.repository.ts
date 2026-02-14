import {ApiTokenEntity} from "../entities";

export interface ApiTokenRepository {
    /**
     * Save token.
     * @param token
     */
    save(token: Pick<ApiTokenEntity, 'userId' | 'name' | 'scope' | 'expiresAt' | 'hashedToken'>): Promise<ApiTokenEntity>;

    /**
     * Find token by hashed value.
     * @param token - Hashed token value.
     */
    findByToken(token: string): Promise<ApiTokenEntity | null>;

    /**
     * Find token by id.
     * @param id - Token id to find.
     */
    findById(id: string): Promise<ApiTokenEntity | null>;

    /**
     * Find tokens by user id.
     * @param userId - User id to find tokens for.
     */
    findByUserId(userId: string): Promise<ApiTokenEntity[]>;

    /**
     * Update token.
     * @param token - Token to update.
     */
    update(token: Partial<ApiTokenEntity> & {id: string}): Promise<ApiTokenEntity>;

    /**
     * Delete token.
     * @param token - Token to delete.
     */
    delete(token: ApiTokenEntity): Promise<void>;

    /**
     * Delete token by id.
     * @param id - Id of token to delete.
     */
    deleteById(id: string): Promise<void>;

    /**
     * Delete multiple tokens.
     * @param tokens
     */
    deleteAll(tokens: ApiTokenEntity[]): Promise<void>;
}