# Production deploy (Docker Swarm)

**Config lives in GitHub** (Variables + Secrets). Workflows pass them to the VPS when running `docker stack deploy` — you do not keep a production `.env` on the server.

See [`.github/ACTIONS.md`](../.github/ACTIONS.md) for the full vars/secrets tables and workflows.

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

Docker bypasses normal UFW for published container ports. Wire `DOCKER-USER` into UFW (ufw-docker pattern), then allow public HTTP(S). Ingress ports **5432** / **8080** stay closed (no `ufw route allow`) — migrate/dashboard via SSH tunnel to `127.0.0.1`. Traefik **80/443** use Swarm `mode: host` but still traverse Docker’s forward path, so they need **both** `ufw allow` (INPUT) and `ufw route allow` (DOCKER-USER).

**Append Docker rules** (skip if `BEGIN UFW AND DOCKER` is already in the file):

```bash
sudo tee -a /etc/ufw/after.rules >/dev/null <<'EOF'

# BEGIN UFW AND DOCKER
*filter
:ufw-user-forward - [0:0]
:ufw-docker-logging-deny - [0:0]
:DOCKER-USER - [0:0]
-A DOCKER-USER -j ufw-user-forward

-A DOCKER-USER -j RETURN -s 10.0.0.0/8
-A DOCKER-USER -j RETURN -s 172.16.0.0/12
-A DOCKER-USER -j RETURN -s 192.168.0.0/16

-A DOCKER-USER -p udp -m udp --sport 53 --dport 1024:65535 -j RETURN

-A DOCKER-USER -j ufw-docker-logging-deny -p tcp -m tcp --tcp-flags FIN,SYN,RST,ACK SYN -d 192.168.0.0/16
-A DOCKER-USER -j ufw-docker-logging-deny -p tcp -m tcp --tcp-flags FIN,SYN,RST,ACK SYN -d 10.0.0.0/8
-A DOCKER-USER -j ufw-docker-logging-deny -p tcp -m tcp --tcp-flags FIN,SYN,RST,ACK SYN -d 172.16.0.0/12
-A DOCKER-USER -j ufw-docker-logging-deny -p udp -m udp --dport 0:32767 -d 192.168.0.0/16
-A DOCKER-USER -j ufw-docker-logging-deny -p udp -m udp --dport 0:32767 -d 10.0.0.0/8
-A DOCKER-USER -j ufw-docker-logging-deny -p udp -m udp --dport 0:32767 -d 172.16.0.0/12

-A DOCKER-USER -j RETURN

-A ufw-docker-logging-deny -m limit --limit 3/min --limit-burst 10 -j LOG --log-prefix "[UFW DOCKER BLOCK] "
-A ufw-docker-logging-deny -j DROP

COMMIT
# END UFW AND DOCKER
EOF
```

**Defaults and public allows:**

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

**Allow Docker-forwarded HTTP(S):**

```bash
sudo ufw route allow proto tcp from any to any port 80
sudo ufw route allow proto tcp from any to any port 443
```

**Enable:**

```bash
sudo ufw --force enable
sudo ufw reload
sudo ufw status verbose
```

Verify from outside: `nc -vz $HOST 5432` and `8080` fail; `80` / `443` succeed.

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
