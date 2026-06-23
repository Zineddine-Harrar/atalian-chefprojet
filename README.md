# Pilote Data — Atalian

Cockpit chef de projet data Atalian. Next.js 14 + Prisma + Postgres + NextAuth.

## Stack

- Next.js 14 (App Router) + TypeScript strict
- React 19
- Prisma + PostgreSQL (Vercel Postgres / Neon)
- NextAuth (Credentials + JWT)
- Zustand (UI state)
- @dnd-kit/core (kanban DnD)

## Démarrage local

```bash
cp .env.example .env
# Renseigner DATABASE_URL (Postgres local Docker ou Neon)
# Renseigner AUTH_SECRET

npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Login démo: `admin@atalian.local` / `admin`

## Déploiement Vercel

1. Push repo GitHub
2. Importer dans Vercel
3. Ajouter Vercel Postgres (Neon)
4. Variables env: `DATABASE_URL`, `AUTH_SECRET`
5. Premier deploy → Vercel CLI : `prisma migrate deploy` + `npm run db:seed`

## Roadmap

- **S1** Fondations: scaffold, schéma Prisma, auth, layout
- **S2** Vues lecture: Today, Projects
- **S3** Interactions: Kanban DnD, Drawer, Jalons
- **S4** Tests + prod
