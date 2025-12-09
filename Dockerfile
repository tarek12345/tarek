FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev libonig-dev libxml2-dev zip unzip git

RUN docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd

RUN a2enmod rewrite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copier uniquement le composer
COPY backend/composer.json backend/composer.lock ./

RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copier tout le projet laravel
COPY backend/. .

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

RUN php artisan storage:link || true

EXPOSE 80
