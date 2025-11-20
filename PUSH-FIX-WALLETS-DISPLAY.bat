@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправления отображения кошельков
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Wallets not displaying on user page

- Improved error handling in wallet loading API
- Added Promise.allSettled for robust wallet processing
- Added empty state message when no wallets
- Better error messages for users
- Fixed wallet data extraction from WalletRequest"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

