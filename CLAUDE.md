@AGENTS.md

# CLAUDE.md — Resto

Application de livraison de repas conçue pour rivaliser avec Gozem Food en Afrique de l'Ouest et Centrale.

## Stack Technique

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styles**: Tailwind CSS v4
- **Base de données**: SQLite (dev) via Prisma 7 + @prisma/adapter-libsql
- **Auth**: JWT custom avec jose (cookies httpOnly)
- **État client**: Zustand (panier)
- **Validation**: Zod v4

## Architecture

```
src/
├── app/
│   ├── (auth)/          # Connexion, inscription
│   ├── (client)/        # App client: restaurants, panier, commandes, profil
│   ├── (restaurant)/    # Dashboard restaurateur
│   ├── api/             # Route handlers REST
│   └── actions/         # Server Actions
├── components/
│   ├── ui/              # Composants de base (bouton, input, card...)
│   ├── layout/          # Header, BottomNav, Providers
│   ├── restaurant/      # CarteRestaurant, FiltreCuisine, CarteArticleMenu
│   ├── cart/            # BoutonPanier, ArticlePanierItem
│   └── order/           # SuiviCommande (SSE temps réel)
└── lib/
    ├── prisma.ts         # Client Prisma (singleton)
    ├── auth.ts           # Sessions JWT
    ├── cart-store.ts     # Zustand panier (localStorage)
    ├── constants.ts      # Cuisines, statuts, villes
    └── utils.ts          # formatPrix (FCFA), slugifier, etc.
```

## Setup

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer .env avec le bon DATABASE_URL (chemin absolu)

# 3. Créer la base de données
npx prisma migrate dev --name init

# 4. Insérer les données de test
npx tsx prisma/seed.ts

# 5. Lancer le serveur
npm run dev
```

## Comptes de Test (après seed)

| Rôle         | Téléphone       | Mot de passe |
|-------------|-----------------|--------------|
| Client      | +237677000001   | password123  |
| Restaurateur | +237699000002  | password123  |
| Restaurateur | +237699000001  | password123  |

## Variables d'Environnement

```env
DATABASE_URL=file:///chemin/absolu/vers/dev.db
JWT_SECRET=votre-cle-secrete
```

## API Routes

- `POST /api/commandes` — Passer une commande
- `GET /api/commandes` — Historique commandes
- `GET /api/commandes/[id]` — Détail commande
- `PUT /api/commandes/[id]` — Mettre à jour le statut
- `GET /api/commandes/[id]/stream` — SSE suivi temps réel
- `POST /api/menu` — Créer un article menu
- `PUT /api/menu/[id]` — Modifier un article
- `DELETE /api/menu/[id]` — Supprimer un article
- `PUT /api/restaurants/[id]` — Modifier les infos restaurant
- `POST /api/categories` — Créer une catégorie menu

## GitHub

- Repo: `kanis1245/resto`
- Branche de développement: `claude/build-intuitive-app-rFKRk`
