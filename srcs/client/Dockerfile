# syntax=docker/dockerfile:1

# stage 1. build the react application for production
FROM    node:alpine as build

# copy files into /app
WORKDIR /app
COPY    .   /app/

# get packages and build
RUN     npm install --silent \
 &&     npm run build

# stage 2. serve files with nginx, node is not needed anymore
FROM    nginx

# copy conf files to the container 
RUN     rm -f /etc/nginx/conf.d/default.conf
COPY    conf/nginx.conf /etc/nginx/conf.d/
COPY    --from=build app/build /usr/share/nginx/html

# run nginx on port http 80
EXPOSE  80
CMD     ["nginx", "-g", "daemon off;"]
