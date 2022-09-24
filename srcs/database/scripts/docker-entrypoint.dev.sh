#! /bin/ash

### Create the data directory, and make it less permissive 
mkdir /var/lib/postgresql/data
chmod 2700 /var/lib/postgresql/data

### Run all commands as postgres user

echo "Initializing database cluster "
initdb -D /var/lib/postgresql/data

echo "configuration  ..."
echo host all ${POSTGRES_USER} server scram-sha-256 >> /var/lib/postgresql/data/pg_hba.conf
echo host all ${POSTGRES_USER} adminer scram-sha-256 >> /var/lib/postgresql/data/pg_hba.conf
echo host all ${POSTGRES_USER} all scram-sha-256 >> /var/lib/postgresql/data/pg_hba.conf
echo 'port = 5432' >> /var/lib/postgresql/data/postgresql.conf
echo "listen_addresses = '*'" >> /var/lib/postgresql/data/postgresql.conf
echo 'password_encryption = scram-sha-256' >> /var/lib/postgresql/data/postgresql.conf

echo "reloading database"
pg_ctl start -D /var/lib/postgresql/data

# echo "creating user ${POSTGRES_USER}"
# adduser ${POSTGRES_USER}

psql -c 'CREATE DATABASE '${POSTGRES_DB}';'
psql -c 'CREATE USER '${POSTGRES_USER}' WITH ENCRYPTED PASSWORD '"'${POSTGRES_PASSWORD}';"
psql -c 'GRANT ALL PRIVILEGES ON DATABASE '${POSTGRES_DB}' TO '${POSTGRES_USER}';'

### Importing mock database
echo "Importing mock database"
psql -U ${POSTGRES_USER} ${POSTGRES_DB} < /dev-mock-data.sql

echo "data import done..."
touch /tmp/.ready

tail -f