#!/usr/bin/env bash
if [[ $USE_SSL = true ]]
then
    echo "With ssl"
    templateType="ssl"
else
    echo "Without ssl"
    templateType="nossl"
fi

envsubst < /etc/nginx/nginx.template."$templateType".conf > /etc/nginx/nginx.conf && nginx -g 'daemon off;'