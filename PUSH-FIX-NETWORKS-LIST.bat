@echo off
chcp 65001 >nul
echo ========================================
echo Исправление списка сетей в админке
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Filter only active networks in admin wallet creation

- Modified GET /api/admin/networks to return only active networks (isActive: true)
- Added network list refresh when opening add wallet modal
- Prevents deleted/inactive networks from appearing in network selection dropdown
- Ensures only current active networks are available when adding wallet to user"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

