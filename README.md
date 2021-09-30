# How to start local dev
```bash
docker-compose -f docker/docker-compose.yml up -d --build farmArmy
npm run start
```
# How to deploy to prod

```bash
cp .env .env.local
# update REACT_APP_FARM_ARMY_PROXY_URL to your host
docker-compose -f docker/docker-compose.yml up -d --build
```
