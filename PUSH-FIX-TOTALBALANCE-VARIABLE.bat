@echo off
chcp 65001 >nul
echo ========================================
echo Исправление переменной totalBalance
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Replace totalBalance with walletsBalance

- Fixed undefined variable error: totalBalance -> walletsBalance
- Updated all references to use correct variable name
- Resolves TypeScript compilation error"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

