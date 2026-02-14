# Authentication Domain

The Authentication Domain is responsible for managing user identity, session persistence, and secure access to the API. It implements a robust authentication mechanism using JWTs (JSON Web Tokens) and Refresh Tokens with rotation and reuse detection.

## Architecture

The domain follows a classic layered architecture:

- **Services**: Contain the business logic for authentication, token issuance, and validation.
    - `AuthService`: The primary coordinator for login, logout, registration, and token management.
    - `JwtService`: A low-level service for signing and verifying JWTs.
    - `ApiTokensService`: Manages long-lived API tokens for programmatic access.
- **Repositories**: Abstract the data access for tokens.
    - `RefreshTokenRepository`: Interface for refresh token persistence.
    - `ApiTokenRepository`: Interface for API token persistence.
- **Infrastructure**: Concrete implementations of repositories, currently using Prisma.
- **Entities**: Domain models representing Refresh Tokens and API Tokens.

## Key Use Cases

### 1. Login
When a user logs in with valid credentials:
1. The `AuthService` verifies the user's password using a secure hash comparison.
2. A new **Refresh Token** (a random 32-byte string) is generated, hashed, and stored in the database.
3. A short-lived **JWT** is signed, containing the user's ID as the subject (`sub`).
4. Both tokens are returned to the client.

### 2. Refresh Token Flow & Rotation
To maintain a secure session without requiring frequent logins, the system uses Refresh Tokens:
- **JWT Issuance**: Clients use the Refresh Token to obtain a new short-lived JWT via the `issueJwt` endpoint.
- **Rotation**: To enhance security, the `refreshToken` method implements **Token Rotation**. When a new Refresh Token is requested, the old one is deleted from the database, and a brand-new one is issued. This ensures that even if a token is leaked, its window of utility is limited.

### 3. Revocation
The system supports multiple levels of revocation:
- **Logout (Single Device)**: Deletes the specific refresh token being used.
- **Logout (All Devices)**: Deletes all refresh tokens associated with the user ID, effectively terminating all active sessions.
- **Token Reuse Detection**: Not supported in the current implementation but can be added by tracking token usage and invalidating tokens that are reused after rotation.

## Token Types

- **JWT (Access Token)**: Short-lived (typically minutes), stateless, used for authorizing every request.
- **Refresh Token**: Long-lived (default 3 days), stateful (stored in DB), used only to obtain new JWTs or new Refresh Tokens.
- **API Token**: Long-lived, named, and scoped tokens used for programmatic access to the API without requiring the full OIDC/Refresh flow.

