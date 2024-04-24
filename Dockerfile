# syntax = docker/dockerfile:latest

# build stage
FROM node:20.11-alpine3.19 AS build-stage

# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /app

COPY --chown=node . .

RUN <<EOF
    set -xe
    corepack enable
    yarn set version stable
EOF

# RUN yarn config set cache-folder /root/.yarn # just to be explicit
# RUN --mount=type=cache,mode=0777,target=/root/.yarn yarn cache list
RUN --mount=type=cache,mode=0777,target=/root/.yarn/berry/cache YARN_CACHE_FOLDER=/root/.yarn/berry/cache yarn && yarn build

# production stage
FROM nginxinc/nginx-unprivileged:1.26.0-alpine AS production-stage

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
