FROM node:18-alpine AS build
WORKDIR /app

COPY package.json .
RUN npm install

# Copy the rest of the application in and build it.
COPY . .

RUN npm run build

FROM bitnami/nginx:latest

LABEL org.opencontainers.image.source https://github.com/EHMRS/ModernMimic

WORKDIR /app

COPY --from=build /app/dist /app
COPY entrypoint.sh /entrypoint.sh

USER root
RUN chmod +x /entrypoint.sh
RUN chown -R 1001 /app
RUN rm /app/signalling.yml
USER 1001

CMD ["/entrypoint.sh"]
