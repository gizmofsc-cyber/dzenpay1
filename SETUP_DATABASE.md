# 🔧 Настройка базы данных

## ✅ База данных подключена

Новая база данных PostgreSQL на Neon успешно настроена.

## 📝 Создание файла .env.local

Создайте файл `.env.local` в корне проекта со следующим содержимым:

```env
# База данных PostgreSQL (Neon)
# Recommended for most uses
DATABASE_URL=postgresql://neondb_owner:npg_wNSRFKit2J4W@ep-tiny-fire-adh53cx9-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_wNSRFKit2J4W@ep-tiny-fire-adh53cx9.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# Parameters for constructing your own connection string
PGHOST=ep-tiny-fire-adh53cx9-pooler.c-2.us-east-1.aws.neon.tech
PGHOST_UNPOOLED=ep-tiny-fire-adh53cx9.c-2.us-east-1.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=npg_wNSRFKit2J4W

# Parameters for Vercel Postgres Templates
POSTGRES_URL=postgresql://neondb_owner:npg_wNSRFKit2J4W@ep-tiny-fire-adh53cx9-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_wNSRFKit2J4W@ep-tiny-fire-adh53cx9.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-tiny-fire-adh53cx9-pooler.c-2.us-east-1.aws.neon.tech
POSTGRES_PASSWORD=npg_wNSRFKit2J4W
POSTGRES_DATABASE=neondb
POSTGRES_URL_NO_SSL=postgresql://neondb_owner:npg_wNSRFKit2J4W@ep-tiny-fire-adh53cx9-pooler.c-2.us-east-1.aws.neon.tech/neondb
POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_wNSRFKit2J4W@ep-tiny-fire-adh53cx9-pooler.c-2.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Другие настройки
NODE_ENV=development

# Neon Auth environment variables for Next.js
NEXT_PUBLIC_STACK_PROJECT_ID=88342d18-f8ac-4980-bba8-27775649dc5c
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_vdnxkxyddmnscpt3wwd5zkcvgt5tqbbcjv3qn0x49smeg
STACK_SECRET_SERVER_KEY=ssk_9qvkrzmkm509tvzfrm4vxpw7mppqr4982fa8zh76kbqx0
```

## 🚀 Инициализация базы данных

После создания `.env.local` выполните:

```bash
# 1. Применить миграции
npx prisma migrate deploy

# 2. Или для разработки
npx prisma migrate dev

# 3. Инициализировать данные (создать админа и сети)
npm run init-db

# 4. Инициализировать сетевые пары
npm run init-network-pairs
```

## ✅ Проверка подключения

Проверьте подключение к базе данных:

```bash
npx prisma studio
```

Или через API:
```bash
curl http://localhost:3000/api/health-check
```

## 📋 Данные администратора

После инициализации:

- **Email:** `admin10@gmail.com`
- **Пароль:** `datmuf-Bajjyk-6wupde`
- **Роль:** `ADMIN`

## ⚠️ Важно

- Файл `.env.local` уже в `.gitignore` и не будет закоммичен
- Не делитесь паролями и ключами доступа
- Для продакшена используйте переменные окружения в Vercel Dashboard

