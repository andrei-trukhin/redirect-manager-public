# Kubernetes Deployment Guide

## Prerequisites

### Install Required Tools

#### Nginx Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.14.3/deploy/static/provider/cloud/deploy.yaml
```

#### Required CLI Tools
- `kubectl` - Kubernetes command-line tool
- `envsubst` (optional) - For environment variable substitution (part of GNU gettext)

## Environment Configuration

### 1. Create Environment File

Create a `.env` file in the kubernetes-templates directory with your environment-specific values:

```bash
# Database Configuration
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_password
DATABASE_NAME=redirect_manager

# API Configuration
JWT_SECRET=your_jwt_secret_key_here
BASE_API_PATH=/api
REVERSE_PROXY_TARGET_BASE_URL=http://redirect-manager-demo-website-app-service:80

# Application Configuration
APP_ENVIRONMENT=production
LOG_LEVEL=info

# TLS Configuration (if using custom certificates)
TLS_CERT_PATH=./tls.crt
TLS_KEY_PATH=./tls.key

# Kubernetes Configuration
NAMESPACE=default
```

**Security Note**: Never commit the `.env` file to version control. Use `.env.example` as a template.

### KUBECONFIG Management

The `KUBECONFIG` environment variable can be used to specify which Kubernetes configuration file to use when you have multiple clusters or contexts:

```bash
# Set KUBECONFIG to use a specific configuration file
export KUBECONFIG=/path/to/your/kubeconfig

# Use multiple kubeconfig files (colon-separated on Unix/Linux/macOS)
export KUBECONFIG=~/.kube/config:~/.kube/dev-config:~/.kube/prod-config

# Verify current context
kubectl config current-context

# List available contexts
kubectl config get-contexts

# Switch between contexts
kubectl config use-context production-cluster
```

**Important Considerations:**
- If `KUBECONFIG` is not set, kubectl uses `~/.kube/config` by default
- Always verify you're connected to the correct cluster before deploying: `kubectl cluster-info`
- For production deployments, consider using separate kubeconfig files for different environments
- The deployment scripts will use whatever context is currently active in kubectl

### 2. Prepare Template Files

Update your Kubernetes manifest files to use environment variable placeholders where needed:

```yaml
# Example: Using placeholders in secret files
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
  namespace: ${NAMESPACE}
type: Opaque
stringData:
  POSTGRES_USER: "${POSTGRES_USER}"
  POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
```

## Deployment Process

### Method 1: Manual Deployment with Scripts

#### Step 1: Process Templates and Apply Secrets

Process secret files first to ensure sensitive data is available:

```bash
# Navigate to kubernetes-templates directory
cd kubernetes-templates

# Make script executable
chmod +x scripts/replace-env-variables.sh

# Process and apply PostgreSQL secrets
./scripts/replace-env-variables.sh postgress.secret.yaml | kubectl apply -f -

# Process and apply API secrets
./scripts/replace-env-variables.sh redirect-manager-api.secret.yaml | kubectl apply -f -
```

#### Step 2: Apply Configuration Maps

```bash
# Apply PostgreSQL configuration
./scripts/replace-env-variables.sh postgress.config.yaml | kubectl apply -f -

# Apply API configuration
./scripts/replace-env-variables.sh redirect-manager-api.config.yaml | kubectl apply -f -

# Apply UI configuration
./scripts/replace-env-variables.sh redirect-manager-ui.config.yaml | kubectl apply -f -
```

#### Step 3: Deploy Application Components

```bash
# Deploy PostgreSQL
./scripts/replace-env-variables.sh postgress.yaml | kubectl apply -f -

# Deploy API application
./scripts/replace-env-variables.sh redirect-manager-api.yaml | kubectl apply -f -

# Deploy UI application
./scripts/replace-env-variables.sh redirect-manager-ui.yaml | kubectl apply -f -

# Deploy demo website
./scripts/replace-env-variables.sh redirect-manager-demo-website.yaml | kubectl apply -f -
```

### Method 2: Batch Deployment

Deploy all components at once:

```bash
# Process and apply all configurations in the correct order
for file in \
  postgress.secret.yaml \
  redirect-manager-api.secret.yaml \
  postgress.config.yaml \
  redirect-manager-api.config.yaml \
  redirect-manager-ui.config.yaml \
  postgress.yaml \
  redirect-manager-api.yaml \
  redirect-manager-ui.yaml \
  redirect-manager-demo-website.yaml; do
  echo "Deploying $file..."
  ./scripts/replace-env-variables.sh "$file" | kubectl apply -f -
done
```

### Method 3: Using Custom Environment File

If you have multiple environments (dev, staging, production):

```bash
# Use environment-specific configuration
./scripts/replace-env-variables.sh postgress.secret.yaml production.env | kubectl apply -f -

# Or set environment variable to specify the file
export ENV_FILE=staging.env
./scripts/replace-env-variables.sh redirect-manager-api.yaml "$ENV_FILE" | kubectl apply -f -
```

## Advanced Deployment Options

### Dry Run Validation

Test your deployment without applying changes:

```bash
# Validate generated YAML
./scripts/replace-env-variables.sh redirect-manager-api.yaml | kubectl apply --dry-run=client -f -

# Check for syntax errors
./scripts/replace-env-variables.sh redirect-manager-api.yaml | kubectl apply --validate=strict --dry-run=server -f -
```

### Namespace-specific Deployment

Deploy to a specific namespace:

```bash
# Create namespace if it doesn't exist
kubectl create namespace production

# Deploy with namespace override
./scripts/replace-env-variables.sh redirect-manager-api.yaml | kubectl apply -n production -f -
```

### Save Processed Templates

Generate and save processed templates for review:

```bash
# Create processed-templates directory
mkdir -p processed-templates

# Process and save all templates
for file in *.yaml; do
  if [[ -f "$file" && "$file" != "processed-"* ]]; then
    ./scripts/replace-env-variables.sh "$file" > "processed-templates/processed-$file"
  fi
done

# Apply from saved files
kubectl apply -f processed-templates/
```

## Verification and Troubleshooting

### Check Deployment Status

```bash
# Check all resources
kubectl get all

# Check specific deployments
kubectl get deployment,service,configmap,secret

# Check pods status
kubectl get pods -o wide

# Check logs
kubectl logs -f deployment/redirect-manager-api
kubectl logs -f deployment/redirect-manager-ui
```

### Debug Configuration Issues

```bash
# Describe resources for troubleshooting
kubectl describe pod <pod-name>
kubectl describe service <service-name>

# Check environment variables in pods
kubectl exec -it <pod-name> -- env | grep -E "(POSTGRES|JWT|API)"

# Test connectivity between services
kubectl exec -it <pod-name> -- nslookup postgres-service
```

### Common Issues

1. **Environment variables not replaced**: Ensure `.env` file exists and contains required variables
2. **Permission errors**: Make sure scripts are executable (`chmod +x scripts/replace-env-variables.sh`)
3. **Resource not found**: Check if secrets and configmaps are applied before deployments
4. **Image pull errors**: Verify image names and registry access

## Cleanup

To remove all deployed resources:

```bash
# Delete in reverse order
kubectl delete -f redirect-manager-demo-website.yaml
kubectl delete -f redirect-manager-ui.yaml
kubectl delete -f redirect-manager-api.yaml
kubectl delete -f postgress.yaml

# Delete configs and secrets
kubectl delete configmap --all
kubectl delete secret --all
```

## Security Best Practices

1. **Environment Files**: 
   - Never commit `.env` files to version control
   - Use restrictive permissions: `chmod 600 .env`
   - Rotate secrets regularly

2. **Kubernetes Secrets**:
   - Use native Kubernetes secrets for sensitive data
   - Consider using external secret management tools (e.g., HashiCorp Vault)

3. **RBAC**:
   - Implement proper Role-Based Access Control
   - Use service accounts with minimal required permissions

4. **Network Policies**:
   - Implement network segmentation between namespaces
   - Restrict pod-to-pod communication as needed
