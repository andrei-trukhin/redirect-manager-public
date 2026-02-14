#!/bin/bash

# Check if correct number of arguments provided
if [ $# -lt 1 ] || [ $# -gt 2 ]; then
    echo "Usage: $0 <template_file> [env_file]"
    echo "  template_file: File containing \${var} templates to replace"
    echo "  env_file: Optional .env file (defaults to .env)"
    exit 1
fi

TEMPLATE_FILE="$1"
ENV_FILE="${2:-.env}"

# Check if template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Error: Template file $TEMPLATE_FILE not found"
    exit 1
fi

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Environment file $ENV_FILE not found"
    exit 1
fi

echo "Loading environment variables from $ENV_FILE..." >&2

# Load environment variables
while IFS= read -r line || [ -n "$line" ]; do
    # Skip empty lines and comments
    if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
        continue
    fi

    # Remove leading/trailing whitespace
    line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    # Check if line contains '='
    if [[ "$line" =~ ^[^=]+= ]]; then
        # Extract variable name and value
        var_name=$(echo "$line" | cut -d'=' -f1)
        var_value=$(echo "$line" | cut -d'=' -f2-)

        # Export the variable to make it available for envsubst
        eval "export $var_name=\"$var_value\""
        echo "Loaded: $var_name" >&2
    fi
done < "$ENV_FILE"

echo "Processing template file: $TEMPLATE_FILE" >&2
echo "---" >&2

# Use envsubst to replace variables, but if not available, use sed
if command -v envsubst >/dev/null 2>&1; then
    # envsubst replaces ${VAR} patterns with environment variables
    envsubst < "$TEMPLATE_FILE"
else
    # Fallback: manual replacement using sed
    content=$(cat "$TEMPLATE_FILE")

    # Process the .env file again to do replacements
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip empty lines and comments
        if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
            continue
        fi

        # Remove leading/trailing whitespace
        line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

        # Check if line contains '='
        if [[ "$line" =~ ^[^=]+= ]]; then
            # Extract variable name and value
            var_name=$(echo "$line" | cut -d'=' -f1)
            var_value=$(echo "$line" | cut -d'=' -f2-)

            # Escape special characters in the value for sed
            escaped_value=$(printf '%s\n' "$var_value" | sed 's/[[\.*^$()+?{|]/\\&/g')

            # Replace ${VAR_NAME} with the value
            content=$(echo "$content" | sed "s/\${${var_name}}/${escaped_value}/g")
        fi
    done < "$ENV_FILE"

    echo "$content"
fi
