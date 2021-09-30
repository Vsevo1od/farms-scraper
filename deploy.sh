#!/usr/bin/env bash
if [ -f .env.local ]
then
    envFile=".env.local"
else 
    envFile=".env"
fi

echo "Using $envFile"
source "$envFile"

if [[ "$WEB_EXTERNAL_PORT" == "$FARM_ARMY_PROXY_EXTERNAL_PORT" ]]
then
    echo "Same port"
    additionalDockerComposeType="same-port"
else
    echo "Several ports"
    additionalDockerComposeType="several-ports"
fi

docker-compose -f docker/docker-compose.yml\
 -f docker/docker-compose."$additionalDockerComposeType".yml\
 --env-file "$envFile"\
 up -d --build