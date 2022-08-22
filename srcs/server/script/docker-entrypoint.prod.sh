#!/bin/ash

# install dependencies if overwritten by bind volume
npm i -g npm@8.18.0
npm i

# update the database with the model
npx prisma migrate dev
npx prisma migrate deploy

# build
npm run build

# start node server
node dist/main.js
