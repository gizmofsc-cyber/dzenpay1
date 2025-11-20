@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправлений уведомлений
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Deposit notifications and balance calculation

- Fixed duplicate notifications for receive requests (only show once)
- Added 'Внес' button for insurance deposit requests
- Added notification system for insurance deposits in admin panel
- Fixed total balance calculation (insurance balance was counted twice)
- Added description and links to insurance deposit requests section
- Insurance balance now correctly calculated (not duplicated)
- Added periodic check for new insurance deposit notifications"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

