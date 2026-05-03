@echo off
chcp 65001 >nul
title AI Learning Assistant Web
echo Starting AI Learning Assistant Web Application...
echo.

cd /d "K:\AI\AIxueixi-haha2\vibePM-web"

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call bun install
    if errorlevel 1 (
        echo Error: Failed to install dependencies.
        pause
        exit /b 1
    )
    echo Dependencies installed successfully.
)

echo Starting development server...
call bun run dev

if errorlevel 1 (
    echo Error: Failed to start development server.
    pause
    exit /b 1
)

pause
