FROM node:current-alpine

ENV NODE_ENV=production
ENV REDISHOST=redis
ENV REDISPORT=6379

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

CMD ["node", "start"]
