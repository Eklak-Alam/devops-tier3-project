# ----------------------------
# STAGE 1: Build the App
# ----------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build the project
COPY . .
RUN npm run build

# ----------------------------
# STAGE 2: Run the App (Ultra-Light)
# ----------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# 1. Copy Public folder (Images, Icons)
COPY --from=builder /app/public ./public

# 2. Copy the "Standalone" build (Tiny size!)
# This automatically includes only the necessary node_modules
COPY --from=builder /app/.next/standalone ./

# 3. Copy Static assets (CSS/JS chunks)
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Start using 'node' directly (Lighter than npm)
CMD ["node", "server.js"]