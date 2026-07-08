# flask-ci-demo

App de test Node.js/Express pour valider le déploiement sur SystalinkCloud Datacloud.

## Endpoints

| Route | Description |
|-------|-------------|
| `GET /` | Dashboard HTML — statut container, mémoire, env vars |
| `GET /health` | Health check JSON `{ status: "ok", uptime: 42 }` |
| `GET /ping` | Ping/pong JSON |
| `GET /info` | Info complète JSON (hostname, memory, env, headers) |

## Déploiement sur la plateforme

- **Image Docker Hub** : `mouhmedsn02/flask-ci-demo`
- **Port** : `3000`
- **Framework** : Docker
- **RAM recommandée** : 512MB (plan Starter)

## CI/CD

GitHub Actions build et push automatiquement l'image sur Docker Hub à chaque push sur `main`.

**Secrets GitHub à configurer** :
- `DOCKERHUB_USERNAME` → `mouhmedsn02`
- `DOCKERHUB_TOKEN` → ton token Docker Hub

## Run local

```bash
npm install
npm start
# http://localhost:3000
```

## Docker local

```bash
docker build -t flask-ci-demo .
docker run -p 3000:3000 flask-ci-demo
```
