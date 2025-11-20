@echo off
chcp 65001 >nul
git add src/app/api/create-admin/route.ts
git commit -m "Add create-admin endpoint for initial admin setup"
git push origin main
echo Готово! После деплоя откройте: https://dzenpay.vercel.app/api/create-admin

