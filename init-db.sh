#!/bin/sh
# Refer to `docker-compose-db.yaml` for an explanation of this script

# Absolute path is given since the script is executed in root dir
mysql -D${MYSQL_DATABASE} -p${MYSQL_ROOT_PASSWORD} < /docker-entrypoint-initdb.d/init.sql.noautoexecute
