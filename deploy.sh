#!/bin/bash
# ─── MedBook VPS Deploy Script (PM2) ────────────────
# Ishlatish: chmod +x deploy.sh && ./deploy.sh
set -e

echo "🚀 MedBook Deploy boshlandi..."

# 1. Pull latest
echo "📥 Git pull..."
git pull origin main

# 2. Install dependencies
echo "📦 Dependencies..."
npm install

# 3. Prisma generate + migrate
echo "�️ Prisma migrate..."
cd apps/api
npx prisma generate
npx prisma migrate deploy
cd ../..

# 4. Build API
echo "🔨 Building API..."
npm run build:api

# 5. Build Web
echo "🔨 Building Web..."
npm run build:web

# 6. Create logs dir
mkdir -p logs

# 7. PM2 restart
echo "� PM2 restart..."
pm2 restart ecosystem.config.js --update-env 2>/dev/null || pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ Deploy muvaffaqiyatli yakunlandi!"
echo "🌐 https://mydent.uz"
echo ""
pm2 list
