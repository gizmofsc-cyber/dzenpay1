@echo off
chcp 65001 >nul
echo ========================================
echo Отправка всех изменений на GitHub
echo ========================================
echo.
git add .
echo.
git commit -m "Add deposit button for RECEIVE wallets and fix Vercel build

- Added 'Пополнить' button for RECEIVE type wallets
- Added instruction text below deposit button
- Button creates receive request via API
- Fixed Vercel build timeout with safe migration handling
- Added wallet address input field in admin panel for RECEIVE requests
- Updated API to handle RECEIVE wallet address assignment"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo Vercel автоматически задеплоит изменения
echo ========================================
pause

