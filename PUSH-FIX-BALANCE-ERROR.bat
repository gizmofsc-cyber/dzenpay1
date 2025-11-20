@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправления ошибки баланса
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Remove user balance update - balance is stored in wallets

- Removed incorrect user.balance update in receive-requests API
- Balance is stored in Wallet model, not User model
- Fixed TypeScript compilation error"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

