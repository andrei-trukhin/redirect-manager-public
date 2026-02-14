#!/bin/sh

# Initialize a variable to store the value from the flag.
ROOT_DIR="/app/dist/assets"
ENV_PREFIX="RUNTIME_"

echo "Scanning environment variables with prefix '${ENV_PREFIX}' for replacement in files under '${ROOT_DIR}'..."

env | grep "^${ENV_PREFIX}" | while IFS='=' read -r key value; do
    # This is the placeholder we'll look for in the code, e.g., "__VITE_API_URL__"
    # This assumes your placeholders are formatted like __KEY__
    placeholder="${key}"

    echo "  • Replacing placeholder ${placeholder} in JS bundle"

    # Use sed to replace the placeholder in the target file(s)
    # The "-i" flag means "in-place" editing.
    # We use '|' as a delimiter to avoid issues with URLs in the value.
    find "$ROOT_DIR" -type f \
            -exec sed -i "s|${placeholder}|${value}|g" {} +
done

echo "Environment variable replacement completed."

serve -c serve.json -l 3000
