@echo off
chcp 65001 >nul
echo ========================================
echo Исправление установки зависимостей
echo ========================================
echo.

echo Очистка кеша npm...
call npm cache clean --force
echo.

echo Настройка npm для обхода SSL проблем...
call npm config set strict-ssl false
echo.

echo Установка зависимостей...
call npm install --legacy-peer-deps
echo.

echo Генерация Prisma Client...
call npx prisma generate
echo.

echo ========================================
echo Готово!
echo ========================================
pause

