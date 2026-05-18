FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git curl zip unzip libsqlite3-dev libzip-dev \
    && docker-php-ext-install pdo pdo_sqlite zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN a2enmod rewrite
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf
RUN echo '<Directory /var/www/html/public>\n    AllowOverride All\n    Require all granted\n</Directory>' \
    >> /etc/apache2/apache2.conf

WORKDIR /var/www/html

RUN composer create-project laravel/laravel . "^11.0" --prefer-dist --no-interaction
RUN composer require spatie/laravel-permission

COPY app/ app/
COPY database/ database/
COPY resources/ resources/
COPY routes/web.php routes/web.php
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN touch storage/database.sqlite \
    && cp .env.example .env \
    && sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=sqlite/' .env \
    && sed -i 's|# DB_DATABASE=.*|DB_DATABASE=/var/www/html/storage/database.sqlite|' .env \
    && php artisan key:generate \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80
CMD ["docker-entrypoint.sh"]
