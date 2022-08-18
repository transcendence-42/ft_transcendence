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

rm -f ./prisma/schema.prisma
mv ./model.to.use ./prisma/schema.prisma

# update the database with the model
npx prisma db push
#npx prisma migrate dev --preview-feature

# start node server
npm run start:dev
