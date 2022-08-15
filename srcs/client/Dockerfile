# syntax=docker/dockerfile:1

# 1. build the react application for production
FROM    node:alpine as buildapp

# copy files into /app
WORKDIR /app
COPY 	.   /app/

# get packages and build
RUN     npm install --legacy--peer-deps
RUN     npm run build

# 2. serve files with nginx
FROM    nginx:alpine

# copy conf files to the container 

EXPOSE  80
CMD     ["nginx", "-g", "daemon off"]
