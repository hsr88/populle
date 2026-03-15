FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# Copy all packages
COPY artifacts/ ./artifacts/
COPY lib/ ./lib/
COPY scripts/ ./scripts/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build frontend
RUN BASE_PATH=/ PORT=5173 pnpm --filter @workspace/populle run build

# Build API server
RUN pnpm --filter @workspace/api-server run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "artifacts/api-server/dist/index.cjs"]
