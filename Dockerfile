FROM node:20-slim

# Pin pnpm 10 — lockfile and onlyBuiltDependencies are for v10
# (pnpm 11 uses allowBuilds and ignores onlyBuiltDependencies)
RUN npm install -g pnpm@10.32.1

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY tsconfig.base.json ./

COPY artifacts/ ./artifacts/
COPY lib/ ./lib/
COPY scripts/ ./scripts/

RUN pnpm install --frozen-lockfile

RUN BASE_PATH=/ PORT=5173 pnpm --filter @workspace/populle run build

RUN pnpm --filter @workspace/api-server run build

EXPOSE 3000

CMD ["node", "artifacts/api-server/dist/index.cjs"]
