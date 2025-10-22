# Quick Deployment Guide (TL;DR)

Fast track deployment in 15 minutes!

## 🚀 Step-by-Step

### 1. Neon (Database) - 5 minutes ✅ FREE

1. Go to https://neon.tech → "Sign Up" (use GitHub/Google)
2. "Create a Project" → Name it → Choose region closest to you
3. Copy the **Prisma connection string** from Connection Details
4. Save it somewhere safe!

> **Alternative:** Railway.app also works but has limited free tier

### 2. Update Code - 5 minutes

```bash
# Create .env file (use your Neon connection string)
# DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require"
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="<generate with: node -e 'console.log(require(\"crypto\").randomBytes(32).toString(\"hex\"))'>"

# Generate Prisma client
npm run db:generate

# Push schema to Neon database
npm run db:push

# Seed with ministers data
npm run db:seed

# Test locally
npm run dev
```

> **Note:** Schema is already configured for PostgreSQL!

### 3. Vercel (Frontend) - 5 minutes

1. Go to https://vercel.com → "Add New Project"
2. Import your GitHub repo
3. Add Environment Variables:
   - `DATABASE_URL` = Your Neon connection string
   - `NEXTAUTH_SECRET` = (from your .env file)
   - `NEXTAUTH_URL` = `https://your-app.vercel.app` (update after first deploy)
4. Click "Deploy"
5. Wait 3 minutes ⏳

### 4. Update & Redeploy

After first deployment:
1. Copy your Vercel URL (e.g., `citizen-satisfaction-meter.vercel.app`)
2. Go to Vercel → Settings → Environment Variables
3. Update `NEXTAUTH_URL` to your actual Vercel URL
4. Click "Redeploy" from Deployments tab

## ✅ Done!

Your app is live at: `https://your-app.vercel.app`

---

## 🔧 Common Issues

**Build fails?**
- Check `postinstall` script exists in package.json
- Verify DATABASE_URL is correct

**Can't connect to database?**
- Ensure Neon project is active
- Verify DATABASE_URL has `?sslmode=require` at the end
- Check your internet connection

**NEXTAUTH errors?**
- Make sure NEXTAUTH_URL matches your domain
- Generate new NEXTAUTH_SECRET

---

## 📊 After Deployment

- [ ] Test voting functionality
- [ ] Check minister pages load
- [ ] Verify database updates
- [ ] Add social media images
- [ ] Set up custom domain (optional)

Need detailed instructions? See `DEPLOYMENT.md`

