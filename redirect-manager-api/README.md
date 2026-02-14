# Redirect Manager API

The core REST API for managing redirects, users, and authentication. Built with Node.js, Express, and Prisma.

## Architecture Overview

The API is built using a **Layered Architecture** with a strong emphasis on **Domain-Driven Design (DDD)** principles. This ensures a clean separation of concerns, making the system maintainable, testable, and scalable.

### Core Architecture Layers

1.  **API Layer (`src/api`)**:
    *   Responsible for handling HTTP requests and responses.
    *   Defines RESTful routes using Express Routers.
    *   Uses **DTOs (Data Transfer Objects)** for request validation (via `bookish-potato-dto`).
    *   Delegates business logic execution to the Service Layer.

2.  **Domain Layer (`src/domains`)**:
    *   The heart of the application containing business logic and domain rules.
    *   **Entities**: Domain models representing core concepts (Redirects, Users, etc.).
    *   **Services**: Orchestrate domain logic and interact with repositories.
    *   **Repository Interfaces**: Define how data should be persisted, without being tied to a specific technology.

3.  **Infrastructure Layer (`src/domains/*/infrastructure`)**:
    *   Contains concrete implementations of repository interfaces.
    *   Uses **Prisma ORM** for database interaction (PostgreSQL).
    *   Handles low-level details like data mapping and database-specific queries.

4.  **Bootstrap Layer (`src/bootstrap`)**:
    *   Centralized initialization of the application.
    *   Handles **Dependency Injection** manually, wiring together infrastructure, services, and routes.

### Folder Structure

```text
src/
├── api/                # REST Controllers and Route definitions
│   └── v1/             # Versioned API implementations
├── bootstrap/          # App initialization and DI wiring
├── config/             # Configuration management (env vars)
├── domains/            # Domain logic (Entities, Services, Repo interfaces)
│   ├── authentication/ # Auth logic, JWT, Token management
│   ├── redirects/      # Redirect management logic
│   └── users/          # User management logic
├── dtos/               # DTO definitions shared across layers
├── generated/          # Auto-generated code (e.g., Prisma Client)
├── logger/             # Centralized logging utility
├── shared/             # Common utilities and error types
└── server.ts           # Entry point
```

## Tech Stack

*   **Runtime**: Node.js
*   **Framework**: Express 5 (Alpha)
*   **Language**: TypeScript
*   **ORM**: Prisma
*   **Database**: PostgreSQL
*   **Bundler**: Rollup (for production builds)
*   **Testing**: Vitest

## Getting Started

### Prerequisites

*   Node.js (v20+ recommended)
*   npm
*   PostgreSQL database

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Configure environment variables:
    Create a `.env` file in the root directory (refer to `src/config/` for available options).

3.  Set up the database:
    ```bash
    npm run prisma:generate
    ```

### Development

Run the API in development mode with hot-reloading:
```bash
npm run dev
```

### Production Build

1.  Build the project:
    ```bash
    npm run build
    ```

2.  Start the production server:
    ```bash
    npm run start
    ```

## Scripts

*   `npm run build`: Bundles the application using Rollup.
*   `npm run dev`: Starts the development server using `ts-node` and `nodemon`.
*   `npm run test`: Runs unit and integration tests with `vitest`.
*   `npm run prisma:generate`: Generates the Prisma client.
*   `npm run prisma:migrate`: Runs database migrations.

