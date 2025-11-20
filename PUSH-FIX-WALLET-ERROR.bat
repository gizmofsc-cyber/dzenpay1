@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправления ошибки кошельков
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Wallet creation error handling for new fields

- Added error handling for minAmount/maxAmount fields
- Wallet creation works even if migration not applied yet
- Added fallback to create wallet without new fields if DB doesn't support them
- Fixed wallet display to handle missing minAmount/maxAmount fields"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

