@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправления миграции
echo ========================================
echo.

echo Добавление изменений...
git add prisma/migrations/20251006093314_init/migration.sql
echo.

echo Создание коммита...
git commit -m "Fix: Replace DATETIME with TIMESTAMP for PostgreSQL compatibility"
echo.

echo Отправка на GitHub...
git push origin main
echo.

echo ========================================
echo Готово! Исправление отправлено.
echo ========================================
echo.
echo После деплоя миграция должна пройти успешно.
pause

