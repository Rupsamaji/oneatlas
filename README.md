# OneAtlas — AI Model Discovery & Intelligence

A full-stack MVP for discovering, comparing and evaluating AI models across providers.

## Features
- Search, filter and sort models by company, provider, capability and model type
- Model detail views with context, modalities, pricing and provider availability
- Side-by-side model comparison
- Rankings and benchmark leaderboards
- AI lab and provider directories
- MongoDB-backed data served through Express REST APIs
- Responsive React interface

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- API: REST

## Requirements
- Node.js 20+
- npm
- MongoDB local instance or MongoDB Atlas connection string

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `server/.env` from `server/.env.example` and set `MONGODB_URI`.
3. Seed sample data:
   ```bash
   npm run seed
   ```
4. Start both frontend and backend:
   ```bash
   npm run dev
   ```
5. Open http://localhost:5173

Backend runs on http://localhost:5000. API health check: `/api/health`.

## Environment
`server/.env`
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/oneatlas
CLIENT_ORIGIN=http://localhost:5173
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

## API endpoints
- `GET /api/health`
- `GET /api/models?q=&company=&provider=&capability=&type=&sort=&page=&limit=`
- `GET /api/models/:id`
- `GET /api/models/compare?ids=id1,id2`
- `GET /api/rankings?category=&benchmark=`
- `GET /api/providers`
- `GET /api/providers/:slug`
- `GET /api/labs`
- `GET /api/labs/:slug`

## Deployment overview

Deployment configuration examples are included in `render.yaml` (Render backend) and `client/vercel.json` (Vercel frontend).
- Database: create a MongoDB Atlas cluster and configure its network access and database user.
- Backend: deploy the `server` workspace to Render; set `MONGODB_URI`, `CLIENT_ORIGIN` and `NODE_ENV=production`.
- Frontend: deploy the `client` workspace to Vercel; set `VITE_API_URL` to the deployed backend URL plus `/api`.
- Build command for frontend: `npm run build`; output directory: `dist`.
- Backend start command: `npm start` from the server workspace (or configure the root workspace command as appropriate).

## Important
The included model catalogue, prices and benchmark values are illustrative demo data, not live provider quotes or independently verified benchmark results. Treat them as seed data for the MVP. Replace or refresh them with verified sources before presenting the platform as a live market-data product.

## Suggested next steps
- Add authentication and saved comparison lists.
- Add scheduled provider-data ingestion with source timestamps.
- Add pagination controls and benchmark methodology/source links.
- Add automated API and UI tests.
