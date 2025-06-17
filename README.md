# 🔐 Auth App

Полноценное приложение аутентификации с React frontend и Express backend.

## 🚀 Быстрый запуск

### Требования
- [Bun](https://bun.sh/) >= 1.0.0
- [Node.js](https://nodejs.org/) >= 18.0.0

### Установка и запуск

```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd auth-app

# Установите concurrently для одновременного запуска frontend и backend
bun add -D concurrently

# Настройте переменные окружения
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Отредактируйте .env файлы под ваше окружение

# Установите зависимости для обеих частей проекта
npm run setup

# Настройте базу данных
npm run prisma:push

# Запустите проект (frontend + backend одновременно)
npm run dev
```

### Готово! 🎉

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 📁 Структура

```
auth-app/
├── backend/          # Express + TypeScript + Prisma
├── frontend/         # React + TypeScript + Tailwind
└── package.json      # Скрипты для управления проектом
```

## 🛠️ Команды

```bash
# Разработка
npm run dev              # Запустить frontend + backend
npm run backend          # Запустить только backend
npm run frontend         # Запустить только frontend

# Первичная настройка
cp backend/.env.example backend/.env    # Создать конфиг backend
cp frontend/.env.example frontend/.env  # Создать конфиг frontend

# Установка
npm run setup            # Установить все зависимости
npm run install:backend  # Установить зависимости backend
npm run install:frontend # Установить зависимости frontend

# База данных
npm run prisma:generate  # Сгенерировать Prisma клиент
npm run prisma:push      # Обновить схему БД
npm run prisma:studio    # Открыть Prisma Studio

# Сборка
npm run build            # Собрать проект для production
npm run clean            # Очистить node_modules
```

## 🧪 Тестирование

1. Откройте http://localhost:5173
2. Нажмите "create a new account"
3. Зарегистрируйтесь: `test@example.com` / `Test123!@#`
4. Должен открыться Dashboard с информацией о пользователе

## ⚙️ Настройка

Скопируйте файлы `.env.example` и настройте под свое окружение:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend  
cp frontend/.env.example frontend/.env
```

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://authuser:authpass123@localhost:5433/authapp?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
JWT_EXPIRES_IN="24h"

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN="http://localhost:5173"
```

### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Auth App
VITE_APP_VERSION=1.0.0

# Auth Configuration
VITE_TOKEN_KEY=auth_token
VITE_AUTO_LOGOUT_ON_401=true

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=info
```

## 🔧 Решение проблем

**Порты заняты:**
```bash
lsof -ti :5000 | xargs kill -9
lsof -ti :5173 | xargs kill -9
```

**CORS ошибки:**
- Проверьте `CORS_ORIGIN="http://localhost:5173"` в `backend/.env`

**Проблемы с базой данных:**
- Убедитесь что PostgreSQL запущен на порту 5433
- Проверьте правильность `DATABASE_URL` в `backend/.env`

**Проблемы с зависимостями:**
```bash
npm run clean
npm run setup
```

**Сброс базы данных:**
```bash
npm run prisma:push
```

## 🚀 Стек технологий

- **Backend**: Bun + TypeScript + Express + Prisma + PostgreSQL
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui