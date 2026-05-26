@echo off
chcp 65001 >nul
echo ================================================
echo   Feicai Agent Package - TRAE Global Install
echo   Version: 1.0.0
echo ================================================
echo.

set USERPROFILE_DIR=%USERPROFILE%
set TRAE_AGENTS_DIR=%USERPROFILE%\.trae\agents

echo [1/3] Creating TRAE agents directory...
if not exist "%TRAE_AGENTS_DIR%" (
    mkdir "%TRAE_AGENTS_DIR%"
    echo       Directory created
) else (
    echo       Directory already exists
)
echo.

echo [2/3] Copying agent files...
echo       Source: K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents
echo       Target: %TRAE_AGENTS_DIR%

xcopy "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents\*" "%TRAE_AGENTS_DIR%\" /E /I /H /Y

if %errorLevel% equ 0 (
    echo       Files copied successfully
) else (
    echo [ERROR] Failed to copy files
    pause
    exit /b 1
)
echo.

echo [3/3] Verifying installation...
set COUNT=0
for %%f in ("%TRAE_AGENTS_DIR%\*.md") do set /a COUNT+=1
echo       Installed %COUNT% agent files

if %COUNT% GEQ 11 (
    echo.
    echo ================================================
    echo   SUCCESS! Installation completed!
    echo ================================================
    echo.
    echo   Installation path: %TRAE_AGENTS_DIR%
    echo.
    echo   Included AGENTS:
    echo   - product-manager-demand.md
    echo   - design-brief-builder.md
    echo   - design-maker.md
    echo   - dev-planner.md
    echo   - dev-builder.md
    echo   - code-reviewer.md
    echo   - bug-fixer.md
    echo   - release-builder.md
    echo   - feedback-writer.md
    echo   - evolution-engine.md
    echo   - skill-builder.md
    echo.
    echo   Next steps:
    echo   1. Open TRAE IDE
    echo   2. Reference agent files in chat
    echo   3. See TRAE-INSTALL-GUIDE.md for usage
    echo.
) else (
    echo.
    echo [ERROR] Installation incomplete
    echo        Expected at least 11 files, found %COUNT%
    echo.
)

echo ================================================
pause
