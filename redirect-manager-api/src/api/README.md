# API Architecture

This directory contains the API layer implementation for the Redirect Manager service, following a modular and consistent architecture pattern.

## Overview

The API architecture is built around several key principles:
- **Consistency**: All routes implement the same `RouterController` interface
- **Modularity**: Routes are organized by version and feature domain  
- **Error Handling**: Global error handling with automatic HTTP error mapping
- **Reduced Boilerplate**: Centralized error mapping middleware simplifies controllers

## Architecture Components

### Base Router System

#### `BaseApiRouter`
The foundation of the routing system that orchestrates all route controllers. It implements the `RouterController` interface and aggregates multiple route controllers under a common API structure.

```typescript
// Usage pattern
const apiRouter = new BaseApiRouter([
  healthRouter,
  authRouter, 
  redirectsRouter
]);
```

#### `RouterController` Interface
All route implementations must implement this interface, ensuring consistency across the API:

```typescript
type RouterController = {
  initRoutes(): Router    // Express router configuration
  getBasePath(): string   // Route base path (e.g., '/v1/health')
}
```

This contract guarantees that:
- Every route controller has a predictable structure
- Base paths are explicitly defined
- Route initialization follows the same pattern

### Global Error Handling

#### HTTP Error Classes
The system provides specialized HTTP error classes located in `shared/errors/`:
- `BadRequestHttpError` (400)
- `UnauthorizedHttpError` (401) 
- `NotFoundHttpError` (404)
- `ConflictHttpError` (409)

#### Global Error Handler
The `httpErrorHandler` in `shared/handlers/` provides centralized error processing:
- Maps specific error types to appropriate HTTP status codes
- Standardizes error response format
- Logs errors appropriately by severity level
- Handles unknown errors as internal server errors (500)

### Error Mapping Middleware

#### `errorMapperHandler`
The `errorMapperHandler` is an Express error-handling middleware that automatically maps domain-specific errors to their corresponding HTTP errors. This ensures that controllers don't need to manually catch and convert every possible domain error.

```typescript
// Shared domain errors are automatically caught and mapped:
// RedirectNotFoundError -> NotFoundHttpError (404)
// UserAlreadyExistsError -> ConflictHttpError (409)
// ParsingError           -> BadRequestHttpError (400)
```

**Benefits:**
- **Cleaner Controllers**: Removes the need for repetitive try-catch blocks in route handlers.
- **Consistent Responses**: Guarantees that the same domain error type always results in the same HTTP response across the entire API.
- **Separation of Concerns**: Keeps the API layer focused on HTTP, while domain logic remains independent of transport-level details.

**Automatic Mappings:**
- `FilterParsingError`, `ParsingError` → `BadRequestHttpError`
- `UniqueConstraintError`, `UserAlreadyExistsError` → `ConflictHttpError`
- `RedirectNotFoundError`, `ApiTokenNotFoundError`, `UserNotFoundError` → `NotFoundHttpError`
- `InvalidCredentialsError`, `InvalidApiTokenError` → `UnauthorizedHttpError`
- `ForbiddenActionError` → `ForbiddenHttpError`

### Authentication & Authorization Middlewares

The system uses a set of middlewares to handle security, located in `shared/middlewares/`.

#### `authBearerTokenMiddleware`
Validates the `Authorization: Bearer <token>` header. It supports two types of tokens:
- **JWT**: Authenticated session tokens. Sets scope to `JWT_SESSION`.
- **API Token**: Permanent tokens for API access. Sets scope defined in the token.

It populates `res.locals.user` with the user object and `res.locals.tokenScope` with the token's scope.

#### `requireRole(roles: UserRole[])`
Restricts access to users with specific roles (e.g., `'ADMIN'`, `'USER'`). 

```typescript
router.route('/users')
  .get(requireRole(['ADMIN']), this.getUsers.bind(this))
```

#### `requireScope(scopes: TokenScope[])`
Restricts access based on the token's scope. This is particularly useful for API tokens.
Supported scopes:
- `JWT_SESSION`: Full access (implicit for JWT tokens).
- `READ_WRITE`: Full access.
- `READ`: Read-only access (allows `GET`, `HEAD`, `OPTIONS`).

```typescript
router.route('/redirects')
  .get(requireScope(['READ', 'READ_WRITE']), this.getAllRedirects.bind(this))
  .post(requireScope(['READ_WRITE']), this.createRedirect.bind(this))
```

## Directory Structure

```
api/
├── base-api.router.ts           # Main router aggregator
├── router-controller.type.ts    # Interface definition
├── shared/                      # Common utilities
│   ├── errors/                 # HTTP error classes
│   ├── handlers/               # Global & error-mapping handlers
│   ├── middlewares/            # Auth & permission middlewares
│   └── methods/                # Common HTTP methods
└── v1/                         # Version 1 routes
    ├── api-tokens/             # API token management
    ├── auth/                   # Authentication routes
    ├── health/                 # Health check routes
    ├── redirects/              # Redirect management routes
    └── users/                  # User management routes
```

## Implementation Pattern

1. **Create Route Controller**: Implement `RouterController` interface
2. **Define Routes**: Use Express router with proper HTTP methods
3. **Register Router**: Add to `BaseApiRouter` collection
4. **Error Handling**: The `errorMapperHandler` middleware (registered at the app level) automatically handles domain errors thrown by controllers.

This architecture ensures scalability, maintainability, and consistency across all API endpoints while minimizing boilerplate code through intelligent use of centralized error handling.
