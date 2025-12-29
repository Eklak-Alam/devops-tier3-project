# ----------------------------
# STAGE 1: Build the App
# ----------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy deps
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ----------------------------
# STAGE 2: Run the App (Production)
# ----------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Set env to production for speed
ENV NODE_ENV=production

# Copy only necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port 3000
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]