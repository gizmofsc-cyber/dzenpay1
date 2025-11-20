@echo off
chcp 65001 >nul
git add scripts/fix-and-migrate.js package.json
git commit -m "Fix: Auto-fix failed migration state before deploy"
git push origin main
echo Готово! Теперь миграции будут исправляться автоматически при деплое.

