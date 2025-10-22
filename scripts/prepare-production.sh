#!/bin/bash

# Prepare Production Deployment Script
# This script prepares your app for production deployment

echo "🚀 Preparing for production deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Creating .env from env.example..."
    cp env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your actual values${NC}"
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "postgresql://" .env; then
    echo -e "${RED}❌ DATABASE_URL not configured properly${NC}"
    echo "Please update DATABASE_URL in .env file with your Railway PostgreSQL URL"
    exit 1
fi

# Check if NEXTAUTH_SECRET is set
if grep -q "generate-a-secure-random-string-here" .env; then
    echo -e "${YELLOW}⚠️  Generating NEXTAUTH_SECRET...${NC}"
    SECRET=$(openssl rand -base64 32)
    sed -i.bak "s|generate-a-secure-random-string-here|$SECRET|g" .env
    echo -e "${GREEN}✅ NEXTAUTH_SECRET generated${NC}"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔄 Updating Prisma schema for PostgreSQL..."
if [ -f prisma/schema-production.prisma ]; then
    cp prisma/schema.prisma prisma/schema-sqlite-backup.prisma 2>/dev/null
    cp prisma/schema-production.prisma prisma/schema.prisma
    echo -e "${GREEN}✅ Schema updated${NC}"
else
    echo -e "${YELLOW}⚠️  schema-production.prisma not found, skipping...${NC}"
fi

echo ""
echo "🔨 Generating Prisma Client..."
npx prisma generate

echo ""
echo "📊 Pushing schema to database..."
npx prisma db push --skip-generate

echo ""
echo "🌱 Seeding database..."
npm run db:seed

echo ""
echo "✨ Testing database connection..."
npx prisma db execute --stdin <<< "SELECT 1;" && echo -e "${GREEN}✅ Database connection successful${NC}" || echo -e "${RED}❌ Database connection failed${NC}"

echo ""
echo "🏗️  Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Commit and push your changes:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for production'"
    echo "   git push origin main"
    echo ""
    echo "2. Deploy to Vercel:"
    echo "   - Go to https://vercel.com"
    echo "   - Import your GitHub repository"
    echo "   - Add environment variables from .env file"
    echo "   - Deploy!"
    echo ""
    echo "See DEPLOYMENT.md for detailed instructions"
else
    echo ""
    echo -e "${RED}❌ Build failed!${NC}"
    echo "Please fix errors and try again"
    exit 1
fi

