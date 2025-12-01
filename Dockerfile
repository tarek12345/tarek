# Utiliser PHP 8.3 avec Apache
FROM php:8.3-apache

# Installer les librairies nécessaires
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev libonig-dev libxml2-dev zip unzip git

# Installer les extensions PHP
RUN docker-php-ext-install pdo pdo_pgsql pgsql
RUN docker-php-ext-install mbstring exif pcntl bcmath gd

# Activer mod_rewrite
RUN a2enmod rewrite

# Copier le code dans /var/www/html
COPY . /var/www/html

# Copier le Virtual Host
COPY ./vhost.conf /etc/apache2/sites-available/000-default.conf

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installer les dépendances Laravel
RUN composer install --no-dev --optimize-autoloader

# Fix des permissions Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
