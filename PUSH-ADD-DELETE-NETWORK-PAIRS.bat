@echo off
chcp 65001 >nul
echo ========================================
echo Добавление удаления сетевых пар
echo ========================================
echo.
git add .
echo.
git commit -m "Feature: Add delete functionality for network pairs in admin panel

- Added delete button for each network pair in admin panel
- Added handleDeleteNetworkPair function with confirmation dialog
- Added Trash2 icon import from lucide-react
- DELETE endpoint already exists in API route
- Users can now delete network pairs from the admin panel"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

