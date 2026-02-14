# Redirect Manager

Redirect Manager is a comprehensive solution for managing URL redirections, users, and authentication. It provides a robust API and a user-friendly UI to streamline the process of setting up and managing redirects.

## Components

### Redirect Manager API
The [Redirect Manager API](./redirect-manager-api) is the core service of the platform, acting as both a management REST API and a high-performance redirect/reverse proxy engine.
- **Service Roles**:
    - **Management API**: Handles the administration of redirect rules, user accounts, and authentication.
    - **Redirect/Reverse Proxy Engine**: Processes incoming requests and either performs a redirect based on configured rules or acts as a reverse proxy to a configured target website/URL.
- **Tech Stack**: Node.js, Express, Prisma ORM, and PostgreSQL.
- **Architecture**: Built using a layered architecture with Domain-Driven Design (DDD) principles for maintainability and scalability.
- **Key Features**: RESTful routes, JWT authentication, caching for redirect rules, and flexible proxying capabilities.

### Redirect Manager UI
The [Redirect Manager UI](./redirect-manager-ui) is the administrative dashboard that provides a graphical interface for interacting with the API.
- **Tech Stack**: React, Vite, Tailwind CSS, and Lucide React.
- **Key Features**: Dashboard for an overview of redirects, tools for creating/editing/deleting rules, and management of user accounts and API tokens.

### Kubernetes Templates
The [Kubernetes Templates](./kubernetes-templates) directory contains the necessary configuration files for deploying the Redirect Manager platform to a Kubernetes cluster.
- **Purpose**: Provides templates for Postgres, the API, the UI, and a demo website.
- **Production Readiness**: These templates can be modified to suit production deployment needs, including environment-specific configurations (via `.env` files and `envsubst`), TLS/SSL setup using Kubernetes secrets, and integration with Ingress controllers like Nginx.
- **Customization**: Users can adjust resource limits, set up persistence for Postgres, and configure persistent storage based on their cloud provider or on-premise infrastructure.
