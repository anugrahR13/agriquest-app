# Use Node.js 18 Alpine Linux
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000 3001

# Create startup script
RUN echo '#!/bin/sh\nnpm run db:migrate\nnpm run dev:full' > /app/start.sh
RUN chmod +x /app/start.sh

# Start the application
CMD [\"/app/start.sh\"]"