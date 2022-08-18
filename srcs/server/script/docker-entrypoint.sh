#!/bin/ash

cd /app

# install packages
npm i -g npm@8.18.0
npm i
# npm i -g @nestjs/cli
# npm i -g @prisma/client

# # init prisma
# rm -rf ./prisma
# npx prisma init --url ${DATABASE_URL}

# # clean std install
# rm -f .env
# rm -f ./prisma/schema.prisma
# cp ./conf/schema.prisma ./prisma/schema.prisma

# npx prisma generate

# # update the database with the model
npx prisma migrate dev
npx prisma migrate deploy
#npx prisma db push

# build
npm run build

# start node server
node dist/main.js
