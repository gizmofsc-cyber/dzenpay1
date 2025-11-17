@echo off
chcp 65001 >nul
echo ========================================
echo Установка зависимостей
echo ========================================
echo.

echo Шаг 1: Настройка npm...
call npm config set strict-ssl false
call npm config set registry https://registry.npmjs.org/
echo.

echo Шаг 2: Очистка кеша...
call npm cache clean --force
echo.

echo Шаг 3: Установка зависимостей (это может занять время)...
call npm install --legacy-peer-deps --no-optional
echo.

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Ошибка при установке. Пробуем альтернативный метод...
    call npm install --legacy-peer-deps --ignore-scripts
    call npm rebuild
)

echo.
echo Шаг 4: Генерация Prisma Client...
call npm config set strict-ssl false
call npx prisma generate
call npm config set strict-ssl true
echo.

echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo Установка завершена успешно!
) else (
    echo Были ошибки, но попробуйте продолжить
)
echo ========================================
pause

