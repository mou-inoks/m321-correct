FROM node

WORKDIR /app

COPY package.json /app
COPY . /app
RUN npm install --force --loglevel verbose

CMD ["node", "server.js"]
