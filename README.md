# 🏥 MedBook — Medical Appointment Booking System

Tibbiy navbat olish tizimi. NestJS (API) + Next.js (Web) + Telegram Bot + PostgreSQL + Redis.

**Domain:** [https://mydent.uz](https://mydent.uz)  
**Telegram Bot:** [@bookmed_uzbot](https://t.me/bookmed_uzbot)

---

## 📁 Loyiha tuzilishi

```
medbook/
├── apps/
│   ├── api/          # NestJS backend (port 4000)
│   │   ├── prisma/   # Schema + Migrations
│   │   ├── src/
│   │   │   ├── admin/         # Founder + Clinic Owner panel
│   │   │   ├── appointments/  # Navbat CRUD
│   │   │   ├── bot/           # Telegram bot (Telegraf)
│   │   │   ├── clinics/       # Klinikalar
│   │   │   ├── common/        # Prisma + Redis services
│   │   │   ├── doctor-panel/  # Shifokor paneli
│   │   │   ├── doctors/       # Shifokorlar
│   │   │   ├── health/        # Health check
│   │   │   └── users/         # Foydalanuvchilar
│   │   └── Dockerfile
│   └── web/          # Next.js frontend (port 3000)
│       ├── app/
│       │   ├── admin/   # Admin panel
│       │   ├── doctor/  # Doctor panel
│       │   └── user/    # User panel
│       ├── lib/         # API client + Zustand store
│       └── Dockerfile
├── nginx/             # Nginx config
├── docker-compose.yml
├── deploy.sh
└── package.json
```

---

## 🛠 Local ishga tushirish

### Talablar
- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### Qadamlar

```bash
# 1. Clone
git clone https://github.com/Bekmuhammad-Devoloper/mydent.uz.git
cd mydent.uz

# 2. Dependencies
npm install

# 3. API .env
cp apps/api/.env.example apps/api/.env
# .env ni tahrirlang (DATABASE_URL, BOT_TOKEN)

# 4. Database
cd apps/api
npx prisma migrate dev
cd ../..

# 5. Dev server
npm run dev:api   # Terminal 1
npm run dev:web   # Terminal 2
```

API: http://localhost:4000/api/docs  
Web: http://localhost:3000

---

## 🐳 Docker bilan ishga tushirish

```bash
# .env tayyorlang
cp apps/api/.env.example apps/api/.env
# .env ni tahrirlang

# Ishga tushirish
docker compose up -d --build

# Loglar
docker compose logs -f
```

---

## 🚀 VPS ga Deploy (Ubuntu)

### 1. Server tayyorlash

```bash
# Update
sudo apt update && sudo apt upgrade -y

# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Nginx
sudo apt install -y nginx certbot python3-certbot-nginx

# Git
sudo apt install -y git
```

### 2. Loyihani clone qilish

```bash
cd /opt
sudo git clone https://github.com/Bekmuhammad-Devoloper/mydent.uz.git medbook
cd medbook
sudo chown -R $USER:$USER .
```

### 3. Environment sozlash

```bash
cp apps/api/.env.example apps/api/.env
nano apps/api/.env
```

`.env` ni to'ldiring:
```env
DATABASE_URL="postgresql://postgres:KUCHLI_PAROL@db:5432/medbook?schema=public"
REDIS_HOST="redis"
REDIS_PORT=6379
PORT=4000
CORS_ORIGIN="https://mydent.uz"
BOT_TOKEN="YOUR_BOT_TOKEN"
WEB_APP_URL="https://mydent.uz"
```

`docker-compose.yml` da `DB_PASSWORD` ni o'rnating:
```bash
export DB_PASSWORD=KUCHLI_PAROL
```

### 4. Docker ishga tushirish

```bash
docker compose up -d --build
```

### 5. Nginx sozlash

```bash
sudo cp nginx/mydent.uz.conf /etc/nginx/sites-available/mydent.uz
sudo ln -s /etc/nginx/sites-available/mydent.uz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d mydent.uz -d www.mydent.uz
```

### 7. Yangilash (keyingi deploy)

```bash
cd /opt/medbook
chmod +x deploy.sh
./deploy.sh
```

---

## 📋 API Endpoints

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/regions` | Hududlar |
| GET | `/api/admin/clinics` | Klinikalar |
| GET | `/api/admin/doctors` | Shifokorlar |
| POST | `/api/users/register` | Foydalanuvchi ro'yxat |
| POST | `/api/users/login` | Foydalanuvchi login |
| GET | `/api/clinics/by-region/:id` | Hudud bo'yicha klinikalar |
| GET | `/api/doctors/by-clinic-specialty` | Shifokorlar |
| POST | `/api/appointments` | Navbat olish |
| GET | `/api/doctor-panel/...` | Doctor panel |

Swagger docs: `/api/docs`

---

## 🤖 Telegram Bot

Bot: [@bookmed_uzbot](https://t.me/bookmed_uzbot)

**Komandalar:**
- `/start` — Tilni tanlash, ro'yxatdan o'tish
- Navbat olish: Hudud → Klinika → Mutaxassislik → Shifokor → Sana → Vaqt → Tasdiqlash
- Navbatlarim — Barcha navbatlarni ko'rish
- Tashxislarim — Tashxislarni ko'rish

---

## 📝 License

MIT
