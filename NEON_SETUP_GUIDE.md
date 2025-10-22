# 🚀 Neon PostgreSQL Setup Guide

This guide will help you migrate your Citizen Satisfaction Meter from SQLite to Neon PostgreSQL (100% FREE).

## Step 1: Create Neon Account

1. Go to **https://neon.tech**
2. Click **Sign Up** (use GitHub, Google, or email)
3. Verify your email if required

## Step 2: Create a New Project

1. Once logged in, click **Create a Project**
2. Fill in the details:
   - **Project Name**: `citizen-satisfaction-meter` (or any name you prefer)
   - **Region**: Choose closest to Ghana (e.g., **Europe (Frankfurt)** or **US East (Ohio)**)
   - **Postgres Version**: Latest (default)
3. Click **Create Project**

## Step 3: Get Your Connection String

After creating the project:

1. You'll see a **Connection Details** page
2. Find the **Connection string** section
3. Copy the **Prisma** connection string (it looks like this):
   ```
   postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. **SAVE THIS STRING** - you'll need it in the next step!

## Step 4: Configure Environment Variables

1. In your project root, create a file named **`.env`**
2. Add this content (replace with YOUR connection string):

```env
# Database - REPLACE WITH YOUR NEON CONNECTION STRING
DATABASE_URL="postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-replace-this-with-random-string"

# Optional: Ably for real-time features (add later if needed)
# ABLY_API_KEY=""
```

3. For `NEXTAUTH_SECRET`, generate a random string (or use this command in terminal):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Step 5: Initialize Database

Run these commands in your terminal (make sure you're in the project root):

```bash
# Install dependencies (if not already done)
npm install

# Generate Prisma client for PostgreSQL
npm run db:generate

# Push schema to Neon database (creates all tables)
npm run db:push

# Seed the database with ministers data
npm run db:seed
```

## Step 6: Test the Connection

Start your development server:

```bash
npm run dev
```

Open **http://localhost:3000** and check if:
- ✅ Ministers appear on the homepage
- ✅ You can vote (Satisfied/Not Satisfied)
- ✅ No database errors in the console

## Step 7: Verify Data in Neon Dashboard

1. Go back to **https://console.neon.tech**
2. Select your project
3. Click **SQL Editor** (in the left sidebar)
4. Run this query to verify ministers were added:
   ```sql
   SELECT * FROM "Minister";
   ```
5. You should see all your ministers listed!

## Step 8: Deploy to Vercel

When you're ready to deploy:

1. Go to **https://vercel.com**
2. Import your GitHub repository
3. In **Environment Variables**, add:
   - `DATABASE_URL`: Your Neon connection string (same as above)
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET`: Same secret from your `.env` file
4. Click **Deploy**

That's it! 🎉

## Troubleshooting

### "Can't reach database server"
- Check your internet connection
- Verify the DATABASE_URL is correct (no typos)
- Make sure Neon project is active (free tier doesn't suspend projects)

### "Migration failed"
- Delete any old `prisma/dev.db` files (SQLite)
- Run `npm run db:generate` again
- Try `npm run db:push` again

### "No ministers showing"
- Run `npm run db:seed` to add sample data
- Check browser console for errors
- Verify DATABASE_URL in `.env` is correct

### Need to reset database?
In Neon dashboard:
1. Go to SQL Editor
2. Run: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
3. Run migrations again: `npm run db:push && npm run db:seed`

## Cost: $0/month 💰

- Neon Free Tier: ✅ FREE
- Vercel Free Tier: ✅ FREE
- **Total Cost: $0/month**

Neon free tier includes:
- 0.5 GB storage
- 10 compute hours/month (plenty for small apps)
- 1 active project
- PostgreSQL backups

## Next Steps

Once everything works:
- [ ] Test voting locally
- [ ] Test admin panel
- [ ] Deploy to Vercel
- [ ] Add custom domain (optional)
- [ ] Set up monitoring (Neon has built-in metrics)

---

**Need Help?**
- Neon Docs: https://neon.tech/docs/introduction
- Prisma Docs: https://www.prisma.io/docs


