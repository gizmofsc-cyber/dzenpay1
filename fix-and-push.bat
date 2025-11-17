@echo off
chcp 65001 >nul
echo ========================================
echo Исправление и отправка миграции
echo ========================================
echo.

echo Шаг 1: Добавление файла миграции...
git add prisma/migrations/20251006093314_init/migration.sql
echo.

echo Шаг 2: Создание коммита...
git commit -m "Fix: Replace DATETIME with TIMESTAMP for PostgreSQL compatibility"
echo.

echo Шаг 3: Отправка на GitHub...
git push origin main
echo.

echo ========================================
echo Готово! Исправление отправлено.
echo ========================================
echo.
echo После деплоя на Vercel:
echo 1. Миграция должна пройти успешно
echo 2. Вызовите: https://dzenpay.vercel.app/api/init-database
echo    для инициализации базы данных
echo ========================================
pause
