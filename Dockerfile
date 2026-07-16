# syntax = docker/dockerfile:latest

# build stage
FROM node:22.12-alpine3.19 AS build-stage

# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --chown=node package.json yarn.lock .yarnrc.yml ./
COPY --chown=node .yarn/releases/ .yarn/releases/

RUN corepack enable

RUN --mount=type=cache,mode=0777,target=/root/.yarn/berry/cache \
    YARN_CACHE_FOLDER=/root/.yarn/berry/cache yarn install --immutable

COPY --chown=node pages/ pages/
COPY --chown=node public/ public/
COPY --chown=node src/ src/
COPY --chown=node css/ css/
COPY --chown=node scripts/ scripts/
COPY --chown=node next.config.js ./

RUN --mount=type=cache,mode=0777,target=/root/.yarn/berry/cache \
    YARN_CACHE_FOLDER=/root/.yarn/berry/cache yarn build

# production stage
FROM nginxinc/nginx-unprivileged:1.31.3-alpine AS production-stage

USER root

ARG UID=101
ARG GID=101

COPY --from=build-stage /app/out /usr/share/nginx/html/
COPY --link --chmod=755 scripts/nginx/*.sh /docker-entrypoint.d/

RUN chown $UID:0 /usr/share/nginx/html/index.html

USER $UID

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
