#!/bin/sh

set -eu

PORT="${PORT:-"8080"}"

# Create nginx conf with port variable
tee /etc/nginx/nginx.conf << 'EOF' >/dev/null
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /tmp/nginx.pid;

events {
    accept_mutex off;
    worker_connections  1024;
}

http {
    client_body_temp_path /tmp/client_temp;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;
    include       /etc/nginx/conf.d/*.conf;
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile_max_chunk 512k;
    sendfile        on;
    tcp_nopush     on;
    keepalive_timeout  65;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml font/woff2;

    server {
        listen       ${PORT};

        root /usr/share/nginx/html;
        index index.html;

        # Make site accessible from http://localhost/
        server_name _;

        error_page 404 /index.html;

        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "DENY" always;
        add_header Referrer-Policy "no-referrer" always;
        add_header Content-Security-Policy "default-src 'self'; img-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'" always;

        location /healthz {
            return 200;
        }

        location / {
            try_files $uri $uri/ =404;
        }

        location ~* \.(jpg|jpeg|gif|png|css|js|ico|webp|svg|woff|woff2|ttf|webmanifest)$ {
            expires 5d;
        }
    }
}
EOF

# Remove the base image's stock welcome-page config - it also listens on
# ${PORT} and, since it's included before our own server block is defined
# above, nginx would otherwise treat it as the default handler for this
# port instead of ours.
rm -f /etc/nginx/conf.d/default.conf

# Apply port variable
sed -i s/'${PORT}'/${PORT}/g /etc/nginx/nginx.conf

echo ""
echo "#####################"
echo "Nginx running on port $PORT"
echo "#####################"
echo ""

exec "$@"