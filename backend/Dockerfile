FROM node:20.5.0-alpine3.17

RUN apk --no-cache add curl
RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 

EXPOSE 8001
EXPOSE 9001

CMD ["npm", "start"]