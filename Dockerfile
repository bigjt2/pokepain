FROM node:20.5.0-alpine3.17

RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app