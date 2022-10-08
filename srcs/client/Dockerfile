# syntax=docker/dockerfile:1

# stage 1. build the react application for production
FROM    node:alpine as build

# environment variables for build
ARG     REACT_APP_API_URL=${REACT_APP_API_URL}
ARG     REACT_APP_GAME_SOCKET_URL=${REACT_APP_GAME_SOCKET_URL}
ARG     REACT_APP_CHAT_SOCKET_URL=${REACT_APP_CHAT_SOCKET_URL}

# copy files into /app
WORKDIR /app
COPY    .   /app/

# get packages and build
RUN     npm i -g npm@8.19.2 \
 &&     npm i --silent \
 &&     npm run build

# stage 2. serve files with nginx, node is not needed anymore
FROM    nginx:alpine

# create a certificate for https
RUN     apk update && apk upgrade && apk add --update --no-cache \
            openssl \
 &&     rm -f /var/cache/apk/* \
\
# generate self signed certificate
 &&     mkdir /etc/nginx/certificates && \
	    openssl req \
		    -x509 \
		    -newkey rsa:2048 \
		    -keyout /etc/nginx/certificates/transcendence.key \
		    -days 365 \
		    -out /etc/nginx/certificates/transcendence.cert \
		    -nodes \
		    -subj /CN=transcendence.42.fr

# copy conf files to the container 
RUN     rm -f /etc/nginx/conf.d/default.conf
COPY    conf/nginx.conf /etc/nginx/conf.d/
COPY    --from=build app/build /usr/share/nginx/html

# run nginx on port http 80
EXPOSE  80
CMD     ["nginx", "-g", "daemon off;"]
