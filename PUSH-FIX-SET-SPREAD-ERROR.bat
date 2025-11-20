@echo off
chcp 65001 >nul
echo ========================================
echo Исправление ошибки TypeScript с Set
echo ========================================
echo.
git add .
echo.
git commit -m "Fix: TypeScript error with Set spread operator

- Replaced Set spread operator with add() method
- Fixed 'Type Set can only be iterated with downlevelIteration' error
- Uses Set.add() instead of spread operator for better TypeScript compatibility"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

