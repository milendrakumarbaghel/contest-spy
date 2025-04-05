# Dockerfile
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /backend

# Install dependencies
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /backend/dist ./dist

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "dist/server.js"]








# Old
# Dockerfile
# FROM node:18-alpine

# # Set working directory
# WORKDIR /backend

# # Install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy source files
# COPY . .

# # Build TypeScript
# RUN npm run build

# # Expose port
# EXPOSE 3000

# # Start app
# CMD ["node", "dist/server.js"]
