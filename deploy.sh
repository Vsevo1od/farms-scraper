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
    echo "Adding same port config"
    additionalDockerComposeType="same-port"
else
    echo "Adding several ports config"
    additionalDockerComposeType="several-ports"
fi
additionalFiles="-f docker/docker-compose.$additionalDockerComposeType.yml"

if [[ $USE_SSL = true ]]
then
    echo "Adding ssl config"
    additionalFiles="${additionalFiles} -f docker/docker-compose.ssl.yml"
fi

docker-compose -f docker/docker-compose.yml\
 $additionalFiles\
 --env-file "$envFile"\
 up -d --build