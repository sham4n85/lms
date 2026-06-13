#!/bin/sh
set -e

echo "Waiting for database..."
for i in $(seq 1 30); do
  npx prisma db push --accept-data-loss --skip-generate 2>/dev/null && break
  echo "Retry $i/30..."
  sleep 2
done

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting API server..."
exec node dist/main
