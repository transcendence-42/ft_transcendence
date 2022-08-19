#!/bin/ash

# push prisma schema into database
npx prisma migrate dev

# start tests
tail -f /dev/null
