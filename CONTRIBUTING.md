# Guide de contribution — Match Master Frontend

## Installation

### Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- Le backend [match-master-backend](https://github.com/AssiarDev/match-master) lancé localement
- [mise](https://mise.jdx.dev/) pour installer les outils de développement (voir ci-dessous)

### Outils de développement

Les outils de développement sont déclarés dans [`mise.toml`](mise.toml) et installés avec [mise](https://mise.jdx.dev/), aux mêmes versions en local et en CI :

- **Node**, pour les scripts npm et les hooks de commit ;
- **[Cocogitto](https://docs.cocogitto.io/)** (`cog`), qui fait respecter les [Conventional Commits](https://www.conventionalcommits.org/) ;
- **[typos](https://github.com/crate-ci/typos)**, qui détecte les fautes de frappe avant chaque commit.

**Installer mise**

```sh
# macOS
brew install mise

# Linux
curl -fsSL https://mise.run | sh

# Windows
winget install jdx.mise
```

Rendre ensuite les outils accessibles au terminal et aux hooks git :

- **bash / zsh** : ajouter `eval "$(mise activate bash)"` (ou `zsh`) à la fin de `~/.bashrc` (ou `~/.zshrc`) ;
- **Windows** : ajouter `C:\Users\<ton-nom>\AppData\Local\mise\shims` au `PATH` de l'utilisateur, au-dessus de `.cargo\bin` s'il y figure. Le nouveau `PATH` ne s'applique qu'aux programmes lancés ensuite : redémarrer Windows (pas une simple mise en veille), ou au moins l'Explorateur Windows depuis le Gestionnaire des tâches.
- **Windows, si Node.js est déjà installé** (dans `C:\Program Files\nodejs`) : le désinstaller, puis lancer `mise use -g node@24`. Le `PATH` système passe avant le `PATH` utilisateur : sans cela, `node` et `npm` restent ceux de l'ancienne installation, même dans le projet.

Pour les autres shells, voir la [documentation de mise](https://mise.jdx.dev/installing-mise.html).

**Installer les outils et les hooks**

À la racine du projet :

```sh
mise install
mise run hooks:install
```

- `mise install` installe Node, `cog` et `typos`. Si mise indique que le fichier `mise.toml` n'est pas approuvé, lancer `mise trust` puis relancer `mise install`.
- `mise run hooks:install` installe les dépendances npm, utilisées par le hook pre-commit (vérification des types, ESLint et Prettier), puis les hooks git `pre-commit` et `commit-msg` définis dans `cog.toml`. Sans mise, l'équivalent est `npm install`, puis `cog install-hook --all --overwrite`.

> Cette étape est à refaire sur chaque nouvelle machine après un clone.

**Tâches mise**

`mise.toml` définit des raccourcis pour les opérations courantes. `mise tasks` les liste :

| Tâche                    | Rôle                                                                       |
| ------------------------ | -------------------------------------------------------------------------- |
| `mise run check`         | Lance les mêmes vérifications que le hook pre-commit, sans créer de commit |
| `mise run hooks:install` | Installe les dépendances npm et les hooks git                              |

> La version de Node (Node 24) est déclarée à trois endroits : dans `mise.toml` (local et CI), dans le `FROM` du `Dockerfile` et dans l'image du service `frontend-dev` de `docker-compose.yml`. Si tu changes l'une, change aussi les autres.

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
