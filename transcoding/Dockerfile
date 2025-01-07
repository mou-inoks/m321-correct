FROM node:18-alpine

RUN apk add --no-cache openssl
RUN apk add ffmpeg

WORKDIR /app

COPY package.json /app
COPY . /app
RUN npm install --force --loglevel verbose

CMD ["node", "server.js"]
