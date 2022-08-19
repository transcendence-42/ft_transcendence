#!/bin/ash

npm i
# push prisma schema into database
npx prisma migrate dev

# start server
exec npm run start:dev
