@echo off
chcp 65001 >nul
echo ========================================
echo Исправление: только сети из активных пар
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Show only networks used in active network pairs in wallet dropdown

- Updated API to return only networks that are used in active network pairs when activeOnly=true
- This ensures only real networks (SOL, BEP20, TRC20) are shown, not old test networks
- Added filtering by active network pairs to prevent showing deleted/test networks
- Fixed issue where old test networks appeared in wallet creation dropdown"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

