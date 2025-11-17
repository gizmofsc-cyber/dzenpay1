@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправлений
echo ========================================
echo.

echo Добавление всех изменений...
git add .
echo.

echo Создание коммита...
git commit -m "Add migration fix endpoints and auto-fix in init-database"
echo.

echo Отправка на GitHub...
git push origin main
echo.

echo ========================================
echo Готово!
echo ========================================
echo.
echo После деплоя:
echo 1. Вызовите: https://dzenpay.vercel.app/api/fix-migrations
echo    для исправления состояния миграций
echo 2. Затем вызовите: https://dzenpay.vercel.app/api/init-database
echo    для инициализации базы данных
echo ========================================
pause

