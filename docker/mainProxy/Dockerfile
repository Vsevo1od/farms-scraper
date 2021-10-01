FROM nginx
COPY nginx.template.ssl.conf /etc/nginx/nginx.template.ssl.conf
COPY nginx.template.nossl.conf /etc/nginx/nginx.template.nossl.conf
COPY buildConfig.sh /buildConfig.sh
RUN chmod +x /buildConfig.sh