@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправлений баланса и сетей
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Balance display and network selection in admin

- Changed 'Средний баланс' to 'Общий баланс' showing total balance + insurance
- Fixed available balance display for withdrawal wallets (total - insurance)
- Fixed network selection in admin panel to show only active networks from DB
- Networks now loaded from database instead of hardcoded values
- Added fallback to default networks if no networks in DB"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

