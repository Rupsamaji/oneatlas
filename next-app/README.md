# OneAtlas Next.js implementation

This new app lives in next-app/. The original Vite/Express/MongoDB app is unchanged.

## Local setup
1. Install Node.js 20.9+.
2. Run npm install inside next-app/.
3. Copy .env.example to .env and set DATABASE_URL to PostgreSQL (Neon is suitable).
4. Run npx prisma db push, then npm run db:seed.
5. Run npm run dev and open http://localhost:3000.

## Vercel
Import the repository, set Root Directory to next-app, add DATABASE_URL from Neon, use npm install and npm run build. Run prisma db push and npm run db:seed against the production database before deployment.

API: GET /api/health, /api/models, /api/models/:slug, /api/providers, /api/labs.
Seed scores and prices are illustrative demo data, not verified live benchmarks or current vendor quotes.
