#!/bin/bash
# Script to fix line endings and permissions for docker-start.sh

# Convert line endings to LF (Unix format)
sed -i 's/\r$//' docker-start.sh

# Make the script executable
chmod +x docker-start.sh

echo "Docker startup script fixed: line endings converted to LF and made executable"