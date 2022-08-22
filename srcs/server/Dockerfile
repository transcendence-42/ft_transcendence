# syntax=docker/dockerfile:1

# build the nest application for production
FROM    node:alpine

WORKDIR /app

COPY    .   /app/

# install dependencies
RUN     npm i -g npm@8.18.0 \
 &&     npm i

CMD     ["sh"]
