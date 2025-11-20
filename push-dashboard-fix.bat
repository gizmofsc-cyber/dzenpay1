@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправлений на GitHub
echo ========================================
echo.

echo Добавление всех файлов...
git add .
echo.

echo Создание коммита...
git commit -m "Fix: Network pairs display on dashboard and admin panel

- Fixed network pairs list auto-refresh after creation in admin panel
- Added fetchNetworkPairs function for automatic refresh
- Fixed wallet request validation: address not required for RECEIVE type
- Added empty state handling for network pairs on dashboard
- Improved error handling and logging for network pairs loading
- Fixed key prop in network pairs map (using pair.id instead of index)"
echo.

echo Отправка на GitHub...
git push origin main
echo.

echo ========================================
echo Готово! Изменения отправлены.
echo ========================================
pause

