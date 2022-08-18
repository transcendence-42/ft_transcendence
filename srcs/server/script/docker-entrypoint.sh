#!/bin/sh

cd /app

# install packages
npm i -g npm@8.18.0
npm i
npm i -g @nestjs/cli
npm i -g @prisma/client

# init prisma
npx prisma init
npx prisma generate

# replace default file with proper model
rm -f ./prisma/schema.prisma
mv ./model.to.use ./prisma/schema.prisma

# update the database with the model
# npx prisma migrate dev
# npx prisma migrate deploy
npx prisma db push

# build
npm run build

# start node server
node dist/main.js
