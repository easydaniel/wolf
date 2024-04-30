#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 -h localhost --username "postgres" --dbname "postgres" <<-EOSQL

UPDATE player SET pass='$1' WHERE id=0;
    
EOSQL
