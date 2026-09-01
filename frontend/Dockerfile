# Multi-stage Dockerfile for Raahi Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Build argument for backend API URL
ARG VITE_BASE_URL=http://localhost:4000
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production NGINX Server
FROM nginx:alpine

# Copy built production assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx configuration for React SPA routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
