# Multi-stage build for production-ready React/Vite application
# Stage 1: Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:22-alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production
ENV PORT=3000

# Install dumb-init for proper signal handling and create non-root user for security
RUN apk add --no-cache dumb-init && \
    addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Set working directory
WORKDIR /app

# Install serve package globally and create server configuration
RUN npm install -g serve@14.2.3 && \
    echo '{\
  "public": "./dist",\
  "rewrites": [\
    { "source": "**", "destination": "/index.html" }\
  ],\
  "headers": [\
    {\
      "source": "**/*",\
      "headers": [\
        { "key": "X-Content-Type-Options", "value": "nosniff" },\
        { "key": "X-Frame-Options", "value": "DENY" },\
        { "key": "X-XSS-Protection", "value": "1; mode=block" },\
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }\
      ]\
    },\
    {\
      "source": "**/*.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)",\
      "headers": [\
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }\
      ]\
    }\
  ]\
}' > serve.json

# Run script for replacing placeholders in configuration files with environment variables
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership of app directory
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Use dumb-init as entrypoint for proper signal handling
ENTRYPOINT ["/entrypoint.sh"]
