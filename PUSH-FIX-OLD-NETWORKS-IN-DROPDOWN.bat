@echo off
chcp 65001 >nul
echo ========================================
echo Исправление отображения старых сетей
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Show only active networks in wallet creation dropdown

- Added activeOnly parameter to GET /api/admin/networks endpoint
- Created separate activeNetworks state for dropdown lists
- Load only active networks when opening add wallet modal
- Update activeNetworks when networks are created, updated, or deleted
- Filter out inactive/deleted networks from wallet creation dropdowns
- Fixes issue where old/deleted networks appeared in network selection"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

