@echo off
chcp 65001 >nul
echo ========================================
echo Отправка исправлений для Vercel
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: Vercel build timeout - safe migration handling

- Added safe migration script that doesn't fail build on timeout
- Migrations can be applied after deploy via API endpoint
- Build will continue even if migrations timeout"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Vercel автоматически задеплоит изменения
echo ========================================
pause

