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
git commit -m "Fix: Network pairs auto-refresh and wallet request validation

- Fixed network pairs list not updating after creation in admin panel
- Added fetchNetworkPairs function for automatic refresh
- Fixed wallet request validation: address not required for RECEIVE type
- Admin now assigns wallet address for deposit requests"
echo.

echo Отправка на GitHub...
git push origin main
echo.

echo ========================================
echo Готово! Изменения отправлены.
echo ========================================
pause

