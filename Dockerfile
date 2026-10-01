# Multi-stage Dockerfile for Pudhumai Penn AI (Google Cloud Run Compatible)
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build client
COPY . .
RUN npm run build

# Production image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm install -g tsx

# Copy built frontend assets and required server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/server.ts ./server.ts

# Non-root user for security
USER node

# Expose port (Cloud Run overrides PORT env var dynamically)
EXPOSE 3000

# Start server
CMD ["tsx", "server.ts"]
