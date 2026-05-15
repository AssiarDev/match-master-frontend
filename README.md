# Match Master ⚽

Match Master est une application web permettant de suivre l'actualité du football : scores, matchs, classements !

# 📌 Fonctionnalités
- 🔥 Suivre les matchs du jour en fonction de la date sélectionnée
- 🏆 Suivre l'actualité d'une compétition pour rester informé des derniers résultats et événements
- ⭐ Sélectionner son équipe favorite et suivre son classement ainsi que ses matchs
- 🔑 Authentification pour une expérience personnalisée et la gestion des préférences utilisateur

## 🔮 Fonctionnalités à venir

- 📡 **Suivre les matchs en live** avec mises à jour en temps réel
- 📊 **Détails des statistiques des matchs** pour une analyse approfondie
- 📰 **Articles sur les équipes ou compétitions** pour en apprendre davantage sur le football

### 🌍 Objectif à long terme

L'objectif futur de Match Master est d'élargir ces fonctionnalités à **tous les sports**, offrant une plateforme complète pour suivre l'actualité sportive en un seul endroit.

## 🚀 Stack technique

- **Frontend :** React, Tailwind CSS
- **Backend :** Node.js, Express
- **Base de données :** PostgreSQL (locale), Prisma et Neon (prod)

## 🔧 Installation et lancement

### Prérequis
- [Docker](https://www.docker.com/) et Docker Compose
- Le backend [match-master-backend](https://github.com/AssiarDev/match-master) lancé localement
- [Cocogitto](https://docs.cocogitto.io/) pour les commits conventionnels

#### Installer cocogitto

**macOS**
```sh
brew install cocogitto
```

**Windows**
```sh
winget install cocogitto
```

Puis activer le hook git dans le repo :
```sh
cog install-hook commit-msg
```

### Variables d'environnement
Copier le fichier d'exemple et renseigner les valeurs :
```sh
cp .env.example .env
```

### Lancement avec Docker

```sh
docker compose up --build
```

Le frontend est accessible sur **http://localhost**.

> `--build` est nécessaire uniquement lors du premier lancement ou après modification du code / des variables d'environnement.

### Commandes de développement (sans Docker)
```sh
npm install       # Installer les dépendances
npm run dev       # Lancer le serveur de développement
npm run build     # Build de production
npm run preview   # Prévisualiser le build
npm run lint      # Vérifier le code
```

## 📁 Structure du projet

```
src/
├── components/     # Composants React organisés par domaine
│   ├── Competitions/
│   ├── Favorite/
│   ├── FavoriteModal/
│   ├── Matchs/
│   ├── Teams/
│   └── ...
├── context/        # Contextes React (Auth)
├── hooks/          # Hooks personnalisés (fetch, favoris, matchs...)
├── types/          # Interfaces et types TypeScript
└── utils/          # Fonctions utilitaires
```
