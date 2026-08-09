# GitHub Actions

GitHub **Variables** and **Secrets** are the source of truth for production.
Workflows export them into the environment and `docker stack deploy` interpolates stack YAML on the VPS over SSH — nothing to maintain as `.env` on the server.

| File                                         | Trigger              | What                                         |
| -------------------------------------------- | -------------------- | -------------------------------------------- |
| [`deploy.yaml`](workflows/deploy.yaml)       | push `main` / manual | entry: verify → image → migrate → stack      |
| [`verify.yaml`](workflows/verify.yaml)       | reusable             | format + turbo generate / lint / check-types |
| [`image.yaml`](workflows/image.yaml)         | reusable             | Docker build + GHCR push                     |
| [`migrate.yaml`](workflows/migrate.yaml)     | reusable / manual    | Drizzle migrate via SSH tunnel               |
| [`stack.yaml`](workflows/stack.yaml)         | reusable             | pull + deploy one `.devops/stack-*.yaml`     |
| [`provision.yaml`](workflows/provision.yaml) | manual               | Swarm init, networks, edge + data stacks     |

VPS prep (Docker Engine, `deploy` user, DNS) is still once on the box — see [`.devops/README.md`](../.devops/README.md).

## Deploy chain

```text
verify → image-api + image-web → migrate → stack-api → stack-web
```

Names match the artifacts: `image.yaml` pushes GHCR images; `stack.yaml` merges [`stack-api.yaml`](../.devops/stack-api.yaml) / [`stack-web.yaml`](../.devops/stack-web.yaml) into stack `drop` (services `drop_api` / `drop_web`). Job `needs` rolls api before web; each update waits on the service healthcheck (`--detach=false`).

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

`stack` builds Swarm-internal URLs from the Postgres/Redis secrets:

- `DATABASE_URL=postgresql://…@postgres:5432/…`
- `REDIS_URL=redis://:…@redis:6379/0`

**Migrate** SSHs to the VPS and forwards `localhost:5432` (Postgres is ingress-published by `stack-data` for this tunnel). Public access is blocked by UFW/`DOCKER-USER` — do **not** `ufw route allow` `:5432`. See [`.devops/README.md`](../.devops/README.md).
