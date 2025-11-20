@echo off
chcp 65001 >nul
echo ========================================
echo Исправление списания при выводе
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Withdrawal balance deduction and notifications

- Fixed withdrawal balance deduction: now deducts from RECEIVE wallets, not from insurance deposit
- Changed deduction logic: type 'WITHDRAWAL' -> type 'RECEIVE' (correct source of funds)
- Added notification system for new withdrawal requests in admin panel
- Admin now receives real-time notifications when users create withdrawal requests
- Fixed balance calculation to exclude DEPOSIT and WITHDRAWAL wallets from deduction
- Withdrawal requests now properly deduct from replenishment wallets only"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

