# syntax = docker/dockerfile:latest

# build stage
FROM lts-alpine3.19 AS build-stage

# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /app

COPY --chown=node . .

RUN yarn && yarn build

# production stage
FROM nginxinc/nginx-unprivileged:1.25.2-alpine AS production-stage

USER root

ARG UID=101
ARG GID=101

COPY --from=build-stage /app/out /usr/share/nginx/html/
COPY --link --chmod=755 scripts/nginx/*.sh /docker-entrypoint.d/

RUN chown $UID:0 /usr/share/nginx/html/index.html

# COPY nginx.conf /etc/nginx/conf.d/default.conf
USER $UID

# Document what port is required
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
