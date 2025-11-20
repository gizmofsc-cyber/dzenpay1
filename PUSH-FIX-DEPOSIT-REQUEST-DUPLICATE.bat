@echo off
chcp 65001 >nul
echo ========================================
echo Исправление дублирования переменных
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Remove duplicate variable declarations in deposit-requests API

- Fixed duplicate variable declarations (amount, fromNetwork, toNetwork, adminWallet)
- Read request.json() only once at the beginning
- Properly handle both 'paid' action and new deposit request creation
- Resolves build error: 'the name is defined multiple times'"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

