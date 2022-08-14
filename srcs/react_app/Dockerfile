# syntax=docker/dockerfile:1
FROM    node:alpine

# workdir
WORKDIR /app

# copy package.json from the react app
COPY 	app/package.json	.

# npm install packages 
RUN     npm install --legacy--peer-deps

# copy the source files of the app
COPY 	./app/. 			.

CMD     ["npm", "run", "start"]
