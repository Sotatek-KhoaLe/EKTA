FROM node:12-slim

WORKDIR /usr/src/app

COPY package.json .

RUN npm install
RUN npm install -g pm2
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:TZ GTM+7
RUN pm2 set pm2-logrotate:rotateInterval '0 0 * * *'