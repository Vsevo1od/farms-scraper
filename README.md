# How to start local dev
```bash
docker-compose -f docker/docker-compose.yml up -d --build farmArmy
npm run start
```
# How to deploy to prod

```bash
cp .env .env.local
# update all variables in .env.local
docker-compose -f docker/docker-compose.yml up -d --build
```
