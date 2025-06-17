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

# Установите зависимости (автоматически создаст .env файлы)
npm install

# Настройте базу данных и запустите
npm run setup
npm run prisma:push
npm run dev
```

### Готово! 🎉

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

> 💡 **Автоматическая настройка**: .env файлы создаются автоматически из .env.example

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
npm install              # Установить зависимости + создать .env файлы
npm run setup            # Полная настройка проекта
npm run create-env       # Создать .env файлы вручную (если нужно)

# Установка компонентов
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

.env файлы создаются автоматически при `npm install`.

**Настройте только базу данных в `backend/.env`:**

### Вариант 1: SQLite (самый простой)
```env
DATABASE_URL="file:./dev.db"
```

### Вариант 2: PostgreSQL (рекомендуется)
```env
DATABASE_URL="postgresql://authuser:authpass123@localhost:5433/authapp?schema=public"
```

### Вариант 3: Docker PostgreSQL (один клик)
```bash
# Запустите PostgreSQL в Docker
docker run --name postgres-auth \
  -e POSTGRES_PASSWORD=authpass123 \
  -e POSTGRES_USER=authuser \
  -e POSTGRES_DB=authapp \
  -p 5433:5432 -d postgres:15

# Используйте в backend/.env:
DATABASE_URL="postgresql://authuser:authpass123@localhost:5433/authapp?schema=public"
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