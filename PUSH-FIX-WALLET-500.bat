@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправления ошибки 500
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Wallet creation 500 error and missing wallets

- Fixed wallet creation error handling for new fields
- Added fallback to extract limits from WalletRequest description
- Improved error handling in wallet creation API
- Fixed wallet loading to extract minAmount/maxAmount from requests
- Wallets now display correctly even if migration not applied"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

