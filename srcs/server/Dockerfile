# syntax=docker/dockerfile:1

# stage 1. build the nest application for production
FROM    node:alpine as build

# copy files into /app
WORKDIR /app
COPY    .   /app/

# get packages and build
RUN     npm install --silent \
 &&     npm run build

# stage 2. serve production build with a clean node server
FROM    node:alpine

WORKDIR /app

# copy build and conf file 
COPY    --from=build app/build /app
COPY    package.json  /app/package.json

# install packages
RUN     npm install --silent

# run server on port http 4200
EXPOSE  4200
CMD     ["npm", "run", "start"]
