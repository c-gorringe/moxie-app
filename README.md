# MOXIE - Sales Gamification App

A mobile-first sales team gamification and tracking application built with Next.js, React, TypeScript, and PostgreSQL.

## Features

- 🏆 **Leaderboard** - View team rankings with advanced filtering
- 📊 **Performance Dashboard** - Track personal sales metrics
- 👤 **Social Profiles** - View team member profiles with accolades
- 💰 **Commission Tracking** - Monitor earned commissions and payouts
- 📉 **Withholding Management** - Track withholding limits
- 🎯 **Real-time Updates** - Live data refresh

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Deployment:** Vercel (or any Node.js host)

## Prerequisites

Before running this app, make sure you have:

- Node.js 18+ installed
- PostgreSQL installed and running
- npm or yarn package manager

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

**Option A: Install PostgreSQL locally**

Mac (using Homebrew):
```bash
brew install postgresql@17
brew services start postgresql@17
```

Create the database:
```bash
createdb moxie
```

**Option B: Use Docker**

```bash
docker run --name moxie-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=moxie -p 5432:5432 -d postgres:17
```

**Option C: Use a hosted service**
- [Supabase](https://supabase.com/) (free tier available)
- [Neon](https://neon.tech/) (free tier available)
- [Railway](https://railway.app/)

### 3. Configure Environment Variables

Update `.env.local` with your database connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/moxie"
```

Replace `user` and `password` with your PostgreSQL credentials.

### 4. Set Up Database Schema

Push the Prisma schema to your database:

```bash
npm run db:push
```

### 5. Seed the Database

Populate the database with sample data:

```bash
npm run db:seed
```

This creates 10 sample users with sales data, accolades, and commissions.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
moxie-app/
├── app/
│   ├── api/               # API routes
│   │   └── leaderboard/   # Leaderboard data endpoint
│   ├── leaderboard/       # Leaderboard page
│   └── layout.tsx         # Root layout
├── components/
│   └── layout/            # Shared layout components
│       ├── MobileHeader.tsx
│       └── Navigation.tsx
├── lib/
│   └── prisma.ts          # Prisma client singleton
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data script
└── styles/
    └── globals.css        # Global styles
```

## Database Schema

### User
- Profile information (name, tagline, profile image)
- Team and region assignment
- Active status tracking

### Sale
- Sales records with revenue
- Install and cancel tracking
- Date-based filtering

### Commission
- Earned and paid amounts
- Withholding tracking
- Pay period management

### Accolade
- Achievement titles
- Year-based awards

### WithholdingLimit
- Per-user withholding limits
- Current amount tracking
- Limit thresholds

## Deploying to Production

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `DATABASE_URL` - Your production PostgreSQL URL
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
5. Deploy!

### Deploy Database

Use a managed PostgreSQL service:
- **Supabase:** Free tier, great for startups
- **Neon:** Serverless Postgres, generous free tier
- **Railway:** Simple deployment, includes database

## Development Roadmap

### Completed ✅
- [x] Project setup and configuration
- [x] Database schema and migrations
- [x] Leaderboard with filtering
- [x] Mobile-responsive layout
- [x] Navigation menu
- [x] Sample data seeding

### To Do 📋
- [ ] Performance/My Stats dashboard
- [ ] User profile pages
- [ ] Commission tracking screen
- [ ] Withholding management screen
- [ ] Watchlist feature
- [ ] Settings page
- [ ] User authentication
- [ ] Pull-to-refresh functionality
- [ ] PWA support (installable app)
- [ ] Real-time updates with WebSockets
- [ ] Push notifications

## Sample Data

The seed script creates 10 users with the following data:
- **Caleb Gorringe** - 12 sales (Top performer)
- **Cole Gorringe** - 10 sales, 1 cancel
- **Brock Barton** - 10 sales, 2 cancels
- **Jake Allen** - 4 sales
- **Sarah Hernandez** - 1 sale
- And 5 more team members...

Each user has:
- Sales records for today
- Commission data
- Some have accolades (awards)
- Some have withholding limits

## Troubleshooting

### Database Connection Error

If you see `Can't reach database server`, check:
1. PostgreSQL is running: `brew services list` (Mac)
2. Database exists: `psql -l`
3. `.env.local` has correct credentials

### Prisma Client Not Generated

Run:
```bash
npx prisma generate
```

### Port 3000 Already in Use

Change the port:
```bash
PORT=3001 npm run dev
```

## Contributing

This is a project template. Feel free to:
- Add new features
- Improve the UI
- Optimize performance
- Add tests

## License

MIT

## Future Enhancements

Features and improvements planned for future releases:

### Pay Period Updates
- [ ] **Bi-Weekly Pay Periods** - Update pay period calculations from monthly to every two weeks
  - Currently: Pay periods align with calendar months (1st to end of month)
  - Planned: Bi-weekly pay periods (every 2 weeks)
  - Files to update:
    - `/app/api/commission/route.ts` - Date range calculations
    - `/app/api/withholding/route.ts` - Date range calculations
    - `/app/commission/page.tsx` - Filter labels
    - `/app/withholding/page.tsx` - Filter labels
  - Additional considerations:
    - Define pay period start date (e.g., company fiscal start)
    - Handle edge cases for year transitions
    - Update database schema if needed to store pay period metadata

### Commission Rate Improvements
- [ ] **Variable Commission Rates** - Support different commission rates per product and sales rep
  - Currently: Fixed 50% commission rate, 20% withholding
  - Planned: Product-based and rep-based commission structures
  - Database changes needed:
    - Add `Product` table with commission rate field
    - Link sales to products
    - Add commission rate override field to User model

## Questions?

For issues or questions, please create an issue in the repository.

---

Built with ❤️ using Next.js and Prisma
