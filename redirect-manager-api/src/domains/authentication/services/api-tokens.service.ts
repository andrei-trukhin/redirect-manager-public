import {ApiTokenEntity} from "../entities";
import {AuthConfig} from "../../../config/auth.config";
import {createLogger} from "../../../logger";
import {randomBytes} from "node:crypto";
import {findToken, hashToken} from "./token-utils";
import {TokenScope} from "../../../generated/prisma/enums";
import {ApiTokenRepository} from "../repositories";
import {ApiTokenNotFoundError, InvalidApiTokenError} from "../errors";
import {User} from "../../users";
import {ForbiddenActionError} from "../../../shared";

export type CreateApiTokenParams = {
    userId: string;
    name: string;
    scope: TokenScope;
    expiresAt: Date;
}

export type IssueApiTokenResult = {
    token: string;
    entity: ApiTokenEntity;
}

export type UserApiToken = Omit<ApiTokenEntity, 'hashedToken'>;

export class ApiTokensService {
    private readonly logger = createLogger('ApiTokensService');
    private static readonly TOKEN_BYTE_SIZE = 32;

    constructor(
        private readonly apiTokensRepository: ApiTokenRepository,
        private readonly authConfig: AuthConfig
    ) {
    }

    /**
     * Validates if the user is authorized to revoke an API token.
     * @param actor User who is performing the action.
     * @param tokenId ID of the token being revoked.
     * @throws ForbiddenActionError if the actor is not authorized.
     * @throws ApiTokenNotFoundError if the token is not found.
     */
    async authorizeTokenRevocation(actor: User, tokenId: string): Promise<void> {
        const token = await this.apiTokensRepository.findById(tokenId);
        if (!token) {
            throw new ApiTokenNotFoundError();
        }

        if (actor.id !== token.userId) {
            throw new ForbiddenActionError('You are not authorized to revoke an API token of another user.');
        }
    }

    /**
     * Returns all API tokens for a user.
     * @param userId
     */
    async getUserTokens(userId: string): Promise<UserApiToken[]> {
        const tokens = await this.apiTokensRepository.findByUserId(userId);
        return tokens.map(({ hashedToken, ...rest }) => rest);
    }

    async createApiToken(params: CreateApiTokenParams): Promise<IssueApiTokenResult> {
        const rawToken = randomBytes(ApiTokensService.TOKEN_BYTE_SIZE).toString('hex');
        const hashedToken = hashToken(
            rawToken,
            this.authConfig.JWT_HASH_ALGORITHM,
            this.authConfig.TOKEN_HASH_PEPPER[0]
        );

        try {
            const entity = await this.apiTokensRepository.save({
                userId: params.userId,
                name: params.name,
                scope: params.scope,
                expiresAt: params.expiresAt,
                hashedToken
            });

            return {
                token: rawToken,
                entity
            };
        } catch (e) {
            this.logger.error('Error while saving API token:', (e as Error).message);
            throw new Error('Error while saving API token');
        }
    }

    /**
     * Revokes an API token.
     * @param tokenId
     */
    async revokeApiToken(tokenId: string): Promise<void> {
        await this.apiTokensRepository.deleteById(tokenId);
    }

    async validateApiToken(rawToken: string): Promise<ApiTokenEntity> {
        const token = await findToken(
            rawToken,
            this.apiTokensRepository,
            this.authConfig.JWT_HASH_ALGORITHM,
            this.authConfig.TOKEN_HASH_PEPPER
        );

        if (!token) {
            throw new InvalidApiTokenError('Invalid or not found API token');
        }

        if (token.expiresAt && token.expiresAt < new Date()) {
            throw new InvalidApiTokenError('API token has expired');
        }

        return token;
    }
}
