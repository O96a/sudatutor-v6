# Multi-stage build for optimized production image
# Built for Sudanese Teacher (SUDATUTOR) - Production Ready

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
# Use npm install instead of npm ci for compatibility without lock file
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install serve to run the production build
RUN npm install -g serve@14.2.1

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Run the application
CMD ["serve", "-s", "dist", "-l", "3000", "--no-clipboard"]
