@echo off
chcp 65001 >nul
echo ========================================
echo Отправка проекта на GitHub
echo ========================================
echo.

if not exist .git (
    echo Инициализация git репозитория...
    git init
    echo.
)

echo Удаление старого remote (если есть)...
git remote remove origin 2>nul

echo Добавление нового remote репозитория...
git remote add origin https://github.com/gizmofsc-cyber/dzenpay1.git
echo.

echo Добавление всех файлов...
git add .
echo.

echo Создание коммита...
git commit -m "Initial commit: Updated admin credentials"
echo.

echo Установка основной ветки...
git branch -M main
echo.

echo Отправка на GitHub...
git push -u origin main --force
echo.

echo ========================================
echo Готово! Проверьте репозиторий:
echo https://github.com/gizmofsc-cyber/dzenpay1
echo ========================================
pause

