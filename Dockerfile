# syntax = docker/dockerfile:latest

# build stage
FROM node:22.12-alpine3.19 AS build-stage

# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --link --chown=node package.json yarn.lock .yarnrc.yml .yarn ./

RUN corepack enable

RUN --mount=type=cache,mode=0777,target=/root/.yarn/berry/cache \
    YARN_CACHE_FOLDER=/root/.yarn/berry/cache yarn install --immutable

COPY --link --chown=node pages/ pages/
COPY --link --chown=node public/ public/
COPY --link --chown=node src/ src/
COPY --link --chown=node css/ css/
COPY --link --chown=node scripts/ scripts/
COPY --link --chown=node next.config.js ./

# production stage
FROM nginxinc/nginx-unprivileged:1.31.2-alpine AS production-stage

USER root

ARG UID=101
ARG GID=101

COPY --from=build-stage /app/out /usr/share/nginx/html/
COPY --link --chmod=755 scripts/nginx/*.sh /docker-entrypoint.d/

RUN chown $UID:0 /usr/share/nginx/html/index.html

USER $UID

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
