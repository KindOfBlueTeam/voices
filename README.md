# Voices

A voice actor database — browse actors, see their characters, and explore the shows and movies they worked on.

## Stack

- **Next.js 14** (App Router, Server Actions)
- **PostgreSQL** + **Prisma ORM**
- **Tailwind CSS**
- Deployed on **Render.com**

## Local Development

### Prerequisites

- Node.js 18+
- [Postgres.app](https://postgresapp.com) (or any local PostgreSQL)

### Setup

```bash
# Install dependencies
npm install

# Create the local database
createdb voices

# Copy env file and fill in your values
cp .env.example .env

# Create tables
npm run db:migrate

# Load sample data (optional)
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin interface.

> **Local dev tip:** Leave `ADMIN_PASSWORD` blank in `.env` and the admin is open with no login required.

## Admin Interface

`/admin` lets you:
- Add and edit voice actors (name, bio, birth info, headshot)
- Add characters per actor, linked to a show or movie
- Upload images or use URLs (Wikipedia, etc.) for headshots and character images

Images are stored under `uploads/` locally and on a persistent disk on Render.

## Deployment (Render.com)

The `render.yaml` at the repo root defines everything:
- A **Node.js web service** (builds and runs the Next.js app)
- A **managed PostgreSQL** database
- A **persistent disk** mounted at `/data` for image uploads

### Environment variables to set in the Render dashboard

| Variable | Value |
|---|---|
| `ADMIN_PASSWORD` | Your chosen admin password |
| `UPLOAD_DIR` | `/data/uploads` |
| `NEXT_PUBLIC_BASE_URL` | Your Render service URL |

`DATABASE_URL` is wired automatically from the linked Postgres instance.

### Deploy flow

1. Develop and test locally
2. Commit changes
3. Push to GitHub → Render picks up the change and deploys automatically

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run pending migrations (dev) |
| `npm run db:migrate:deploy` | Run migrations (production) |
| `npm run db:seed` | Load sample voice actors |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
