# Utiliser PHP 8.3 avec Apache
FROM php:8.3-apache

# Installer les librairies nécessaires
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev libonig-dev libxml2-dev zip unzip git

# Installer les extensions PHP
RUN docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Activer mod_rewrite
RUN a2enmod rewrite

# Installer Composer (copie depuis l'image officielle)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définir WORKDIR
WORKDIR /var/www/html

# Copier uniquement composer.json et composer.lock d'abord (meilleure cache)
COPY composer.json composer.lock ./

# Installation des dépendances Laravel
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copier tout le projet ensuite
COPY . .

# Fix des permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Exécuter storage:link
RUN php artisan storage:link || true

EXPOSE 80
