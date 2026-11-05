# Проблемна група DataLab

Вебзастосунок для ведення діяльності університетської проблемної групи **«Сучасні технології проєктування баз даних»**.

Сайт показує склад групи, план і графік роботи, протоколи засідань (хто виступав, що обговорювали, яких результатів досягли), новини технологій БД, навчальні матеріали та форму реєстрації нових учасників. Адміністратор керує всім контентом через захищену панель.

## Технології

- **Frontend:** React 19, TypeScript, Vite, React Router
- **Backend:** Node.js, Express, TypeScript
- **ORM:** Prisma
- **База даних:** PostgreSQL 16
- **Авторизація:** JWT, паролі хешуються bcrypt

## Структура проєкту

```
backend/          REST API, Prisma, завантаження файлів
  prisma/        схема БД, міграції, seed
  src/routes/    REST-ендпоінти
frontend/        публічний сайт і адмін-панель
docker-compose.yml   PostgreSQL
```

## Вимоги

- Node.js 20+
- Docker Desktop (для PostgreSQL) або власний PostgreSQL 16
- npm

## Запуск

### 1. База даних

```bash
docker compose up -d
```

Створюється PostgreSQL на `localhost:5433` (щоб не конфліктувати з іншими локальними інстансами), база `problem_group`, користувач/пароль `postgres` / `postgres`.

### 2. Змінні середовища

Файл `backend/.env` уже підготовлений для локальної розробки. Шаблон:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/problem_group?schema=public"
JWT_SECRET="change-this-secret-in-production"
PORT=4000
CLIENT_URL="http://localhost:5173"
UPLOAD_DIR="uploads"
```

### 3. Backend: залежності, міграції, seed

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

API: http://localhost:4000

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Сайт: http://localhost:5173  
Запити `/api` і `/uploads` проксуються на backend.

## Тестовий адміністратор

- **Логін:** `admin`
- **Пароль:** `Admin123!`

Пароль у базі зберігається лише як bcrypt-хеш.

## Демо-дані

Seed створює реалістичний контент українською:

- 13 учасників
- план і графік роботи
- 7 засідань із виступами
- результати (проєкти, дослідження, конференція, конкурс)
- новини за категоріями PostgreSQL, MongoDB, Cloud, AI тощо
- навчальні матеріали
- кілька заявок на вступ

## Основні API

Публічні: `GET /api/settings`, `/api/stats`, `/api/participants`, `/api/meetings`, `/api/news`, `/api/results`, `/api/materials`, `/api/work-plan`, `/api/schedule`, `POST /api/registrations`, `POST /api/auth/login`.

Адмінські CRUD (JWT `Authorization: Bearer <token>`): учасники, заявки, засідання, виступи у складі засідання, план, графік, результати, новини, матеріали, налаштування групи.

Схвалення заявки: `POST /api/registrations/:id/approve` — змінює статус на «Схвалена» і додає особу до учасників.
