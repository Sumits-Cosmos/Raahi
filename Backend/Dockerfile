# Production Dockerfile for Raahi Backend
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first for efficient layer caching
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose backend REST & WebSocket port (4000)
EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

# Run with non-root user for security
USER node

CMD ["node", "server.js"]
