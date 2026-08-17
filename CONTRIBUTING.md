# Guide de contribution — Match Master Frontend

## Installation

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

| Variable       | Description                   | Exemple                 |
| -------------- | ----------------------------- | ----------------------- |
| `VITE_API_URL` | URL de l'API backend          | `http://localhost:3000` |
| `VITE_SSE_URL` | URL du flux SSE (scores live) | `http://localhost:3000` |

En local, les deux variables pointent sur la même URL. En production elles
diffèrent : `VITE_API_URL` passe par le proxy Netlify (nécessaire pour conserver
le cookie d'auth en `SameSite=Strict`), tandis que `VITE_SSE_URL` pointe
directement sur le backend Render. Le proxy Netlify ne relaie pas les flux SSE —
il transmet le premier bloc puis referme la connexion. La route
`/matches/live/stream` étant publique, elle n'a pas besoin du cookie et peut donc
contourner le proxy.

## Workflow Git

Ce projet utilise le **trunk-based development** : on crée une branche courte (< 2 jours) depuis `main`, puis on ouvre une Pull Request.

- Créer une branche depuis `main` : `feat/nom-feature`, `fix/nom-bug`, `chore/nom-tâche`
- Un commit par changement logique
- Ouvrir une Pull Request vers `main`
- Pas de branche `develop`

## Conventional Commits

Tous les commits doivent respecter le format [Conventional Commits](https://www.conventionalcommits.org/) — enforced par un hook git via [cocogitto](https://docs.cocogitto.io/).

```
type(scope): description
```

| Type       | Usage                                       |
| ---------- | ------------------------------------------- |
| `feat`     | Nouvelle fonctionnalité                     |
| `fix`      | Correction de bug                           |
| `chore`    | Tâche de maintenance                        |
| `refactor` | Refactoring sans changement de comportement |
| `docs`     | Documentation                               |
| `style`    | Formatage, style                            |
| `test`     | Tests                                       |
| `build`    | Build system                                |
| `ci`       | CI/CD                                       |
| `perf`     | Performance                                 |

## Releases

Les releases sont gérées automatiquement par le job CI au merge sur `main`, via cocogitto. La version est déterminée à partir des commits conventionnels.

## Conventions de nommage

| Élément                 | Convention              | Exemple                     |
| ----------------------- | ----------------------- | --------------------------- |
| Composants              | PascalCase              | `FavoriteButton.tsx`        |
| Hooks                   | camelCase préfixé `use` | `useLeagueFavorite.ts`      |
| Types/Interfaces        | PascalCase              | `interface Competition`     |
| Variables/Fonctions     | camelCase               | `handleClick`, `isFavorite` |
| Fichiers non-composants | camelCase               | `authContext.ts`            |

## Ajouter un hook

1. Créer le fichier dans `src/hooks/`
2. Nommer l'export en cohérence avec le fichier (`useXxx`)
3. Retourner un objet nommé (pas de tableau)
4. Ajouter un commentaire JSDoc décrivant le rôle, les paramètres et le retour

## Ajouter un composant

1. Créer le fichier dans le sous-dossier correspondant de `src/components/`
2. Nommer l'export en PascalCase
3. Définir une interface `XxxProps` pour les props
4. Ne pas dupliquer la logique — utiliser ou créer un hook dédié

## Standards de code

- TypeScript strict — pas de `any`
- Pas de logique métier dans les composants — déplacer dans un hook
- Utiliser `useFetch` comme base pour tous les appels GET
- Les appels POST/DELETE ont leur propre hook dédié
- Tailwind CSS uniquement pour le style — pas de CSS inline
