# syntax=docker/dockerfile:1

# stage 1. build the nest application for production
FROM    node:alpine

WORKDIR /app

COPY    .                               /app/
COPY	./script/docker-entrypoint.sh   /usr/local/bin/ 

# install dependencies
RUN     npm i -g npm@8.18.0 \
 &&     npm i

# make sure entrypoint can be executed
RUN     chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
