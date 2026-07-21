# syntax = docker/dockerfile:latest@sha256:87999aa3d42bdc6bea60565083ee17e86d1f3339802f543c0d03998580f9cb89

# build stage
FROM node:22.12-alpine3.19@sha256:40dc4b415c17b85bea9be05314b4a753f45a4e1716bb31c01182e6c53d51a654 AS build-stage

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
FROM nginxinc/nginx-unprivileged:1.31.3-alpine@sha256:18d67281256ded39ff65e010ae4f831be18f19356f83c60bc546492c7eb6dd23 AS production-stage

USER root

ARG UID=101
ARG GID=101

COPY --from=build-stage /app/out /usr/share/nginx/html/
COPY --link --chmod=755 scripts/nginx/*.sh /docker-entrypoint.d/

RUN chown $UID:0 /usr/share/nginx/html/index.html

USER $UID

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
