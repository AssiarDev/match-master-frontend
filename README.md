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
- Node.js >= 18
- Le backend [match-master-backend](https://github.com/AssiarDev/match-master-backend) lancé localement

### Variables d'environnement
Créer un fichier `.env` à la racine :
```env
VITE_API_URL=http://localhost:3000
```

### Commandes
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
