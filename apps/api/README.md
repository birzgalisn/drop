# API

NestJS + Fastify, built with **Rspack** (SWC decorators + HMR).

| Script                    | What it does                                          |
| ------------------------- | ----------------------------------------------------- |
| `pnpm --filter=api dev`   | `rspack dev` with hot poll + `RunScriptWebpackPlugin` |
| `pnpm --filter=api build` | Production bundle → `dist/main.js`                    |
| `pnpm --filter=api start` | `node dist/main.js`                                   |

HMR closes the Nest app on dispose so import-path / module graph changes reload cleanly. Workspace `@repo/*` packages are bundled (not externalized) so shared import edits participate in HMR.

## Docker

Production image: turbo prune → rspack build → `pnpm deploy` → `node dist/main.js` on port 3000.

```bash
docker build -f apps/api/Dockerfile -t drop-api .
```
