@echo off
chcp 65001 >nul
git add prisma/migrations/20251006093314_init/migration.sql scripts/fix-and-migrate.js
git commit -m "Fix: Move Network table before NetworkPair and improve migration fix script"
git push origin main
echo Готово! Порядок создания таблиц исправлен.

