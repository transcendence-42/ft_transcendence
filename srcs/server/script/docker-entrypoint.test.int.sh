#!/bin/ash

# Install dependencies if overried by bind volume
npm i -g npm@8.18.0
npm i

# push prisma schema into database
npx prisma migrate dev

# This makes sure the container doesn't exit so that we can run
# docker exec commands to test our code
tail -f /dev/null
