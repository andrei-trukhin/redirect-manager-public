import {RefreshTokenRepository} from "../repositories";
import {RefreshTokenReuseError} from "../errors";
import {User, UsersService} from "../../users";
import {IssueJwtResult, IssueRefreshTokenResult, LoginResult, UserCredentials} from "./types";
import {JwtService} from "./jwt.service";
import {randomBytes} from 'node:crypto'
import {createLogger} from "../../../logger";
import {AuthConfig} from "../../../config/auth.config";
import {findToken, hashToken} from "./token-utils";
import {compareHash, InvalidCredentialsError} from "../../../shared";

export class AuthService {

    private readonly logger = createLogger('AuthService');
    private static readonly TOKEN_BYTE_SIZE = 32;
    private static readonly TOKEN_EXPIRES_IN_MS = 1000 * 60 * 60 * 24 * 3; // 3 days

    constructor(
        private readonly usersService: UsersService,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly jwtService: JwtService,
        private readonly authConfig: AuthConfig) {
    }

    /**
     * Logs in a user with given credentials.
     * Returns null if credentials are invalid.
     * @param credentials User credentials.
     * @return Authentication result with refresh token and user info, or null if credentials are invalid.
     * @throws InvalidCredentialsError if the credentials are invalid.
     */
    async login(credentials: UserCredentials): Promise<LoginResult> {
        const user = await this.usersService.findByUsername(credentials.username);
        if (!user) {
            throw new InvalidCredentialsError('Invalid credentials');
        }

        if (!compareHash({
            secret: credentials.password,
            hashed: user.password
        })) {
            this.logger.info(`Authentication failed with username ${credentials.username}`);
            throw new InvalidCredentialsError('Invalid credentials');
        }

        this.logger.info(`Login with user with ID ${user.id} succeeded.`);

        return {
            user,
            refreshToken: await this.createRefreshTokenForUser(user.id),
            jwt: await this.createJwtTokenForUser(user.id)
        }
    }

    private async createRefreshTokenForUser(userId: string): Promise<IssueRefreshTokenResult> {
        // Create random token for refresh token
        const refreshToken = randomBytes(AuthService.TOKEN_BYTE_SIZE).toString('hex');
        const hashedToken = hashToken(refreshToken, this.authConfig.JWT_HASH_ALGORITHM, this.authConfig.TOKEN_HASH_PEPPER[0]);

        const expiresAt = new Date(Date.now() + AuthService.TOKEN_EXPIRES_IN_MS);

        try {
            const token = await this.refreshTokenRepository.save({
                hashedToken,
                expiresAt,
                userId
            });
            this.logger.info(`Issued new refresh token with id ${token.id} for user ${userId}, expires at ${expiresAt.toISOString()}.`);
        } catch (e) {
            this.logger.error('Error while saving JWT token:', (e as Error).message);
            throw new Error('Error while saving JWT token');
        }

        return {
            refreshToken,
            expiresIn: AuthService.TOKEN_EXPIRES_IN_MS / 1000
        }
    }

    /**
     * Logs out a user by deleting the refresh token.
     * If allDevices are true, deletes all refresh tokens for the user.
     * @param token
     * @param allDevices
     */
    public async logout(token: string, allDevices: boolean = false): Promise<void> {
        const foundToken = await findToken(
            token, this.refreshTokenRepository, this.authConfig.JWT_HASH_ALGORITHM, this.authConfig.TOKEN_HASH_PEPPER);
        if (!foundToken) return;

        if (!allDevices) {
            await this.refreshTokenRepository.deleteById(foundToken.id);
            this.logger.info(`Logged out refresh token with id ${foundToken.id} for user ${foundToken.userId}.`);
            return;
        }

        await this.removeAllUserTokens(foundToken.userId);
        this.logger.info(`Logging out all devices for user ${foundToken.userId} by deleting all refresh tokens.`);
    }

    private async removeAllUserTokens(userId: string): Promise<void> {
        const userTokens = await this.refreshTokenRepository.findByUserId(userId);
        await this.refreshTokenRepository.deleteAll(userTokens);
    }

    /**
     * Rotates the refresh token by revoking the old token and issuing a new one.
     * @param token Refresh token to rotate.
     * @return New refresh token.
     * @throws InvalidCredentialsError if the refresh token is invalid or user not found.
     */
    async refreshToken(token: string): Promise<IssueRefreshTokenResult> {
        // 1. Find the token
        const savedToken = await findToken(token, this.refreshTokenRepository, this.authConfig.JWT_HASH_ALGORITHM, this.authConfig.TOKEN_HASH_PEPPER);
        if (!savedToken) {
            throw new InvalidCredentialsError('Invalid refresh token');
        }

        // 2. Verify if the token is expired
        if (savedToken.expiresAt < new Date()) {
            await this.refreshTokenRepository.delete(savedToken);
            this.logger.info(`Deleted expired refresh token with id ${savedToken.id} for user ${savedToken.userId}.`);
            throw new InvalidCredentialsError('Refresh token has expired');
        }

        // 3. Verify user existence
        const user = await this.usersService.findById(savedToken.userId);
        if (!user) {
            await this.refreshTokenRepository.delete(savedToken);
            this.logger.info(`Deleted refresh token with id ${savedToken.id} for non-existing user ${savedToken.userId}.`);
            throw new InvalidCredentialsError('Invalid refresh token');
        }

        // 4. Revoke the old token
        await this.refreshTokenRepository.delete(savedToken);
        this.logger.info(`Revoked refresh token with id ${savedToken.id} for user ${savedToken.userId}.`);

        // 5. Issue a new refresh token and return it
        return this.createRefreshTokenForUser(user.id);
    }

    /**
     * Issues a new JWT token based on the provided refresh token.
     * @param refreshToken Refresh token to validate and issue new JWT for.
     * @return New JWT token and its expiration time.
     * @throws InvalidCredentialsError if the refresh token is invalid or user not found.
     */
    async issueJwt(refreshToken: string): Promise<IssueJwtResult> {
        // 1. Find the refresh token
        const savedToken = await findToken(refreshToken, this.refreshTokenRepository, this.authConfig.JWT_HASH_ALGORITHM, this.authConfig.TOKEN_HASH_PEPPER);
        if (!savedToken) {
            throw new InvalidCredentialsError('Invalid refresh token');
        }

        // 2. Verify if the token is expired
        if (savedToken.expiresAt < new Date()) {
            throw new InvalidCredentialsError('Refresh token has expired');
        }

        // 3. Verify if the token is revoked
        if (savedToken.revoked) {
            await this.removeAllUserTokens(savedToken.userId);
            throw new RefreshTokenReuseError('Refresh token has been revoked');
        }

        // 4. Verify user existence
        const user = await this.usersService.findById(savedToken.userId);
        if (!user) {
            throw new InvalidCredentialsError('Invalid refresh token');
        }

        // 5. Issue new JWT token
        return this.createJwtTokenForUser(user.id);
    }

    private async createJwtTokenForUser(userId: string): Promise<IssueJwtResult> {
        const tokenPayload = this.jwtService.sign(this.authConfig.JWT_SECRET, {
            timestamp: Date.now(),
            sub: userId
        });

        return {
            jwt: tokenPayload.token,
            expiresIn: tokenPayload.expiresIn
        }
    }

    /**
     * Validates a JWT token and returns the associated user if valid.
     * @param token JWT token to validate.
     * @throws InvalidCredentialsError if the token is invalid or user not found.
     */
    async validateJwt(token: string): Promise<User> {
        const result = this.jwtService.verify({
            token,
            secret: this.authConfig.JWT_SECRET
        });

        if (result.error || result.jwtPayload === null) {
            throw new InvalidCredentialsError('Invalid JWT token');
        }

        const user = await this.usersService.findById(result.jwtPayload.sub);
        if (!user) {
            throw new InvalidCredentialsError('Invalid JWT token');
        }

        return user;
    }

}
