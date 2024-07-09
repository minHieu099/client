FROM node:lts-alpine

WORKDIR /code

COPY . .

RUN npm install
# RUN npm run build