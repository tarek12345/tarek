# Utiliser PHP avec Apache
FROM php:8.3-apache

# Installer les extensions PHP nécessaires
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Activer mod_rewrite
RUN a2enmod rewrite

# Copier le projet Laravel dans le container
COPY . /var/www/html

# Copier le Virtual Host
COPY ./vhost.conf /etc/apache2/sites-available/000-default.conf

# Installer Composer globalement
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installer les dépendances Laravel
RUN composer install --no-dev --optimize-autoloader

# 🔥 FIX CRITIQUE : permissions Laravel (logs, cache, sessions, vues)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Exposer le port
EXPOSE 80
