@echo off
chcp 65001 >nul
echo ========================================
echo Исправление доступного баланса
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Available balance calculation and display

- Fixed available balance calculation: now only includes RECEIVE wallets (replenishment), excludes insurance deposit
- Replaced 'Общий баланс' (Total Balance) with 'Доступный баланс' (Available Balance)
- Available balance now correctly shows only funds available for withdrawal
- Excludes DEPOSIT (insurance) and WITHDRAWAL wallets from available balance
- Fixed incorrect balance calculation that was adding insurance to available funds"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

