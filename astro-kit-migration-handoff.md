# Handoff Codex — migration ASTRO-KIT de TanStack vers Astro

## 0. Mission

Codex est déjà lancé à la racine du projet dézippé et renommé `ASTRO-KIT`. Migrer ce projet vers un starter Astro orienté sites vitrines / landing pages multi-pages, tout en conservant au maximum le backend et l'architecture monorepo existants.

La migration doit être exécutée, pas seulement planifiée.

Contraintes fortes :

- le repository `ASTRO-KIT` présent dans le workspace est la source de vérité ;
- remplacer partout les références de marque `astro-kit` / `ASTRO-KIT` / `Astro Kit` par `astro-kit` / `ASTRO-KIT` / `Astro Kit` selon le contexte ;
- cela inclut le code, les noms de packages, les docs, les configs, les fichiers de skills, les noms de fichiers contenant `astro-kit`, les scripts et les chemins de projet concernés ;
- ne pas réécrire l'historique Git ni modifier les objets internes de `.git` ; le renommage concerne le working tree et les fichiers suivis ;
- le dossier racine est déjà nommé `ASTRO-KIT` ; ne pas le renommer ;
- préserver les fichiers `.env` existants byte-for-byte ; ne jamais afficher ni modifier des secrets ;
- ne pas déployer ;
- ne pas lancer de migration DB destructive ;
- ne pas profiter de cette migration pour mettre à jour massivement toutes les dépendances ;
- préserver visuellement la landing actuelle autant que possible ;
- supprimer uniquement la démo TanStack devenue sans objet et les éléments de copy/branding TanStack ;
- garder la partie app/auth/Polar fonctionnelle même si elle n'est plus le centre du starter.

## 1. Source actuelle du projet

Racine actuelle :

```text
ASTRO-KIT/
├── apps/
│   ├── website/
│   └── data-service/
├── packages/
│   └── data-ops/
├── docs/
├── scripts/
├── .agents/
├── .claude/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

Package racine actuel :

```text
jd-astro-kit
```

Application frontend actuelle :

```text
apps/website
package: jd-astro-site
worker: jd-astro-site
```

Stack frontend actuelle :

- TanStack Start `1.168.48`
- TanStack Router `1.170.31`
- TanStack Query `5.101.4`
- TanStack Router SSR Query `1.167.1`
- React / React DOM `19.2.8`
- Tailwind CSS `4.3.3`
- `@tailwindcss/vite` `4.3.3`
- shadcn-style components + Radix
- Better Auth `1.6.29`
- Polar SDK `^0.34.17`
- `@polar-sh/tanstack-start` `^0.1.12`
- PostHog Node `5.49.2`
- Cloudflare Vite plugin `1.53.1`
- Wrangler `4.125.0`
- TypeScript `5.9.3`

Backend partagé actuel :

```text
apps/data-service
├── Hono
└── Cloudflare Worker

packages/data-ops
├── Neon serverless
├── Drizzle ORM 0.45.2
├── Better Auth
├── Polar
├── Zod
├── schema/migrations
└── queries
```

Le backend doit rester.

## 2. Décision d'architecture finale

La cible est un monorepo pnpm avec trois frontières claires :

```text
astro-kit/
│
├── apps/
│   ├── website/          # Astro + React islands + Actions + endpoints
│   └── data-service/     # Hono Cloudflare Worker, inchangé dans son rôle
│
├── packages/
│   └── data-ops/         # Neon + Drizzle + Better Auth + Polar + Zod
│
├── docs/
├── scripts/
├── .agents/
├── .claude/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

Règle d'architecture :

```text
apps/     = unités déployables
packages/ = code partagé non déployable
```

Responsabilités :

```text
apps/website
= pages, SEO, UI, formulaires, Astro Actions, endpoints propres au site,
  auth-facing logic, Polar-facing UI, React islands

apps/data-service
= APIs/services indépendants, webhooks partagés, WhatsApp, agent IA,
  queues, cron, workflows, traitements asynchrones ou partagés

packages/data-ops
= DB, Drizzle, schémas, migrations, Better Auth setup,
  queries partagées, contrats Zod
```

Ne pas créer `packages/ui` pendant cette migration. Il n'y a qu'un frontend UI principal. Les composants shadcn restent dans l'app Astro.

## 3. Renommages obligatoires

### 3.1 Marque / repo

Effectuer au minimum :

```text
ASTRO-KIT        -> astro-kit au niveau du dossier racine si possible
jd-astro-kit     -> jd-astro-kit
Astro Kit        -> Astro Kit
ASTRO-KIT        -> ASTRO-KIT quand l'usage humain exige des capitales
astro-kit        -> astro-kit dans noms de fichiers et références techniques
```

Ne pas remplacer aveuglément le mot générique `SaaS` quand il décrit réellement un concept métier. La contrainte porte sur la marque et le nom du kit. Le starter et la landing doivent se présenter comme Astro Kit.

### 3.2 Frontend

Renommer :

```text
apps/website -> apps/website
jd-astro-site          -> jd-astro-site
worker jd-astro-site   -> jd-astro-site
```

Scripts racine à renommer :

```text
dev:website    -> dev:website
deploy:website -> deploy:website
```

Mettre à jour tous les filtres pnpm associés.

### 3.3 Fichiers de skills contenant `astro-kit`

Dans `.agents`, renommer :

```text
.agents/skills/create-prd/evals/fixtures/astro-kit-snapshot.json
-> .agents/skills/create-prd/evals/fixtures/astro-kit-snapshot.json

.agents/skills/cro-web-implement/references/astro-kit-integration.md
-> .agents/skills/cro-web-implement/references/astro-kit-integration.md

.agents/skills/implement-forms/references/astro-kit-integration.md
-> .agents/skills/implement-forms/references/astro-kit-integration.md
```

Mettre à jour les références dans les scripts, `SKILL.md`, evals, `openai.yaml`, docs et messages d'erreur.

`.agents/skills/` est la source canonique. `.claude/skills/` contient des symlinks vers `.agents/skills/`. Ne pas dupliquer les skills. Après les changements, exécuter :

```bash
pnpm skills:sync
```

## 4. Changement de stack

### Supprimer

Dans `apps/website` après renommage :

```text
@tanstack/react-start
@tanstack/react-router
@tanstack/react-query
@tanstack/react-query-devtools
@tanstack/react-router-devtools
@tanstack/react-router-ssr-query
@polar-sh/tanstack-start
@cloudflare/vite-plugin
@vitejs/plugin-react
vite-tsconfig-paths si devenu inutile
```

Supprimer également :

```text
src/start.tsx
src/router.tsx
src/routeTree.gen.ts
src/server.ts                  # custom TanStack server entry
src/integrations/tanstack-query/
src/core/functions/example-functions.ts
src/core/middleware/example-middleware.ts
src/components/demo/middleware-demo.tsx
src/components/demo/index.ts si vide/inutile
vite.config.ts
```

Supprimer les `dist/` générés avant rebuild. Ne jamais migrer ni éditer `dist` à la main.

### Ajouter

Ajouter les versions stables compatibles au moment de l'exécution :

```text
astro
@astrojs/react
@astrojs/cloudflare
@astrojs/check
```

Au 2026-09-14, les versions observées étaient :

```text
astro                 7.3.2
@astrojs/react         6.0.5
@astrojs/cloudflare   14.3.1
```

Ces numéros sont des repères, pas une instruction de downgrader si le registry propose une version stable compatible plus récente au moment de l'exécution. Vérifier la compatibilité avant installation.

### Garder

Ne pas retirer :

```text
React 19
React DOM
Tailwind CSS v4
@tailwindcss/vite
shadcn components
Radix
Lucide
class-variance-authority
clsx
tailwind-merge
tw-animate-css
Zod
Better Auth
Polar SDK
@polar-sh/better-auth
PostHog
Neon
Drizzle ORM
Hono
Cloudflare Workers
Wrangler
pnpm workspace
TypeScript
```

Ne pas upgrader Better Auth, Polar, Hono, Neon, PostHog, Wrangler ou TypeScript dans le même chantier sauf incompatibilité bloquante avec Astro. Si une mise à jour est strictement nécessaire, faire la plus petite montée de version possible et documenter pourquoi.

## 5. Configuration Astro cible

Créer :

```text
apps/website/astro.config.mjs
```

Configuration attendue :

- intégration React via `@astrojs/react` ;
- adapter Cloudflare via `@astrojs/cloudflare` ;
- Tailwind v4 via `@tailwindcss/vite` dans `vite.plugins` ;
- conserver le défaut Astro statique pour les pages marketing ;
- ne pas mettre tout le site en `output: 'server'` sans nécessité ;
- rendre à la demande uniquement les routes qui nécessitent session/cookies/server rendering ;
- les Actions nécessitent le runtime serveur de l'adapter, mais les pages marketing qui les déclenchent côté client peuvent rester pré-rendues ;
- conserver le port de développement `3000` pour limiter les changements Better Auth/OAuth.

Scripts recommandés dans `apps/website/package.json` :

```text
dev       -> astro dev --port 3000
build     -> astro build
serve     -> astro preview --port 3000
typecheck -> astro check && tsc --noEmit
deploy    -> pnpm run build && wrangler deploy
cf-typegen -> wrangler types --env-interface Env
```

Conserver `components.json` et les aliases `@/*`.

### Wrangler

Mettre à jour `apps/website/wrangler.jsonc` pour Astro/Cloudflare :

- `name`: `jd-astro-site` ;
- conserver la `compatibility_date` existante sauf nécessité documentée ;
- conserver `nodejs_compat` ;
- utiliser l'entrypoint attendu par la version installée de `@astrojs/cloudflare` ; avec les versions Astro récentes, l'entrypoint de référence est `@astrojs/cloudflare/entrypoints/server` ;
- configurer les assets selon la convention de l'adapter installé ;
- ne plus pointer vers `./src/server.ts`.

Valider la configuration contre la documentation officielle de la version installée avant de finaliser.

## 6. Structure cible de `apps/website`

```text
apps/website/
├── public/
│   ├── brand/
│   ├── docs/
│   ├── better-auth.png
│   ├── cloudflare.png
│   ├── polar.png
│   ├── shadcn.png
│   ├── astro.svg ou astro.png
│   └── ...
│
├── src/
│   ├── actions/
│   │   ├── index.ts
│   │   └── payments.ts
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── landing/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── payments/
│   │   ├── theme/
│   │   └── ui/
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── DocsLayout.astro
│   │   └── AppLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── docs/
│   │   │   ├── index.astro
│   │   │   └── [name].astro
│   │   ├── app/
│   │   │   ├── index.astro
│   │   │   └── polar/
│   │   │       ├── subscriptions.astro
│   │   │       ├── checkout/
│   │   │       │   └── success.astro
│   │   │       └── portal.ts
│   │   └── api/
│   │       └── auth/
│   │           └── [...all].ts
│   │
│   ├── server/
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   ├── payments.ts
│   │   ├── polar.ts
│   │   └── posthog.ts
│   │
│   ├── lib/
│   ├── utils/
│   ├── styles.css
│   └── env.d.ts
│
├── astro.config.mjs
├── components.json
├── package.json
├── tsconfig.json
└── wrangler.jsonc
```

N'ajouter `content/` ou `assets/` que si le code existant ou la migration en a réellement besoin. Ne pas créer des dossiers vides pour faire joli.

## 7. Migration des routes

Mapping obligatoire :

```text
src/routes/__root.tsx
-> src/layouts/BaseLayout.astro

src/routes/index.tsx
-> src/pages/index.astro

src/routes/_static/route.tsx
-> src/layouts/DocsLayout.astro

src/routes/_static/docs/index.tsx
-> src/pages/docs/index.astro

src/routes/_static/docs/$name.tsx
-> src/pages/docs/[name].astro

src/routes/_auth/route.tsx
-> src/layouts/AppLayout.astro + contrôle de session côté serveur

src/routes/_auth/app/index.tsx
-> src/pages/app/index.astro

src/routes/_auth/app/polar/subscriptions.tsx
-> src/pages/app/polar/subscriptions.astro

src/routes/_auth/app/polar/checkout.success.tsx
-> src/pages/app/polar/checkout/success.astro

src/routes/_auth/app/polar/portal.tsx
-> src/pages/app/polar/portal.ts

src/routes/api/auth.$.tsx
-> src/pages/api/auth/[...all].ts
```

Règles :

- remplacer les `<Link>` TanStack par des `<a href>` standards ou navigation Astro lorsque nécessaire ;
- supprimer `createFileRoute`, `createRootRouteWithContext`, `Outlet`, `Route.useNavigate`, `Route.useLoaderData`, route tree, typed TanStack search APIs ;
- utiliser `Astro.url.searchParams` + Zod pour `checkout_id` ;
- les pages `/app/**` qui nécessitent une session doivent être `prerender = false` ;
- les pages marketing/docs restent pré-rendues par défaut lorsque possible ;
- `portal.ts` reste un endpoint GET protégé qui crée une session portail Polar, capture PostHog puis retourne une redirection HTTP vers Polar.

## 8. Better Auth

Better Auth reste.

Conserver :

```text
better-auth
better-auth/react
packages/data-ops/src/auth/setup.ts
schémas auth Drizzle
Google OAuth
sessions/users/accounts/verification
```

Migrer l'API auth vers le pattern officiel Astro :

```text
src/pages/api/auth/[...all].ts
```

avec un handler `ALL`/équivalent qui appelle `auth.handler(context.request)` et `prerender = false` si requis par Astro.

Ne pas initialiser Better Auth pour toutes les pages marketing au build.

Créer un helper serveur explicite dans `apps/website/src/server/auth.ts` pour :

- construire/récupérer l'instance Better Auth à partir de l'env Cloudflare et du DB client ;
- obtenir la session depuis les headers d'une requête ;
- `requireSession()` pour les routes/actions protégées ;
- conserver l'identification PostHog actuelle lorsqu'une session authentifiée est requise.

La partie app peut utiliser un contrôle de session côté serveur dans `AppLayout.astro`. Réutiliser les composants React existants pour l'UI d'auth si cela minimise le diff.

## 9. Neon + Drizzle + `data-ops`

Conserver `packages/data-ops` et son rôle.

Ne pas changer de DB, ORM ou schémas.

Ne pas changer le contrat d'environnement DB (`DATABASE_HOST`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`) dans ce chantier sauf nécessité technique prouvée. La suggestion antérieure d'unifier vers `DATABASE_URL` n'est PAS dans le scope final car la priorité finale est de préserver le backend actuel.

Refactor minimal requis par la disparition de `src/server.ts` TanStack :

Actuellement :

```text
initDatabase() -> singleton global mutable
setAuth()       -> singleton global mutable
custom TanStack server entry initialise tout avant chaque handler
```

Cible :

- rendre la création DB/Auth appelable explicitement depuis Astro et `data-service` ;
- éviter de dépendre d'un ordre global `init puis get` pour que les Actions/endpoints Astro puissent fonctionner de façon autonome ;
- conserver les exports et comportements existants lorsqu'ils sont encore utiles au `data-service` ou aux scripts ;
- faire le plus petit refactor possible, sans DDD ni nouvelles couches artificielles.

Exemple de direction acceptable :

```text
packages/data-ops/src/database/setup.ts
- createDatabase(connection)
- optionnellement un cache local sûr si nécessaire

packages/data-ops/src/auth/server.ts
- createAuthServer({ db, secret, baseURL, socialProviders })
```

Puis dans `apps/website/src/server/database.ts` :

```text
Cloudflare env -> createDatabase(...)
```

et `apps/website/src/server/auth.ts` :

```text
DB + env -> createAuthServer(...)
```

Ne pas faire importer `astro:*` par `packages/data-ops`.

Règle : `packages/data-ops` doit rester framework-agnostic.

## 10. Astro Actions : remplacement des TanStack server functions

Les `createServerFn()` TanStack doivent être remplacées par Astro Actions et/ou helpers serveur simples.

Fichier source actuel :

```text
src/core/functions/payments.ts
```

Fonctions métier à préserver :

```text
getProducts
createPaymentLink
validPayment
collectSubscription
```

Cible recommandée :

```text
src/server/payments.ts
= logique serveur pure réutilisable

src/actions/payments.ts
= wrappers Astro Actions exposés au navigateur quand nécessaire

src/actions/index.ts
= export du `server` object Astro
```

Préserver :

- validation Zod ;
- `POLAR_SECRET` / `POLAR_SERVER` ;
- externalCustomerId = user id ;
- success URL checkout ;
- customer IP si disponible proprement via le contexte Cloudflare/Astro ;
- événements PostHog : `checkout_initiated`, `checkout_succeeded`, `subscription_collected` ;
- capture des exceptions PostHog ;
- contrôle auth avant les opérations Polar.

Ne pas exposer une action protégée sans `requireSession()` dans le handler.

## 11. Polar

Polar reste entièrement dans la stack.

Conserver :

```text
@polar-sh/sdk
@polar-sh/better-auth
packages/data-ops/src/queries/polar.ts
packages/data-ops/src/zod-schema/polar.ts
src/lib/polar.ts ou équivalent
```

Supprimer seulement :

```text
@polar-sh/tanstack-start
```

### Checkout hook

Actuel :

```text
components/payments/polar/use-checkout.ts
-> useMutation(@tanstack/react-query)
-> createPaymentLink(server fn)
```

Cible :

- conserver l'API de hook si cela minimise les changements UI ;
- implémenter l'état `pending/error` avec React local ;
- appeler l'Astro Action `createPaymentLink` ;
- rediriger `window.location.href = checkout.url`.

### Subscriptions

Actuel : TanStack loader + React Query prefetch/suspense.

Cible :

- page Astro on-demand protégée ;
- charger produits + abonnement côté serveur via helpers ;
- passer les données initiales au composant `PricingGrid` ;
- garder le composant et son design.

### Checkout success

Actuel : loader + validation paiement + polling React Query toutes les 2s jusqu'à apparition d'un abonnement.

Cible :

- page Astro on-demand ;
- valider `checkout_id` avec Zod ;
- effectuer la validation initiale côté serveur ;
- isoler le polling dans un petit island React, sans React Query ;
- polling local via `useEffect`/timer sur une Astro Action ou endpoint protégé ;
- conserver les états visuels `processing / success / error` et la navigation existante.

### Portal

Conserver le comportement de redirection serveur vers `customerPortalUrl` et les événements PostHog.

## 12. React Query

Retirer React Query du socle.

Ne pas le remplacer par une autre librairie de cache globale.

Remplacements :

```text
server render / frontmatter Astro
Astro Actions
petit état React local
polling local ciblé
fetch uniquement si Action/endpoint n'est pas adapté
```

Le starter est marketing-first, pas SPA-first.

## 13. UI / design / landing

Objectif : landing visuellement quasi identique.

Conserver les composants et styles existants autant que possible :

```text
src/components/ui/*
src/components/landing/hero-section.tsx
src/components/landing/claude-code-section.tsx
src/components/landing/features-section.tsx
src/components/landing/course-promo-section.tsx
src/components/landing/footer.tsx
src/components/navigation/navigation-bar.tsx
src/components/auth/*
src/components/payments/polar/*
src/styles.css
components.json
```

Ne pas convertir tous les `.tsx` en `.astro` juste pour le principe.

Règle :

```text
.astro par défaut pour composition/pages/layouts
React island seulement si interaction/browser state
```

Composants probablement interactifs à hydrater :

- navigation mobile ;
- theme toggle ;
- Better Auth client UI ;
- dialogs/sheets ;
- checkout ;
- checkout polling ;
- widgets futurs WhatsApp/AI.

Éviter d'hydrater les sections purement statiques si elles peuvent être rendues server-side par l'intégration React sans `client:*`.

### ThemeProvider

Ne pas recréer un énorme provider React global. Conserver les CSS variables et `.dark`. Encapsuler uniquement les islands qui nécessitent le contexte actuel, ou remplacer le contexte par un petit script de thème partagé si cela réduit le JS sans changer l'UI.

### Landing actuelle

Ordre actuel :

```text
NavigationBar
HeroSection
ClaudeCodeSection
FeaturesSection
MiddlewareDemo
CoursePromoSection
Footer
```

Ordre cible :

```text
NavigationBar
HeroSection
ClaudeCodeSection
FeaturesSection
CoursePromoSection
Footer
```

`MiddlewareDemo` doit disparaître, car sa seule raison d'être est de démontrer TanStack server functions + middleware + React Query.

Ne pas redesigner le reste.

Modifier uniquement la copy liée au framework :

- `TanStack Start` -> `Astro` ;
- feature cards `TanStack Router` / `TanStack Query` -> cartes Astro pertinentes, par exemple `Astro` + `Astro Actions` ;
- footer écosystème TanStack -> Astro / Cloudflare / stack conservée ;
- `Application TanStack Start prête à personnaliser` -> formulation Astro Kit ;
- `jd-astro-kit` visible dans la navigation -> `jd-astro-kit` ou `astro-kit` selon la convention retenue ;
- supprimer `public/tanstack.png` après remplacement dans la doc ;
- ajouter un asset Astro officiel ou équivalent local et mettre à jour les alt/textes.

## 14. SEO / page shell

Migrer le contenu de `src/routes/__root.tsx` vers `BaseLayout.astro` :

Conserver :

- `lang="fr"` ;
- viewport ;
- canonical ;
- favicons ;
- manifest ;
- CSS global ;
- métadonnées SEO existantes, en remplaçant la copy SaaS/TanStack par Astro Kit ;
- 404 et error UI avec équivalent Astro.

Supprimer :

- TanStack Router Devtools ;
- React Query Devtools ;
- `<Scripts />` TanStack ;
- QueryClient context.

Les pages marketing doivent rester pré-rendues par défaut pour performance/SEO/GEO.

## 15. Documentation applicative

Conserver :

```text
apps/website/public/docs/authentication.md
apps/website/public/docs/database.md
apps/website/public/docs/polar.md
```

Mettre à jour le contenu framework-specific :

```text
TanStack custom server entry -> Astro Cloudflare adapter + server helpers
createFileRoute              -> file-based pages Astro
createServerFn               -> Astro Actions
TanStack middleware          -> Astro helpers/middleware/action auth
TanStack API route           -> Astro endpoint
TanStack Start               -> Astro
```

Ne pas réécrire la documentation Neon, Drizzle, Better Auth et Polar qui reste correcte.

La documentation applicative rendue doit rester en anglais conformément à `AGENTS.md`, sauf décision explicite contraire déjà présente dans les fichiers.

## 16. Documentation repo et instructions agents

Mettre à jour au minimum :

```text
README.md
AGENTS.md
CLAUDE.md si nécessaire
apps/website/README.md
docs/architecture/monorepo.md
.agents/project-setup-guide.md si références concernées
skills project-specific sous .agents/skills/
```

### AGENTS.md cible

Décrire :

```text
apps/website     = Astro website, marketing pages, Actions, auth-facing UI, Polar UI
apps/data-service = Hono worker backend/service workloads
packages/data-ops = shared framework-agnostic data/auth layer
```

Remplacer les commandes par :

```text
pnpm dev:website
pnpm deploy:website
```

Règles d'architecture à ajouter :

1. Une nouvelle page va dans `apps/website/src/pages`.
2. Utiliser `.astro` par défaut pour pages/layout/composition.
3. Hydrater React uniquement en cas d'interactivité réelle.
4. Utiliser Astro Actions pour les mutations initiées par le site.
5. Utiliser les Astro endpoints pour auth/callbacks/endpoints propres au site.
6. Utiliser `data-service` pour services réellement indépendants, webhooks partagés, queues, workflows, WhatsApp, agent IA et traitements asynchrones.
7. `data-ops` reste framework-agnostic et ne doit pas importer `astro:*`, React, Hono ou `cloudflare:workers`.
8. Ne pas ajouter React Query ou un state manager global sans besoin démontré.
9. Pages marketing pré-rendues par défaut.
10. Préserver les `.env` et ne jamais exécuter une migration DB destructive sans autorisation.

### Skills project-specific à adapter

En particulier :

```text
create-prd
implement-forms
cro-web-implement
cro-delivery-spec si sa copy mentionne le Astro Kit
```

Remplacer les contrats d'architecture TanStack spécifiques au projet par Astro :

```text
route -> Astro page
server function -> Astro Action
TanStack middleware -> Astro server helper / middleware
```

Ne pas supprimer une mention générique de TanStack dans une documentation tierce de compatibilité si elle ne décrit pas ce projet. En revanche, toutes les références au projet `astro-kit` doivent devenir `astro-kit`.

## 17. Assets et generated files

Conserver :

```text
public/brand/*
favicons
manifest
robots
images Better Auth / Cloudflare / Polar / shadcn si utilisées
```

Remplacer/supprimer :

```text
public/tanstack.png -> asset Astro
```

Nettoyer avant validation :

```text
dist/
.wrangler/
```

Ne pas modifier manuellement :

```text
pnpm-lock.yaml
```

Le régénérer via `pnpm install` après modification des manifests.

## 18. Scripts racine cibles

La philosophie reste la même, avec noms adaptés :

```json
{
  "name": "jd-astro-kit",
  "scripts": {
    "setup": "pnpm install && pnpm run build:data-ops",
    "build:data-ops": "pnpm --filter @repo/data-ops build",
    "dev:website": "pnpm --filter jd-astro-site dev",
    "deploy:website": "pnpm run build:data-ops && pnpm --filter jd-astro-site deploy",
    "dev:data-service": "pnpm --filter jd-data-service dev",
    "deploy:data-service": "pnpm run build:data-ops && pnpm --filter jd-data-service deploy",
    "dev": "pnpm --parallel --filter jd-astro-site --filter jd-data-service dev",
    "build": "pnpm run build:data-ops && pnpm --filter jd-data-service build && pnpm --filter jd-astro-site build",
    "typecheck": "pnpm -r typecheck",
    "test": "...",
    "skills:sync": "node scripts/sync-agent-skills.mjs"
  }
}
```

Conserver les commandes Drizzle/auth existantes.

Ne pas conserver les anciens alias `dev:website` / `deploy:website` sauf preuve qu'une CI externe non modifiable en dépend. Les docs du repo doivent utiliser les nouveaux noms.

## 19. Ce qui doit rester fonctionnel

Fonctionnalités à préserver :

- landing page et design actuel hors démo TanStack ;
- dark mode / theme toggle ;
- navigation desktop/mobile ;
- docs `/docs` et `/docs/[name]` ;
- Better Auth + Google login ;
- session utilisateur ;
- app shell `/app` ;
- Polar product listing ;
- checkout ;
- checkout success/polling ;
- subscription display ;
- customer portal redirect ;
- PostHog events/exceptions ;
- Neon + Drizzle ;
- migrations et schémas existants ;
- `data-service` Hono ;
- Cloudflare Workers deployment model ;
- shadcn / Radix / Tailwind ;
- project skills et symlink model `.agents` -> `.claude`.

## 20. Ce qui disparaît volontairement

- TanStack Start ;
- TanStack Router ;
- TanStack Query ;
- Query/Router devtools ;
- SSR Query integration ;
- generated route tree ;
- TanStack custom server entry ;
- TanStack middleware APIs ;
- `@polar-sh/tanstack-start` ;
- `MiddlewareDemo` et les example server/middleware files liés uniquement à TanStack.

## 21. Validation obligatoire

### 21.1 Baseline

Avant de modifier :

- inspecter `git status` ;
- ne pas écraser des changements utilisateur existants ;
- noter les validations qui passent/échouent déjà ;
- ne pas considérer `pnpm test` comme une vraie suite si le script ne fait qu'afficher "No automated test suite is configured.".

### 21.2 Gates de naming

Après migration, dans les fichiers suivis et hors caches/build/history :

```bash
rg -ni 'saas[-_ ]?kit|SAAS[-_ ]?KIT|Astro Kit' \
  --glob '!node_modules/**' \
  --glob '!dist/**' \
  --glob '!.git/**' \
  --glob '!.pnpm-store/**'
```

Résultat attendu : zéro référence de marque obsolète.

Vérifier également qu'aucun nom de fichier suivi ne contient `astro-kit`.

Project-specific TanStack gate :

```bash
rg -ni '@tanstack|TanStack Start|TanStack Router|TanStack Query' \
  apps/website README.md docs/architecture .agents/skills/cro-web-implement .agents/skills/implement-forms .agents/skills/create-prd
```

Résultat attendu : aucune référence d'architecture TanStack obsolète. Une mention purement générique/tiers dans un document de compatibilité non lié à l'architecture du projet peut rester, mais doit être explicitement justifiée.

### 21.3 Install / generated files

```bash
pnpm install
pnpm skills:sync
pnpm run build:data-ops
```

Si nécessaire :

```bash
pnpm --filter jd-astro-site cf-typegen
```

### 21.4 Type/build

```bash
pnpm typecheck
pnpm build
```

Les deux doivent passer.

### 21.5 Tests

Ajouter des tests ciblés lorsque la migration transforme une logique avec risque réel, en priorité :

- validation des inputs payment ;
- auth helper / unauthorized path ;
- Polar server helper avec mock ;
- mapping du polling checkout si facile à isoler.

Ne pas construire une grosse suite de tests hors scope.

### 21.6 Smoke web local

Lancer le site localement et vérifier au minimum :

```text
/
/docs
/docs/authentication
/app
/app/polar/subscriptions
/app/polar/checkout/success?checkout_id=<dummy-or-mocked>
/api/auth/* handler existence
```

Les routes protégées peuvent répondre par login/unauthorized sans vraies credentials. L'objectif est l'absence de crash de routing/build et le bon comportement du guard.

Vérifier également :

- la landing correspond visuellement à l'ancienne hors `MiddlewareDemo` et copy/branding ;
- navigation mobile ;
- theme toggle ;
- pas d'erreur console liée à l'hydratation ;
- pas de React global inutile ;
- HTML marketing généré sans dépendre d'une session/DB ;
- docs accessibles ;
- assets/favicons chargés.

### 21.7 Diff review

Avant final :

- `git status` propre hors changements attendus ;
- aucun secret ajouté ;
- aucun fichier `.env` changé ;
- aucun `dist/`, `.wrangler/`, `node_modules/`, `.DS_Store` ou `__MACOSX` ajouté au commit ;
- lockfile régénéré proprement ;
- pas de changements de schéma/migration DB non demandés ;
- pas de refonte visuelle opportuniste ;
- pas de mise à niveau majeure TypeScript/Better Auth/Polar/Hono hors nécessité.

## 22. Définition de done

La migration est terminée quand :

1. le repo/buildable project s'appelle `astro-kit` / `jd-astro-kit` dans tout le contenu suivi ;
2. `apps/website` remplace `apps/website` ;
3. TanStack est absent du runtime frontend ;
4. Astro route la landing, docs et app ;
5. Astro Actions remplacent les server functions TanStack ;
6. Better Auth, Polar, PostHog, Neon, Drizzle et Hono restent opérationnels ;
7. `data-service` et `data-ops` gardent leurs frontières ;
8. la landing est visuellement préservée hors démo TanStack et copy framework ;
9. les docs et instructions agents décrivent Astro Kit ;
10. les fichiers de skills `astro-kit-*` sont renommés `astro-kit-*` et leurs références sont cohérentes ;
11. `pnpm typecheck` passe ;
12. `pnpm build` passe ;
13. les smokes de routes passent ;
14. aucun `astro-kit` de marque ne subsiste dans les fichiers suivis ;
15. aucun secret, migration DB ou déploiement n'a été effectué.

## 23. Suggested skills

Pour la session Codex qui exécute cette migration :

- `implement` : skill principal pour appliquer le chantier à partir de ce handoff ;
- `tdd` : pour les tests ciblés des helpers/actions où la logique métier est déplacée ;
- `blast-radius` : avant les renommages de packages/routes et avant suppression des APIs TanStack ;
- `code-review` : review finale du diff ;
- `cro-web-validate` : validation visuelle/UX de la landing après migration si le skill est disponible et adapté.

Ne pas invoquer de skill de redesign : la landing doit rester la même visuellement.

---

# Prompt unique d'exécution pour Codex

Tu es déjà lancé à la racine du projet dézippé et renommé `ASTRO-KIT`. Exécute intégralement la migration décrite ci-dessous. Ne te contente pas d'un plan et ne t'arrête pas après les premiers fichiers.

## Objectif

Transformer le repo actuel en `astro-kit`, un monorepo Astro orienté sites vitrines / landing pages multi-pages, tout en conservant au maximum le backend actuel.

Le résultat doit garder `apps/data-service` et `packages/data-ops`, Neon, Drizzle, Better Auth, Polar, PostHog, Hono, Cloudflare, React 19, Tailwind v4, shadcn/Radix et les fonctionnalités de la partie app. Le frontend `apps/website` doit devenir `apps/website` sous Astro.

## Contraintes non négociables

1. Le repo existant est la source de vérité. Inspecte les fichiers avant de modifier.
2. Remplace partout la marque `astro-kit` par `astro-kit`, avec la casse humaine appropriée : `Astro Kit` -> `Astro Kit`, `jd-astro-kit` -> `jd-astro-kit`, et renomme les fichiers/paths contenant `astro-kit`. Si possible renomme aussi le dossier racine `ASTRO-KIT` en `astro-kit`. Ne réécris pas l'historique `.git`.
3. Renomme `apps/website` en `apps/website`, `jd-astro-site` en `jd-astro-site`, et les scripts `dev:website` / `deploy:website` en `dev:website` / `deploy:website`.
4. Préserve les `.env` byte-for-byte. N'affiche aucun secret.
5. Ne déploie rien. Ne lance aucune migration DB destructive.
6. Ne fais pas de broad dependency upgrade. Garde les versions backend actuelles sauf incompatibilité Astro bloquante. Ajoute seulement les packages Astro nécessaires avec des versions stables compatibles.
7. Ne redesign pas la landing. Garde ses composants, styles, spacing, couleurs, dark mode, shadcn et assets. Supprime uniquement `MiddlewareDemo` et remplace la copy / les logos TanStack par Astro Kit.
8. Ne crée pas `packages/ui` et n'introduis pas de DDD / Clean Architecture supplémentaire.
9. Garde `apps/data-service` comme Worker Hono séparé et `packages/data-ops` comme couche data/auth partagée framework-agnostic.
10. `packages/data-ops` ne doit pas importer Astro, React, Hono ou `cloudflare:workers`.

## Migration frontend

Supprime du frontend :

- `@tanstack/react-start`
- `@tanstack/react-router`
- `@tanstack/react-query`
- TanStack devtools
- `@tanstack/react-router-ssr-query`
- `@polar-sh/tanstack-start`
- TanStack Start Vite plugin
- Cloudflare Vite plugin
- React Vite plugin si Astro l'a remplacé
- `src/start.tsx`
- `src/router.tsx`
- `src/routeTree.gen.ts`
- `src/server.ts`
- `src/integrations/tanstack-query/`
- `src/core/functions/example-functions.ts`
- `src/core/middleware/example-middleware.ts`
- `src/components/demo/middleware-demo.tsx`
- `vite.config.ts`

Ajoute/configure :

- `astro`
- `@astrojs/react`
- `@astrojs/cloudflare`
- `@astrojs/check`
- `astro.config.mjs`
- `src/pages`
- `src/layouts`
- `src/actions`
- `src/server`

Conserve Tailwind v4 via `@tailwindcss/vite`, React 19 et shadcn/Radix.

Astro doit rester statique/prerender par défaut pour les pages marketing. Les routes `/app/**`, auth et autres routes qui nécessitent session/cookies doivent être on-demand. N'active pas tout le site en server rendering par défaut sans raison.

Conserve le dev port 3000.

Configure Cloudflare avec l'adapter Astro et l'entrypoint Wrangler attendu par la version installée. Avec les versions Astro récentes, vérifie `@astrojs/cloudflare/entrypoints/server`. Ne pointe plus vers `src/server.ts`.

## Routes

Migre exactement :

- `routes/__root.tsx` -> `layouts/BaseLayout.astro`
- `routes/index.tsx` -> `pages/index.astro`
- `_static/route.tsx` -> `layouts/DocsLayout.astro`
- `_static/docs/index.tsx` -> `pages/docs/index.astro`
- `_static/docs/$name.tsx` -> `pages/docs/[name].astro`
- `_auth/route.tsx` -> `layouts/AppLayout.astro` avec session server-side
- `_auth/app/index.tsx` -> `pages/app/index.astro`
- `_auth/app/polar/subscriptions.tsx` -> `pages/app/polar/subscriptions.astro`
- `_auth/app/polar/checkout.success.tsx` -> `pages/app/polar/checkout/success.astro`
- `_auth/app/polar/portal.tsx` -> `pages/app/polar/portal.ts`
- `api/auth.$.tsx` -> `pages/api/auth/[...all].ts`

Remplace les `Link` TanStack par des liens HTML/Astro. Remplace search params/loader APIs par `Astro.url`, frontmatter, Zod et helpers serveur.

## Backend et auth

Garde Neon + Drizzle + Better Auth + Polar + PostHog.

Ne change pas le contrat DB `DATABASE_HOST` / `DATABASE_USERNAME` / `DATABASE_PASSWORD` dans ce chantier.

Le custom TanStack `src/server.ts` disparaît. Refactor uniquement ce qui est nécessaire pour que DB/Auth puissent être créés explicitement depuis Astro : évite la dépendance obligatoire à un ordre global `initDatabase()` puis `getDb()` / `setAuth()` puis `getAuth()`.

Conserve le maximum de code `data-ops`, mais introduis des factories/helpers request-safe si nécessaire. Aucun import Astro dans `data-ops`.

Monte Better Auth sur `pages/api/auth/[...all].ts` selon le pattern Astro officiel. Les pages marketing ne doivent pas initialiser l'auth au build. Les routes/actions protégées doivent vérifier la session côté serveur.

## Server functions -> Astro Actions

Préserve la logique de `core/functions/payments.ts` :

- `getProducts`
- `createPaymentLink`
- `validPayment`
- `collectSubscription`

Déplace la logique pure dans `src/server/payments.ts` si cela facilite la réutilisation et expose les opérations client nécessaires dans `src/actions/payments.ts`, exportées par `src/actions/index.ts`.

Préserve Zod, auth, Polar, PostHog, customer IP quand disponible, les success URLs et les événements :

- `checkout_initiated`
- `checkout_succeeded`
- `subscription_collected`
- `customer_portal_opened`

Les actions protégées doivent appeler un helper de session et renvoyer une erreur Astro correcte si non authentifiées.

## React Query -> état local / server render

Supprime React Query sans ajouter une autre librairie globale.

- `use-checkout.ts` garde si utile la même API publique, mais utilise état React local + Astro Action.
- `subscriptions.astro` charge produits + abonnement côté serveur et passe les props à `PricingGrid`.
- `checkout/success.astro` valide `checkout_id`, effectue la validation initiale, puis utilise un petit island React pour le polling toutes les ~2 s jusqu'à disponibilité de l'abonnement. Utilise `useEffect`/timer + Action/endpoint, pas React Query.
- garde exactement les états visuels processing/success/error et les CTA existants.

## Landing / UI

Conserve :

- `NavigationBar`
- `HeroSection`
- `ClaudeCodeSection`
- `FeaturesSection`
- `CoursePromoSection`
- `Footer`
- tous les composants shadcn/Radix
- `styles.css`
- le design, responsive, dark mode et branding hors nom du kit/framework.

Supprime `MiddlewareDemo`.

Remplace la copy TanStack par Astro Kit. Remplace les cards `TanStack Router` / `TanStack Query` par des cards Astro pertinentes. Remplace l'écosystème TanStack du footer. Supprime `public/tanstack.png` et ajoute/utilise un asset Astro approprié. Le nom visible `jd-astro-kit` doit devenir `jd-astro-kit` ou `astro-kit` selon le contexte.

N'hydrate React que lorsque nécessaire. Un composant React statique peut être rendu par Astro sans `client:*`. Les composants interactifs deviennent des islands ciblés.

## Documentation et agents

Mets à jour :

- `README.md`
- `AGENTS.md`
- `docs/architecture/monorepo.md`
- README de l'app renommée
- docs applicatives `authentication.md`, `database.md`, `polar.md`
- tous les skills project-specific qui supposent TanStack ou le nom Astro Kit.

Renomme les fichiers :

- `astro-kit-snapshot.json` -> `astro-kit-snapshot.json`
- les deux `astro-kit-integration.md` -> `astro-kit-integration.md`

Mets à jour toutes leurs références dans scripts/evals/SKILL/openai yaml.

`.agents/skills` est canonique, `.claude/skills` est en symlinks. Exécute `pnpm skills:sync` après modification.

N'efface pas les mentions génériques de TanStack qui appartiennent à une documentation tierce de compatibilité et ne décrivent pas ce projet. En revanche, aucune référence de marque `astro-kit` ne doit rester.

## Scripts / package names

Root package : `jd-astro-kit`.
Frontend package/worker : `jd-astro-site`.
Data service et `@repo/data-ops` gardent leurs noms.

Mets à jour les scripts racine et tous les filtres pnpm pour `apps/website` / `jd-astro-site`.

Régénère `pnpm-lock.yaml` uniquement via `pnpm install`.

## Validation obligatoire

Commence par inspecter `git status` et ne détruis pas de changements utilisateur existants.

À la fin :

1. Lance `pnpm install`.
2. Lance `pnpm skills:sync`.
3. Lance `pnpm run build:data-ops`.
4. Lance `pnpm typecheck`.
5. Lance `pnpm build`.
6. Ajoute des tests ciblés pour les zones à risque si nécessaire ; ne prétends pas que le script test actuel est une vraie suite s'il ne fait qu'imprimer un message.
7. Fais des smoke tests locaux de `/`, `/docs`, `/docs/authentication`, `/app`, `/app/polar/subscriptions`, checkout success et du handler auth, sans nécessiter de vrais secrets.
8. Vérifie navigation mobile, theme toggle, absence d'erreurs d'hydratation et conservation visuelle de la landing.
9. Vérifie qu'aucun `.env`, secret, migration DB, `dist`, `.wrangler`, `node_modules`, `.DS_Store` ou `__MACOSX` n'est ajouté/modifié de façon indésirable.
10. Lance une recherche finale case-insensitive de `astro-kit`, `ASTRO-KIT`, `Astro Kit` dans tous les fichiers suivis hors `.git` et caches. Il doit rester zéro référence de marque obsolète et zéro nom de fichier `astro-kit*`.
11. Recherche les références TanStack dans `apps/website`, README, docs architecture et skills project-specific. Il ne doit plus rester de dépendance ou instruction TanStack liée à l'architecture du projet.

Ne t'arrête que lorsque le build et le typecheck passent, ou si un blocage externe réel et non contournable subsiste. Dans ce cas, termine tout le reste et donne le blocage exact, les fichiers concernés et la commande qui le reproduit.

En sortie, fournis :

- résumé du diff ;
- fichiers/dossiers renommés ;
- packages ajoutés/supprimés ;
- comportement auth/Polar préservé ;
- validations exécutées et résultats ;
- éventuels écarts résiduels ou actions hôte impossibles depuis la session.
