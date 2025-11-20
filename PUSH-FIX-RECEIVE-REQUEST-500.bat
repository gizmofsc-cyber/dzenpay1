@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправления ошибки 500 при создании запроса
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: 500 error when creating receive request

- Improved error handling in receive-requests API
- Added fallback for wallets without minAmount/maxAmount fields
- Better error logging with details
- Handle case when amount field might not exist in DB
- Added retry logic for request creation"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

