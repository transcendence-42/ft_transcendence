FROM  alpine:3.16

# get postgres user
ARG   POSTGRES_USER=${POSTGRES_USER}

# install PostgreSQL from package manager
RUN   apk update && apk upgrade && apk add --update --no-cache \
        postgresql \
 &&   rm -f /var/cache/apk/*

# copy entrypoint and mock data
COPY  /scripts/docker-entrypoint.prod.sh /usr/local/bin/docker-entrypoint.sh
COPY  /conf/mock-data.sql /tmp/

# create a user on the container
RUN   adduser -D ${POSTGRES_USER}

# socket folder and rights
RUN   mkdir /run/postgresql \
 &&   chown -R postgres:postgres /run/postgresql /var/lib/postgresql

EXPOSE 5432

# launch as root
USER root

CMD ["docker-entrypoint.sh"]
