#!/bin/sh

cd /app

# install packages
npm i
npm i -g @nestjs/cli

# init prisma
npx prisma init

# replace default file with proper model
rm -f ./prisma/schema.prisma
mv ./model.to.use ./prisma/schema.prisma

# update the database with the model
npx prisma migrate dev --preview-feature

# start node server
npm run start:dev
