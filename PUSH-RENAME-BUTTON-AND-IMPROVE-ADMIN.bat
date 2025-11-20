@echo off
chcp 65001 >nul
echo ========================================
echo Отправка переименования кнопки и улучшения админки
echo ========================================
echo.
git add .
echo.
git commit -m "Rename button to 'Пополнил' and improve admin display

- Changed button text from 'Пополнить' to 'Пополнил'
- Improved admin receive requests display with better styling
- Added 'Был перевод - проверьте' header
- Enhanced transaction information display
- Better visual highlighting for pending transactions"
echo.
git push origin main
echo.
echo ========================================
echo Готово! Изменения отправлены на GitHub
echo ========================================
pause

