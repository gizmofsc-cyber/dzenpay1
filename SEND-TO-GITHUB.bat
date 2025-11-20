@echo off
chcp 65001 >nul
echo ========================================
echo Отправка на GitHub
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Wallet request validation - address not required for RECEIVE type"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Vercel автоматически задеплоит изменения
echo ========================================
pause

