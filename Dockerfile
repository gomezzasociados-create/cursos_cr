# Stage 1: Build Frontend App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build frontend dist bundle
COPY . .
RUN npm run build

# Stage 2: Production Server Environment
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8083

# Copy package manifests and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built dist files and backend server code
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

EXPOSE 8083

CMD ["node", "server/index.js"]
