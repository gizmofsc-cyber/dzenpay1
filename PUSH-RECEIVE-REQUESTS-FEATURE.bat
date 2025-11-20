@echo off
chcp 65001 >nul
echo ========================================
echo Отправка функционала запросов на пополнение
echo ========================================
echo.
git add .
echo.
git commit -m "Feature: Receive requests with amount and admin processing

- Added amount field to ReceiveRequest model
- Updated receive request creation to require amount from user
- Added status display 'На проверке' for active receive requests
- Added receive requests display in admin panel wallets section
- Added admin API for crediting balance from receive requests
- Added modal for user to enter replenishment amount
- Added validation for min/max amounts
- Created migration for amount field"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

