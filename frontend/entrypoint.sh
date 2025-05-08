#!/bin/sh
set -e

echo "Starting environment variable substitution..."

# Check if running as root or if we have write permissions
if [ ! -w "/app" ]; then
  echo "Warning: Limited write permissions. Some files might not be updated."
fi

# Replace env variable placeholders with real values
printenv | grep NEXT_PUBLIC_ | while read -r line ; do
  key=$(echo $line | cut -d "=" -f1)
  value=$(echo $line | cut -d "=" -f2)

  echo "Replacing $key with actual value in built files..."
  
  # Find all files that we have permissions to modify and replace the placeholders
  find /app -type f -name "*.js" -writable -exec sed -i "s|$key|$value|g" {} \; 2>/dev/null || echo "Warning: Some JS files could not be updated"
  find /app -type f -name "*.html" -writable -exec sed -i "s|$key|$value|g" {} \; 2>/dev/null || echo "Warning: Some HTML files could not be updated"
  find /app -type f -name "*.json" -writable -exec sed -i "s|$key|$value|g" {} \; 2>/dev/null || echo "Warning: Some JSON files could not be updated"
done

echo "Environment variable substitution completed"

# Force Node.js to accept self-signed certificates
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Print the API URL for debugging
echo "Using API URL: $NEXT_PUBLIC_API_URL"

# Execute the container's main process (CMD in Dockerfile)
echo "Starting Next.js application..."
exec "$@"