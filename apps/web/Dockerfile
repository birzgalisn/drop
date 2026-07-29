# syntax=docker/dockerfile:1

FROM node:24.18-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

FROM base AS pruner

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm dlx turbo prune web api --docker

FROM base AS builder

COPY --from=pruner /app/out/json/ .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm fetch --frozen-lockfile \
  && pnpm install --frozen-lockfile --prefer-offline

COPY --from=pruner /app/out/full/ .

ARG APEX
ARG DATABASE_URL
ARG REDIS_URL
ARG VITE_API_BASE_URL
ENV NODE_ENV=production
ENV APEX=${APEX}
ENV DATABASE_URL=${DATABASE_URL}
ENV REDIS_URL=${REDIS_URL}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN pnpm exec turbo run build --filter=web...

FROM nginx:1.31-alpine AS runner

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80/tcp
