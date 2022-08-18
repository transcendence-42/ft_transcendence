# syntax=docker/dockerfile:1

# stage 1. build the nest application for production
FROM    node:alpine as build

# copy files into /app
WORKDIR /app
COPY    .                               /app/
COPY    ./conf/schema.prisma            /app/model.to.use
COPY	  ./script/docker-entrypoint.sh 	/usr/local/bin/ 

# make sure entrypoint can be executed
RUN     chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
