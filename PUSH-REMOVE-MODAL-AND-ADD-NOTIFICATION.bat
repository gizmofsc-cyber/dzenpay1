@echo off
chcp 65001 >nul
echo ========================================
echo Отправка удаления модального окна и добавления уведомления
echo ========================================
echo.
git add .
echo.
git commit -m "Remove modal and add admin notification for replenishment

- Removed replenishment modal window
- Button 'Пополнил' now creates request immediately with maxAmount/minAmount
- Status 'На проверке' shows immediately after button click
- Added notification modal in admin panel when new replenishment request appears
- Admin sees notification: 'Пользователь пополнил кошелек - проверьте'"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

