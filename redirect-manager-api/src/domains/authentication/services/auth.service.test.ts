import {beforeEach, describe, expect, it, vi} from "vitest";
import {AuthService} from "./auth.service";
import {RefreshTokenRepository} from "../repositories";
import {UsersRepository} from "../../users/repositories";
import {UsersService} from "../../users/services";
import {JwtService} from "./jwt.service";
import {AuthConfig, JwtHashAlgorithm} from "../../../config/auth.config";
import {RefreshTokenEntity} from "../entities";
import {UserEntity} from "../../users/entities";
import {UserAlreadyExistsError} from "../../users/errors";
import {InvalidCredentialsError} from "../../../shared";

describe('Authentication Service Integration Tests', () => {

    const config = {
        JWT_SECRET: 'test-secret-for-integration-tests',
        TOKEN_HASH_PEPPER: ['test-secret-for-integration-tests-hash', 'another-test-secret-for-integration-tests-hash'],
        JWT_HASH_ALGORITHM: JwtHashAlgorithm.SHA256,
        PASSWORD_SALT_ROUNDS: 10,
    } satisfies AuthConfig;

    let authService: AuthService;
    let usersService: UsersService;
    let mockUsersRepository: Partial<UsersRepository>;
    let mockTokenRepository: Partial<RefreshTokenRepository>;
    let jwtService: JwtService;

    // In-memory storage for simulating database
    const usersStorage = new Map<string, UserEntity>();
    const tokensStorage = new Map<string, RefreshTokenEntity>();

    beforeEach(() => {
        // Clear storage
        usersStorage.clear();
        tokensStorage.clear();

        // Reset all mocks
        vi.clearAllMocks();

        // Create mock repositories with more realistic behavior
        mockUsersRepository = {
            findByUsername: vi.fn((username: string) => {
                const users = Array.from(usersStorage.values());
                const user = users.find(u => u.username === username);
                return Promise.resolve(user || null);
            }),
            save: vi.fn((userData: { username: string, hashedPassword: string }) => {
                const newUser: UserEntity = {
                    id: `user-${Date.now()}-${Math.random()}`,
                    username: userData.username,
                    password: userData.hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    role: 'ADMIN',
                };
                usersStorage.set(newUser.id, newUser);
                return Promise.resolve(newUser);
            }),
            findById: vi.fn((id: string) => {
                const user = usersStorage.get(id);
                return Promise.resolve(user || null);
            }),
            update: vi.fn((user: UserEntity) => {
                usersStorage.set(user.id, user);
                return Promise.resolve(user);
            })
        };

        mockTokenRepository = {
            save: vi.fn((tokenData: Pick<RefreshTokenEntity, 'hashedToken' | 'expiresAt' | 'userId'>) => {
                const newToken: RefreshTokenEntity = {
                    id: `token-${Date.now()}-${Math.random()}`,
                    hashedToken: tokenData.hashedToken,
                    expiresAt: tokenData.expiresAt,
                    createdAt: new Date(),
                    userId: tokenData.userId,
                    revoked: false,
                };
                tokensStorage.set(newToken.id, newToken);
                return Promise.resolve(newToken);
            }),
            findByToken: vi.fn((token: string) => {
                for (const entity of tokensStorage.values()) {
                    if (entity.hashedToken === token) return Promise.resolve(entity);
                }
                return Promise.resolve(null);
            }),
            delete: vi.fn((token: RefreshTokenEntity) => {
                tokensStorage.delete(token.id);
                return Promise.resolve();
            }),
            deleteById: vi.fn((id: string) => {
                tokensStorage.delete(id);
                return Promise.resolve();
            }),
            findByUserId: vi.fn((userId: string) => {
                const tokens = Array.from(tokensStorage.values());
                return Promise.resolve(tokens.filter(t => t.userId === userId));
            }),
            deleteAll: vi.fn((tokens: RefreshTokenEntity[]) => {
                for (const token of tokens) {
                    tokensStorage.delete(token.id);
                }
                return Promise.resolve();
            })
        };

        // Use real JWT service for integration testing
        jwtService = new JwtService();

        // Create real users service with mock repository
        usersService = new UsersService(
            mockUsersRepository as UsersRepository,
            config
        );

        // Create auth service with users service and mock token repository
        authService = new AuthService(
            usersService,
            mockTokenRepository as RefreshTokenRepository,
            jwtService,
            config
        );
    });

    describe('Complete Authentication Flow Integration Tests', () => {
        it('should register new user, authenticate with password, and validate token', async () => {
            console.log('[DEBUG_LOG] Starting complete authentication flow test');

            // Step 1: Register a new user
            const username = 'integrationuser';
            const password = 'password123';

            const registeredUser = await authService.registerUser({username, password});
            console.log('[DEBUG_LOG] User registered:', registeredUser?.username);
            if (!registeredUser) throw new Error('User registration failed');

            expect(registeredUser).toBeDefined();
            expect(registeredUser.username).toBe(username);
            expect(registeredUser.id).toBeDefined();

            // Step 2: Authenticate with the password (Login)
            const loginResult = await authService.login({username, password});
            console.log('[DEBUG_LOG] Login result:', loginResult ? 'success' : 'failed');

            expect(loginResult).not.toBeNull();
            expect(loginResult.refreshToken).toBeDefined();
            expect(loginResult.user.username).toBe(username);
            expect(loginResult.jwt.expiresIn).toBeGreaterThan(0);

            // Step 3: Issue JWT from Refresh Token
            const issueResult = await authService.issueJwt(loginResult.refreshToken.refreshToken);
            console.log('[DEBUG_LOG] JWT issued from refresh token:', issueResult ? 'success' : 'failed');

            expect(issueResult).not.toBeNull();
            expect(issueResult.jwt).toBeDefined();
            expect(issueResult.expiresIn).toBeGreaterThan(0);

            // Step 4: Validate the issued JWT
            const validatedUser = await authService.validateJwt(issueResult.jwt);
            console.log('[DEBUG_LOG] JWT validated:', validatedUser ? 'success' : 'failed');
            expect(validatedUser.id).toBe(loginResult.user.id);
            expect(validatedUser.username).toBe(username);
        });

        it('should reject authentication with wrong password', async () => {
            console.log('[DEBUG_LOG] Starting wrong password test');

            // Register a user first
            const username = 'wrongpassworduser';
            const correctPassword = 'correctpassword123';
            const wrongPassword = 'wrongpassword123';

            await authService.registerUser({username, password: correctPassword});
            console.log('[DEBUG_LOG] User registered for wrong password test');

            // Try to authenticate with wrong password - should throw InvalidCredentialsError
            await expect(authService.login({username, password: wrongPassword}))
                .rejects
                .toThrow(InvalidCredentialsError);
        });

        it('should reject authentication with wrong username', async () => {
            console.log('[DEBUG_LOG] Starting wrong username test');

            // Register a user first
            const correctUsername = 'correctuser';
            const wrongUsername = 'wronguser';
            const password = 'password123';

            await authService.registerUser({username: correctUsername, password});
            console.log('[DEBUG_LOG] User registered for wrong username test');

            // Try to authenticate with wrong username - should throw InvalidCredentialsError
            await expect(authService.login({username: wrongUsername, password}))
                .rejects
                .toThrow(InvalidCredentialsError);
        });

        it('should reject invalid token during JWT validation', async () => {
            console.log('[DEBUG_LOG] Starting invalid token test');

            // Try to extract user with an invalid token
            const invalidToken = 'invalid.jwt.token';

            await expect(authService.validateJwt(invalidToken))
                .rejects
                .toThrow(InvalidCredentialsError);
        });

        it('should logout user by revoking refresh token', async () => {
            const username = 'logoutuser';
            const password = 'password123';
            await authService.registerUser({username, password});
            const loginResult = await authService.login({username, password});

            const refreshToken = loginResult.refreshToken.refreshToken;

            // Should be able to issue JWT initially
            await expect(authService.issueJwt(refreshToken)).resolves.toBeDefined();

            // Logout
            await authService.logout(refreshToken);

            // Should not be able to issue JWT after logout
            await expect(authService.issueJwt(refreshToken))
                .rejects
                .toThrow(InvalidCredentialsError);
        });

        it('should logout from all devices', async () => {
            const username = 'manydevicesuser';
            const password = 'password123';
            await authService.registerUser({username, password});

            const login1 = await authService.login({username, password});
            const login2 = await authService.login({username, password});

            expect(tokensStorage.size).toBe(2);

            await authService.logout(login1.refreshToken.refreshToken, true);

            expect(tokensStorage.size).toBe(0);

            expect(authService.issueJwt(login1.refreshToken.refreshToken)).rejects.toThrow(InvalidCredentialsError);
            expect(authService.issueJwt(login2.refreshToken.refreshToken)).rejects.toThrow(InvalidCredentialsError);
        });

        it('should prevent duplicate user registration', async () => {
            console.log('[DEBUG_LOG] Starting duplicate user registration test');

            // Register a user first
            const username = 'duplicateuser';
            const password = 'password123';

            await authService.registerUser({username, password});
            console.log('[DEBUG_LOG] First user registered successfully');

            // Try to register the same user again
            expect(authService.registerUser({username, password}))
                .rejects
                .toThrow(UserAlreadyExistsError);

            console.log('[DEBUG_LOG] Duplicate registration correctly rejected');
        });
    });
})