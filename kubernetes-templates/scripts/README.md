# Kubernetes Template Scripts

This directory contains utility scripts for managing Kubernetes templates and configurations.

## replace-env-variables.sh

A shell script that processes template files by replacing environment variable placeholders with actual values from a `.env` file.

### Purpose

This script is designed to:
- Load environment variables from a `.env` file
- Replace `${VARIABLE_NAME}` placeholders in template files with actual values
- Output the processed template to stdout

### Usage

```bash
./replace-env-variables.sh <template_file> [env_file]
```

#### Parameters

- `template_file` (required): The template file containing `${var}` placeholders to be replaced
- `env_file` (optional): Path to the environment file (defaults to `.env` if not specified)

#### Examples

1. **Basic usage with default .env file:**
   ```bash
   ./replace-env-variables.sh my-template.yaml
   ```

2. **Using a custom environment file:**
   ```bash
   ./replace-env-variables.sh my-template.yaml production.env
   ```

3. **Output to a new file:**
   ```bash
   ./replace-env-variables.sh template.yaml > processed-config.yaml
   ```

4. **Process Kubernetes deployment template:**
   ```bash
   ./replace-env-variables.sh ../redirect-manager-api.yaml > final-deployment.yaml
   ```

### Template Format

Your template files should use the `${VARIABLE_NAME}` format for placeholders:

```yaml
# Example template.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${APP_NAME}
spec:
  replicas: ${REPLICA_COUNT}
  template:
    spec:
      containers:
      - name: ${CONTAINER_NAME}
        image: ${IMAGE_NAME}:${IMAGE_TAG}
        env:
        - name: DATABASE_URL
          value: ${DATABASE_URL}
```

### Environment File Format

The environment file should follow the standard `.env` format:

```bash
# Example .env
APP_NAME=my-application
REPLICA_COUNT=3
CONTAINER_NAME=my-app
IMAGE_NAME=my-registry/my-app
IMAGE_TAG=v1.2.3
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Comments are supported
# Empty lines are ignored
```

### Features

- **Flexible input**: Works with any text file containing `${VARIABLE}` placeholders
- **Comment support**: Ignores lines starting with `#` in environment files
- **Whitespace handling**: Automatically trims leading and trailing whitespace
- **Error handling**: Validates file existence and provides helpful error messages
- **Fallback support**: Uses `envsubst` if available, falls back to `sed` if not
- **Safe character escaping**: Properly handles special characters in variable values

### Error Handling

The script will exit with an error if:
- Incorrect number of arguments provided
- Template file doesn't exist
- Environment file doesn't exist

### Dependencies

- **Preferred**: `envsubst` (usually available in `gettext` package)
- **Fallback**: `sed` (standard on most Unix systems)

### Integration with Kubernetes

This script is particularly useful for:
- Processing Kubernetes manifests before applying them
- Creating environment-specific configurations
- Automating deployment pipelines
- Managing secrets and configuration maps

Example workflow:
```bash
# 1. Set up your environment variables
cp .env.example .env
# Edit .env with your values

# 2. Process the template
./replace-env-variables.sh ../redirect-manager-api.yaml > processed-deployment.yaml

# 3. Apply to Kubernetes
kubectl apply -f processed-deployment.yaml
```
