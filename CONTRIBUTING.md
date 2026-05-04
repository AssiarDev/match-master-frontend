# Guide de contribution — Match Master Frontend

## Workflow Git

- Créer une branche depuis `develop` : `feat/nom-feature`, `fix/nom-bug`, `chore/nom-tâche`
- Un commit par changement logique
- Ouvrir une Pull Request vers `develop`
- Après validation, `develop` est mergée sur `main`

## Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Composants | PascalCase | `FavoriteButton.tsx` |
| Hooks | camelCase préfixé `use` | `useLeagueFavorite.ts` |
| Types/Interfaces | PascalCase | `interface Competition` |
| Variables/Fonctions | camelCase | `handleClick`, `isFavorite` |
| Fichiers non-composants | camelCase | `authContext.ts` |

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
