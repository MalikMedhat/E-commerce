# ECommerce Builder

A TypeScript monorepo for an e-commerce storefront and API server.

## Structure

- artifacts/shop: React/Vite storefront
- artifacts/api-server: Express API server
- lib/db: Drizzle database schema and connection
- lib/api-client-react: generated React API client
- lib/api-spec: OpenAPI specification and codegen config

## Development

- Install dependencies: pnpm install
- Start API server: pnpm --filter @workspace/api-server run dev
- Start storefront: pnpm --filter @workspace/shop run dev
- Typecheck all packages: pnpm run typecheck
- Build all packages: pnpm run build
