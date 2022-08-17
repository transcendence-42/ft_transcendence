# syntax=docker/dockerfile:1

# stage 1. build the nest application for production
FROM    node:alpine as build

# copy files into /app
WORKDIR /app
COPY    .   /app/

# get packages and build
RUN     npm ci \
 &&     npm run build

ENV     NODE_ENV production

RUN     npm ci --only=production \
 &&     npm cache clean --force

# stage 2. serve production build with a clean node server
FROM    node:alpine

COPY    --from=build /app/node_modules  ./node_modules
COPY    --from=build /app/dist          ./dist

CMD     [ "node", "dist/main.js" ]
