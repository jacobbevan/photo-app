FROM nginx
COPY server/nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html
