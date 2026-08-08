# Drop

Photo / file sharing platform (product name **Drop**; domain aggregate **space**).

## Structure

```
apps/api                         Thin Nest shell
apps/web                         Thin React shell

packages/tooling                 Build/DX (`@repo/tooling`)
packages/nest                    Nest building blocks (`@repo/nest`)
packages/react                   React building blocks (`@repo/react`)
packages/shared                  Isomorphic helpers/schemas (`@repo/shared`)

.devops/  .github/
.cursor/rules/                   Agent rules (split by concern)
```

### Package convention

| Area    | Path               | Package         | Notes                                                                                                                            |
| ------- | ------------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Tooling | `packages/tooling` | `@repo/tooling` | Subpaths: `/typescript/*`, `/oxlint/*`, `/jest`, `/postcss/mantine`                                                              |
| Nest    | `packages/nest`    | `@repo/nest`    | Subpaths: `/common`, `/config`, `/cors`, `/drizzle`, `/health`, `/media`, `/tus`, `/spaces`, `/pubsub`, `/errors`, `/validation` |
| React   | `packages/react`   | `@repo/react`   | Subpaths: `/design-system`, `/spaces`, `/form`. Feature modules: `data-access/` / `feature/` / `ui/` / `util/`                   |
| Shared  | `packages/shared`  | `@repo/shared`  | AppError, UploadType, space limits/schemas                                                                                       |

Rules:

- Tooling, Nest, and React are each a **single** package with folder modules + export subpaths.
- React features use `data-access/` / `feature/` / `ui/` / `util/`.
- Apps stay thin shells that compose `@repo/nest` / `@repo/react`.
- Agent navigation: see [`.cursor/rules/`](.cursor/rules/) and domain READMEs under `packages/nest/src/spaces/`, `packages/nest/src/tus/`, `packages/react/src/spaces/`.

## Local

```bash
cp .env.local.example .env.local
make up
```

Compose installs deps and runs `pnpm run dev` (migrations, schema, codegen, and app watchers).

Hosts: `api.drop.localhost`, `app.drop.localhost`, `studio.drop.localhost`.

Migrations run automatically on turbo boot via `@repo/nest#db:deploy` (see `turbo.json`).

## Production

See [`.devops/README.md`](.devops/README.md) and [`.github/ACTIONS.md`](.github/ACTIONS.md).
