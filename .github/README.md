# GitHub Actions

GitHub **Variables** and **Secrets** are the source of truth for production.
Workflows export them into the environment and `docker stack deploy` interpolates stack YAML on the VPS over SSH — nothing to maintain as `.env` on the server.

| Workflow                                     | Trigger                 | What                                                             |
| -------------------------------------------- | ----------------------- | ---------------------------------------------------------------- |
| [`provision.yaml`](workflows/provision.yaml) | manual                  | Swarm init, networks, `drop_edge` + `drop_data`                  |
| [`api.yaml`](workflows/api.yaml)             | push `main` (api paths) | format/lint/types → build/push → migrate → deploy `drop_app_api` |
| [`web.yaml`](workflows/web.yaml)             | push `main` (web paths) | format/lint/types → build/push → deploy `drop_app_web`           |
| [`ci.yaml`](workflows/ci.yaml)               | reusable                | format + lint + typecheck, then GHCR push                        |
| [`migrate.yaml`](workflows/migrate.yaml)     | reusable / manual       | Drizzle migrate via SSH tunnel to VPS `:5432` (api CD only)      |
| [`cd.yaml`](workflows/cd.yaml)               | reusable                | `stack deploy` → roll one app (`api` or `web`)                   |

VPS prep (Docker Engine, `deploy` user, DNS) is still once on the box — see [`.devops/README.md`](../.devops/README.md).

## Variables

| Name                | Example                        | Used by                                                                     |
| ------------------- | ------------------------------ | --------------------------------------------------------------------------- |
| `PROJECT`           | `drop`                         | Traefik label prefix                                                        |
| `APEX`              | `drop.example.com`             | `api.` / `app.` hosts, TLS SANs; API CORS allows `app.<APEX>` in production |
| `API_BASE_URL`      | `https://api.drop.example.com` | API env                                                                     |
| `VITE_API_BASE_URL` | same as `API_BASE_URL`         | Web image build-arg                                                         |

## Secrets

| Name                   | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `SSH_USER`             | Deploy user in `docker` group                 |
| `SSH_HOST`             | Swarm manager host                            |
| `SSH_KEY`              | Private key for that user                     |
| `SWARM_ADVERTISE_ADDR` | IPv4 for `docker swarm init --advertise-addr` |
| `CF_DNS_API_TOKEN`     | Cloudflare DNS (Traefik ACME)                 |
| `ACME_EMAIL`           | Let's Encrypt contact                         |
| `POSTGRES_USER`        | DB user                                       |
| `POSTGRES_PASSWORD`    | DB password                                   |
| `POSTGRES_DB`          | DB name                                       |
| `REDIS_PASSWORD`       | Redis `requirepass`                           |

`cd` builds Swarm-internal URLs from the Postgres/Redis secrets:

- `DATABASE_URL=postgresql://…@postgres:5432/…`
- `REDIS_URL=redis://:…@redis:6379/0`

**Migrate** SSHs to the VPS and forwards `localhost:5432` (Postgres is published on the host by `stack-data` for this tunnel). Keep `:5432` closed in UFW — see [`.devops/README.md`](../.devops/README.md).
