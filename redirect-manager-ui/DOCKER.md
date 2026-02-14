# Redirect Manager UI - Docker Deployment

This document describes how to build and deploy the Redirect Manager UI using Docker as a service container in a pod.

## Features

- **Multi-stage build**: Optimized for production with minimal image size
- **Security**: Runs as non-root user with security headers
- **Performance**: Lightweight Node.js serve with compression and asset caching
- **Health checks**: Built-in health monitoring
- **SPA routing**: Proper handling of client-side routing
- **Signal handling**: Graceful shutdown with dumb-init
- **Pod-ready**: Designed for container orchestration platforms

## Quick Start

### Build the Docker image

```bash
docker build -t redirect-manager-ui:latest .
```

### Run the container

```bash
docker run -d \
  --name redirect-manager-ui \
  -p 3000:3000 \
  redirect-manager-ui:latest
```

The application will be available at http://localhost:3000

### Using Docker Compose

```bash
docker-compose up -d
```

## Configuration

### Environment Variables

The Docker container supports the following environment variables:

- `NODE_ENV`: Set to `production` (default)
- `PORT`: Port to serve the application on (default: 3000)

### Serve Configuration

The container uses the `serve` package with the following features:

- **SPA routing**: All routes are served through `index.html`
- **Static asset caching**: Assets are cached for 1 year
- **Security headers**: OWASP recommended security headers
- **Gzip compression**: Automatic compression for supported file types

## Production Deployment

### Building for Production

```bash
# Build the image
docker build -t redirect-manager-ui:v1.0.0 .

# Tag for registry
docker tag redirect-manager-ui:v1.0.0 your-registry/redirect-manager-ui:v1.0.0

# Push to registry
docker push your-registry/redirect-manager-ui:v1.0.0
```

### Health Checks

The container includes built-in health checks:

```bash
# Check container health
docker ps

# View health check logs
docker inspect --format='{{json .State.Health}}' redirect-manager-ui
```

### Resource Limits

For production deployments, consider setting resource limits:

```bash
docker run -d \
  --name redirect-manager-ui \
  --memory="256m" \
  --cpus="0.25" \
  -p 3000:3000 \
  redirect-manager-ui:latest
```

### With Docker Compose

```yaml
version: '3.8'

services:
  redirect-manager-ui:
    image: redirect-manager-ui:latest
    ports:
      - "3000:3000"
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
        reservations:
          memory: 128M
          cpus: '0.1'
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
```

## Security

- Container runs as non-root user (uid: 1001)
- Security headers are automatically added via serve configuration
- No unnecessary packages in final image
- Based on Alpine Linux for minimal attack surface

## Pod Deployment

This container is optimized for pod deployment in orchestration platforms like Kubernetes:

### Kubernetes Deployment Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redirect-manager-ui
spec:
  replicas: 3
  selector:
    matchLabels:
      app: redirect-manager-ui
  template:
    metadata:
      labels:
        app: redirect-manager-ui
    spec:
      containers:
      - name: redirect-manager-ui
        image: redirect-manager-ui:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: redirect-manager-ui-service
spec:
  selector:
    app: redirect-manager-ui
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

## Monitoring

### Logs

```bash
# View application logs
docker logs redirect-manager-ui

# Follow logs
docker logs -f redirect-manager-ui
```

### Metrics

The health check can be used for monitoring:

```bash
# Check health
curl http://localhost:3000
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Use a different port
   docker run -p 8080:3000 redirect-manager-ui:latest
   ```

2. **Permission denied**
   ```bash
   # Check if Docker daemon is running
   sudo systemctl status docker
   ```

3. **Build failures**
   ```bash
   # Clean Docker build cache
   docker builder prune -a
   ```

### Debug Mode

To debug issues, you can run the container interactively:

```bash
docker run -it --entrypoint /bin/sh redirect-manager-ui:latest
```

## Image Information

- **Base image**: node:22-alpine
- **Final image size**: ~150MB (optimized)
- **Architecture**: Multi-platform (amd64/arm64)
- **Security**: Non-root user, minimal attack surface
- **Server**: Node.js serve package

## Development

For development purposes, you can mount the built files:

```bash
# Build locally first
npm run build

# Run with mounted dist
docker run -d \
  --name redirect-manager-ui-dev \
  -p 3000:3000 \
  -v $(pwd)/dist:/app/dist:ro \
  redirect-manager-ui:latest
```
