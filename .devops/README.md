# Production deploy (Docker Swarm)

**Config lives in GitHub** (Variables + Secrets). Workflows pass them to the VPS when running `docker stack deploy` — you do not keep a production `.env` on the server.

See [`.github/README.md`](../.github/README.md) for the full vars/secrets tables and workflows.

## Layout

| File                                 | Stack       | What                                   |
| ------------------------------------ | ----------- | -------------------------------------- |
| [`stack-edge.yaml`](stack-edge.yaml) | `drop_edge` | Traefik (TLS via Cloudflare DNS)       |
| [`stack-data.yaml`](stack-data.yaml) | `drop_data` | Postgres + Redis + `media-provision`   |
| [`stack-app.yaml`](stack-app.yaml)   | `drop_app`  | API + web (mounts shared `drop_media`) |

## One-time VPS (Ubuntu 22.04+)

Stay in a single SSH session with a spare session open before locking things down. Run as `root` / `sudo`; use `sudo -u deploy` for deploy-user steps.

### 1. Docker Engine

```bash
curl -fsSL https://get.docker.com | sudo sh
```

### 2. Deploy user

GitHub Actions SSHs as this user (`SSH_USER`). Do not use `root`.

```bash
sudo adduser deploy
sudo usermod -aG docker deploy
```

### 3. SSH key for Actions

Copy the **private** key into the `SSH_KEY` secret (full PEM).

```bash
sudo -u deploy bash -lc '
  mkdir -p ~/.ssh && chmod 700 ~/.ssh
  ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
  cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
  chmod 600 ~/.ssh/authorized_keys ~/.ssh/id_ed25519
  cat ~/.ssh/id_ed25519
'

sudo -u deploy docker ps
```

### 4. UFW hardening

Default deny inbound. Public: SSH + HTTP/HTTPS only.

Postgres binds host `:5432` for CD migrations, but migrate uses an **SSH tunnel** to `127.0.0.1` — do **not** allow `5432/tcp` from the internet. Traefik dashboard on `:8080` stays closed too (SSH tunnel if needed).

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing

sudo ufw allow OpenSSH
# or: sudo ufw allow 22/tcp

sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Explicitly leave closed (default deny already covers these):
#   5432/tcp  — Postgres (migrate via: ssh -L 5432:127.0.0.1:5432 …)
#   8080/tcp  — Traefik dashboard (ssh -N -L 8080:127.0.0.1:8080 …)

sudo ufw --force enable
sudo ufw status verbose
```

### 5. SSH hardening (recommended)

After you can log in with a key in a second session:

```bash
sudo tee /etc/ssh/sshd_config.d/99-publickey-only.conf >/dev/null <<'EOF'
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
EOF
sudo sshd -t && sudo systemctl reload ssh
```

### 6. DNS + GitHub + provision

Point DNS `api.<APEX>` and `app.<APEX>` at the server. Set Variables/Secrets, then run workflow **provision** (swarm init, networks, edge + data).

After that, pushes to `main` build images and redeploy `drop_app` via the **api** / **web** workflows.

## Manual stack deploy (optional)

If you ever need to deploy from a laptop with the same values exported (or `DOCKER_HOST=ssh://…`):

```bash
docker stack deploy --with-registry-auth -c .devops/stack-edge.yaml drop_edge
docker stack deploy --with-registry-auth -c .devops/stack-data.yaml drop_data
docker stack deploy --with-registry-auth -c .devops/stack-app.yaml drop_app
```

## Check

```bash
docker stack ls
docker service ls
docker service ps drop_app_api
docker service logs -f drop_app_api
```

## Tear down

```bash
docker stack rm drop_app drop_data drop_edge
```
