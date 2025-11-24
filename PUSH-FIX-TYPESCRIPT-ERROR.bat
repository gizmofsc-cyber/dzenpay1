@echo off
chcp 65001 >nul
echo ========================================
echo Исправление ошибки TypeScript
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Add explicit type annotation for filter parameter

- Fixed TypeScript error: Parameter 'n' implicitly has an 'any' type
- Added explicit Network type annotation in filter function
- Fixes build error on Vercel deployment"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

