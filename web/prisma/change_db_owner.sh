#!/bin/bash
# Script to change the owner of the ecommerce_dev database to mohamedelnaggar
# Usage: ./change_db_owner.sh

# Set default values or use environment variables
PGUSER=${PGUSER:-postgres}
PGDATABASE=${PGDATABASE:-postgres}
PGHOST=${PGHOST:-localhost}
PGPORT=${PGPORT:-5432}
PGPASSWORD=${PGPASSWORD:-}
NEW_OWNER=${1:-mohamedelnaggar}
TARGET_DB=${2:-ecommerce_dev}

# Export password if provided
if [ -n "$PGPASSWORD" ]; then
  export PGPASSWORD
fi

# Run the ALTER DATABASE command
psql -U "$PGUSER" -h "$PGHOST" -p "$PGPORT" -d "$PGDATABASE" -c "ALTER DATABASE $TARGET_DB OWNER TO $NEW_OWNER;"

# Unset password for security
unset PGPASSWORD 