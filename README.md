# How to start local dev
```bash
docker-compose -f docker/docker-compose.yml up -d --build farmArmy
npm run start
```
# How to deploy to prod
```bash
docker-compose -f docker/docker-compose.yml up -d --build
```
