@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправления обновления связок
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Network pairs not refreshing in Dashboard

- Added no-cache headers to network-pairs API
- Added force-dynamic export to prevent caching
- Reduced refresh interval from 10s to 5s
- Added focus event listener to refresh on window focus
- Added cache: 'no-store' to fetch requests
- Network pairs now update immediately when admin creates new ones"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

