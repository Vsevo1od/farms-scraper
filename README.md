Website is deployed to https://farms-scraper.vsevo1od.ru/

# How to start local dev
```bash
./deploy.sh
npm run start
```
# How to deploy to prod

```bash
cp .env .env.local
# update all variables in .env.local
./deploy.sh
```
