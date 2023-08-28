FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm install

FROM base AS dev
CMD npm run dev

FROM base AS prod
COPY . .
CMD npm run prod