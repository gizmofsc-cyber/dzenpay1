@echo off
chcp 65001 >nul
echo ========================================
echo Отправка всех исправлений
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Network pairs refresh, remove select button, support chat, replenish amount

- Added periodic refresh for network pairs in Dashboard (every 10 seconds)
- Removed 'Выбрать' button from network pairs display
- Removed 'Финансы' from menu, added 'Чат с поддержкой'
- Updated support page to work as chat with API integration
- Added support tickets API for users and admin
- Added 'Обращения пользователей' block in admin panel
- Added modal for entering replenishment amount when clicking 'Пополнил'
- Replenishment amount now displayed in admin notification
- Fixed network selection in admin to show only active networks from DB"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

