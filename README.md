# LMTBot

# Le bot est en cours de refonte totale, changement de JS en TS.
# Ce repertoire n'est donc plus à jour.

## Projet 

LMTBot est un bot discord multifonctions qui permet de gérer des serveurs discord de manière simple et efficace.
Il est développé en NodeJS et utilise une base de donnée MySQL.
Il est actuellement en développement et utilise discord.js v14.

## Installation

### Prérequis

* ☀️ NodeJS >=v16 `https://nodejs.org/en`
* ☀️ npm >=v9
* ☀️ Docker `https://www.docker.com/`

### Installation

1. Cloner le projet `git clone https://github.com/Mattox0/LMTBot.git`

2. Installer les dépendances dans le dossier 
```bash
/> cd LMTBot

/LMTBot/> npm install
```

3. Lancer la base de donnée avec docker
```bash
/LMTBot/> docker-compose up
```

4. Aller sur l'adresse `http://localhost:8080` (PhpMyAdmin) et créer une base de donnée nommée `lmtbot` et importer le script SQL `lmtbot.sql`

5. Modifier le fichier `.env` avec le token, le clientId, et le clientSecret de votre bot discord
```
token= "INSERT TOKEN HERE"
clientId="INSERT CLIENT ID HERE"
clientSecret="INSERT CLIENT SECRET HERE"
```

Vous pouvez maintenant lancer le bot !

## Lancement

Pour lancer le bot, il suffit de lancer la commande suivante dans le dossier du projet
```bash
/LMTBot/> npm start
```

## Commandes

☀️ **Pour plus d'informations sur les commandes, faites la commande `help` du bot**

