#!/bin/bash
set -e
cd /var/www/html

php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --force 2>/dev/null || true
php artisan migrate --force --seed 2>/dev/null || true

exec apache2-foreground
