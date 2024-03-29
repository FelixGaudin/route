# Étape 1 : Créer l'image de construction
FROM node:14 AS build

WORKDIR /app

# Copier les fichiers nécessaires pour installer les dépendances
COPY package.json .
COPY package-lock.json .

# Installer les dépendances
RUN npm install

# Copier le code source de l'application
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : Créer l'image finale à partir de l'étape de construction
FROM nginx:alpine

# Copier les fichiers de construction dans le répertoire nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80 pour que le serveur web Nginx puisse écouter
EXPOSE 80

# Commande pour démarrer le serveur Nginx
CMD ["nginx", "-g", "daemon off;"]
