@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправления синтаксической ошибки
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Syntax error in admin page - missing closing div tag

- Fixed missing closing div tag in wallets tab
- Resolved JSX compilation error"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

