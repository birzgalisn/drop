# syntax=docker/dockerfile:1

FROM node:24.18-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

FROM base AS pruner

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm dlx turbo prune api --docker

FROM base AS builder

COPY --from=pruner /app/out/json/ .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm fetch --frozen-lockfile \
  && pnpm install --frozen-lockfile --prefer-offline

COPY --from=pruner /app/out/full/ .

ENV NODE_ENV=production

RUN pnpm exec turbo run build --filter=api...

FROM builder AS deployer

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm --filter api --prod deploy /deploy --no-optional

FROM base AS runner

RUN apt-get update \
  && apt-get install -y --no-install-recommends wget \
  && rm -rf /var/lib/apt/lists/*

ENV LD_LIBRARY_PATH=/app/node_modules/@img/sharp-libvips-linux-x64/lib

USER node

COPY --from=deployer --chown=node:node /deploy/ .

EXPOSE 3000/tcp

CMD [ "node", "dist/main.js" ]
