# OneAtlas — AI Model Discovery & Intelligence

OneAtlas is a single AI model discovery and comparison platform built for the AI Software Engineer Internship assignment.

**Live application:** https://oneatlas-next-app.vercel.app/  
**GitHub repository:** https://github.com/Rupsamaji/oneatlas

## Technology stack

- Next.js 15 App Router and React 19
- TypeScript
- Tailwind CSS v4
- Node.js / Next.js Route Handlers
- PostgreSQL
- Prisma ORM 6
- Vercel and Neon PostgreSQL

## Features

- AI model discovery with search, category filters and sorting
- Model detail views
- Side-by-side comparison of up to three models
- Model rankings
- AI provider directory
- AI labs directory
- Responsive interface
- Database-backed API endpoints

## API routes

- `GET /api/health`
- `GET /api/models`
- `GET /api/models/[slug]`
- `GET /api/providers`
- `GET /api/labs`

## Project structure

The internship application is located in `next-app/`.

## Run locally

Requirements: Node.js (current supported LTS) and npm.

1. `cd next-app`
2. `npm install`
3. Create `next-app/.env` locally and add your PostgreSQL connection string:

   ```env
   DATABASE_URL="YOUR_POSTGRESQL_CONNECTION_STRING"
   ```

4. Generate Prisma Client and apply the schema:

   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000

For a production build, run `npm run build` followed by `npm start`.

## Deployment

The live application is deployed on Vercel with the project root set to `next-app`. PostgreSQL is hosted on Neon. Configure `DATABASE_URL` in the hosting provider's environment settings; never commit credentials or `.env` files.

## Demo-data disclosure

The included model catalogue, prices and scores are illustrative seed/demo data. They are not live provider quotes or independently verified benchmark results.

## Internship submission

The submission includes this live application, this GitHub repository and a 5–10 minute Loom walkthrough explaining the architecture, features, database/API design, technical decisions and limitations.

Submission form: https://forms.gle/oDQ6ucjpiFaZtCGL9
