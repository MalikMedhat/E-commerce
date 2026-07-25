FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# ── Build stage ──
FROM base AS builder
WORKDIR /app

# Copy workspace config
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY ECommerce-Builder/package.json ECommerce-Builder/pnpm-lock.yaml ECommerce-Builder/pnpm-workspace.yaml ECommerce-Builder/tsconfig.base.json ./ECommerce-Builder/

# Copy all workspace packages
COPY ECommerce-Builder/lib ./ECommerce-Builder/lib
COPY ECommerce-Builder/artifacts/api-server ./ECommerce-Builder/artifacts/api-server
COPY ECommerce-Builder/artifacts/shop ./ECommerce-Builder/artifacts/shop

# Install dependencies
RUN cd ECommerce-Builder && pnpm install --frozen-lockfile

# Build the API server
RUN cd ECommerce-Builder/artifacts/api-server && pnpm run build

# Build the frontend
RUN cd ECommerce-Builder/artifacts/shop && pnpm run build

# ── Production stage ──
FROM base AS runner
WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/ECommerce-Builder/artifacts/api-server/dist ./api-server/dist
COPY --from=builder /app/ECommerce-Builder/artifacts/shop/dist ./shop/dist
COPY --from=builder /app/ECommerce-Builder/node_modules ./node_modules

# Copy package.json for the API server
COPY --from=builder /app/ECommerce-Builder/artifacts/api-server/package.json ./api-server/package.json

EXPOSE 8088

CMD ["node", "--enable-source-maps", "./api-server/dist/index.mjs"]