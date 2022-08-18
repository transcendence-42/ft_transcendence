#!/bin/ash

# push prisma schema into database
npx prisma migrate dev

# start tests
npm run test:int
