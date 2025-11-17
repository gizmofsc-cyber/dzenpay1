@echo off
chcp 65001 >nul
echo ========================================
echo Исправление remote и отправка проекта
echo ========================================
echo.

echo Удаление старого remote...
git remote remove origin
echo.

echo Добавление нового remote для dzenpay1...
git remote add origin https://github.com/gizmofsc-cyber/dzenpay1.git
echo.

echo Проверка remote...
git remote -v
echo.

echo Добавление всех изменений...
git add .
echo.

echo Создание коммита...
git commit -m "Update: Changed admin credentials to admin10@gmail.com and removed old repository references"
echo.

echo Отправка на GitHub (dzenpay1)...
git push -u origin main --force
echo.

echo ========================================
echo Готово! Проект отправлен в:
echo https://github.com/gizmofsc-cyber/dzenpay1
echo ========================================
pause

