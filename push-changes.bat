@echo off
chcp 65001 >nul
echo ========================================
echo Отправка изменений на GitHub
echo ========================================
echo.

echo Добавление всех файлов...
git add .
echo.

echo Создание коммита...
git commit -m "Add auto-migration and database init endpoint for Vercel"
echo.

echo Отправка на GitHub...
git push origin main
echo.

echo ========================================
echo Готово! Изменения отправлены.
echo ========================================
echo.
echo После деплоя на Vercel:
echo 1. Миграции применятся автоматически
echo 2. Вызовите: https://your-domain.vercel.app/api/init-database
echo    для инициализации базы данных
echo ========================================
pause

