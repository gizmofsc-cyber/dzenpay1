@echo off
echo ========================================
echo Deploying project to GitHub
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Initializing git repository...
    git init
    echo.
)

REM Check current remote
git remote -v
echo.

REM Remove old origin if exists
git remote remove origin 2>nul

REM Add new remote
echo Adding remote repository...
git remote add origin https://github.com/gizmofsc-cyber/dzenpay1.git
echo.

REM Add all files
echo Adding all files...
git add .
echo.

REM Commit changes
echo Committing changes...
git commit -m "Initial commit: Updated admin credentials and removed old repository references"
echo.

REM Push to GitHub
echo Pushing to GitHub...
git branch -M main
git push -u origin main --force
echo.

echo ========================================
echo Deployment completed!
echo ========================================
pause

