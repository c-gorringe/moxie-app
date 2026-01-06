# Deploying MOXIE to Vercel

## Prerequisites
- GitHub account
- Vercel account (free - sign up at https://vercel.com)

## Step 1: Push to GitHub

1. Create a new repository on GitHub: https://github.com/new
   - Name: `moxie-app` (or your choice)
   - Visibility: Private or Public
   - **Don't** initialize with README
   - Click "Create repository"

2. Push your code (replace `YOUR_GITHUB_USERNAME`):

```bash
cd "/Users/colegorringe/ai-projects/True Commission/moxie-app"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/moxie-app.git
git branch -M main
git push -u origin main
```

## Step 2: Update Database for Production

We need to switch from SQLite to PostgreSQL for Vercel. Don't worry, I've prepared a script for this.

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npm install @vercel/postgres
```

## Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your `moxie-app` repository
4. Vercel will auto-detect Next.js - click "Deploy"
5. Wait for deployment to complete (2-3 minutes)

## Step 4: Set Up Vercel Postgres

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database" → "Postgres"
3. Name it `moxie-db` and click "Create"
4. Vercel will automatically add the `DATABASE_URL` environment variable

## Step 5: Set Up Database Schema

In your terminal, connect to Vercel:

```bash
npm install -g vercel
vercel login
vercel link
```

Then push the database schema:

```bash
npx prisma db push
```

## Step 6: Seed Production Database

Run the seed script on Vercel:

```bash
vercel env pull .env.local
npx prisma db seed
```

Or use this command to seed remotely:

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-extended.ts
```

## Step 7: Get Your Live URL

Your app will be live at: `https://moxie-app-YOUR_USERNAME.vercel.app`

You can:
- Share this URL with anyone
- Set up a custom domain in Vercel settings
- The app auto-deploys when you push to GitHub

## Troubleshooting

**Database connection issues:**
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Redeploy after adding database

**Build errors:**
- Check the Vercel deployment logs
- Make sure all dependencies are in `package.json`

## Making Updates

After deployment, any time you push to GitHub:
```bash
git add -A
git commit -m "Your update message"
git push
```

Vercel will automatically redeploy!
