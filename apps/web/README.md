# Web

Vite + React + Mantine. Apollo (HTTP + graphql-ws), tus client, SpaceWizard + share viewer.

## Routes

| Path                 | Screen                       |
| -------------------- | ---------------------------- |
| `/`                  | Landing dropzone (Select)    |
| `/spaces/new/review` | Review                       |
| `/spaces/new/share`  | Create share (PIN + expiry)  |
| `/s/$token`          | Recipient PIN gate + gallery |

## Docker

```bash
docker build -f apps/web/Dockerfile --build-arg VITE_API_BASE_URL=http://api.drop.localhost -t drop-web .
```
