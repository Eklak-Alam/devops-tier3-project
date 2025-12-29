# 1. Use lightweight Node image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first (better caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install --production

# 5. Copy the rest of the app code
COPY . .

# 6. Expose the port
EXPOSE 5000

# 7. Start the server
CMD ["npm", "start"]