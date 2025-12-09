FROM php:8.3-apache

# Installer librairies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev libonig-dev libxml2-dev zip unzip git

# Installer les extensions PHP AVANT composer install
RUN docker-php-ext-install pdo pdo_pgsql pgsql \
    && docker-php-ext-install mbstring exif pcntl bcmath gd

# Activer mod_rewrite
RUN a2enmod rewrite

# Installer Composer avant composer install
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copier composer.json + lock uniquement
COPY composer.json composer.lock ./

# Installer dépendances Laravel
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copier le reste de l'application
COPY . .

# Permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

RUN php artisan storage:link || true

EXPOSE 80
