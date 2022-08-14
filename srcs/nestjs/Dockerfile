# syntax=docker/dockerfile:1
FROM    node:alpine

# workdir
WORKDIR /app

# npm install nestJS 
RUN     npm install -g @nestjs/cli

# copy package.json from the react app
COPY 	src/package.json	.

# npm install packages 
RUN     npm install

# copy the source files of the app
COPY 	./src/. 			.

CMD     ["npm", "run", "start:dev"]