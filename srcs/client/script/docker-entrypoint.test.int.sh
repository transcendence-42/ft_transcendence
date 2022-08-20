#!/bin/ash

# Install dependencies if overried by bind volume
npm i -g npm@8.18.0
npm i

# create a file to tell healthcheck the container is ready
touch /tmp/.ready

# This makes sure the container doesn't exit so that we can run
# docker exec commands to test our code
tail -f /dev/null
