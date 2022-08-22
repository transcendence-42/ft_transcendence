#!/bin/ash

# install dependencies if overwritten by bind volume
npm i -g npm@8.18.0
npm i

# push prisma schema into database
npx prisma migrate dev

# start server
exec npm run start:dev
