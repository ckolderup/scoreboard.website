FROM node:14-alpine

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm ci

COPY . /app

RUN npm install

CMD ["npm", "start"]
