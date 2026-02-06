#!/bin/bash
# ─── MedBook VPS Deploy Script ──────────────────────
# Ishlatish: chmod +x deploy.sh && ./deploy.sh
set -e

echo "🚀 MedBook Deploy boshlandi..."

# 1. Pull latest
echo "📥 Git pull..."
git pull origin main

# 2. Build & start
echo "🐳 Docker build & up..."
docker compose down
docker compose build --no-cache
docker compose up -d

# 3. Wait for DB
echo "⏳ DB ready kutilmoqda..."
sleep 5

# 4. Migrate
echo "📦 Prisma migrate..."
docker compose exec api npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma

echo ""
echo "✅ Deploy muvaffaqiyatli yakunlandi!"
echo "🌐 https://mydent.uz"
echo ""
docker compose ps
