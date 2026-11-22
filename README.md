# OneAtlas — AI Model Discovery & Intelligence

OneAtlas is an AI model discovery and comparison platform. The repository contains two implementations: the original React/Vite application and a newer Next.js implementation prepared for the AI Software Engineer Internship assignment.

## Live applications

| Version | Live URL | Technology |
|---|---|---|
| New internship implementation | https://oneatlas-next-app.vercel.app/ | Next.js, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL |
| Original application | https://oneatlas-xi.vercel.app/ | React, Vite, Express, MongoDB |

**Repository:** https://github.com/Rupsamaji/oneatlas

## Internship implementation (recommended)

The assignment-oriented implementation is in `next-app/` on the `upgrade/required-stack` branch.

### Technology stack

- Next.js 15 App Router and React 19
- TypeScript
- Tailwind CSS v4
- Node.js / Next.js Route Handlers
- PostgreSQL
- Prisma ORM 6
- Vercel deployment; Neon PostgreSQL database

### Main capabilities

- AI model discovery, search, category filtering and sorting
- Model information and detail API
- Side-by-side comparison (up to three models)
- Model rankings
- AI provider directory
- AI labs directory
- Health-check endpoint
- Responsive user interface

### API routes

- `GET /api/health`
- `GET /api/models`
- `GET /api/models/[slug]`
- `GET /api/providers`
- `GET /api/labs`

### Run the internship app locally

Requirements: Node.js (use a current supported LTS release) and npm.

1. Open the application directory:

   ```bash
   cd next-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local `.env` file in `next-app/` (do not commit it) and set your PostgreSQL connection string:

   ```env
   DATABASE_URL="YOUR_POSTGRESQL_CONNECTION_STRING"
   ```

4. Generate Prisma Client and apply the schema:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Insert the sample catalogue:

   ```bash
   npm run db:seed
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open http://localhost:3000

Build for production:

```bash
npm run build
npm start
```

### Environment and deployment

Set `DATABASE_URL` in the hosting provider's environment-variable settings. Never commit real credentials, connection strings, or `.env` files.

For Vercel, select the `upgrade/required-stack` branch and set the Root Directory to `next-app`. The project uses the standard Next.js build command `npm run build`.

The database is configured through Neon PostgreSQL. Run `npx prisma db push` and `npm run db:seed` against the intended database before expecting model/provider/lab records to appear.

### Demo-data disclosure

The included model catalogue, prices and scores are illustrative seed/demo data. They are not live provider quotes or independently verified benchmark results. Replace them with sourced, dated data before presenting them as current market information.

## Original application

The original implementation is preserved separately in the repository's `main` branch and existing deployment.

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Frontend deployment: Vercel
- Backend deployment: Render

The original frontend is at https://oneatlas-xi.vercel.app/ and its API health endpoint is https://oneatlas-api-w60r.onrender.com/api/health.

To run the original application, follow its existing workspace instructions and configure the server's MongoDB environment variables. Do not confuse its setup with the separate `next-app/` setup.

## Repository structure

```text
oneatlas/
├── client/       # Original Vite/React frontend
├── server/       # Original Express/MongoDB backend
└── next-app/     # New Next.js internship implementation
```

## Project status and verification

The new implementation is deployed at https://oneatlas-next-app.vercel.app/. A reachable deployment does not by itself prove every feature or database operation is working. Before submission, test the model list, search/filter/sort, model details, comparison, rankings, provider and lab pages, API responses, and database connectivity in the live environment.

## Internship submission

The assignment submission requires the live website URL, GitHub repository URL and a 5–10 minute Loom walkthrough. The walkthrough should explain the architecture, stack, features, database/API design, technical decisions and limitations.

Submission form: https://forms.gle/oDQ6ucjpiFaZtCGL9
