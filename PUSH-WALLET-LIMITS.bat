@echo off
chcp 65001 >nul
echo ========================================
echo Отправка изменений с лимитами кошельков
echo ========================================
echo.
git add .
echo.
git commit -m "Add minAmount and maxAmount fields to Wallet model

- Added minAmount and maxAmount fields to Wallet schema
- Created migration to add minAmount and maxAmount columns
- Extract limits from wallet request description when creating wallet
- Display min/max amounts in wallet card for RECEIVE type wallets
- Updated API to parse and save limits from description"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo Vercel автоматически задеплоит изменения
echo ========================================
pause

