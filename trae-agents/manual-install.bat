@echo off
echo ================================================
echo   Feicai Agent Package - TRAE Global Install
echo   Version: 1.0.0
echo ================================================
echo.

set TARGET_DIR=%USERPROFILE%\.trae\agents

echo Step 1: Creating TRAE agents directory...
mkdir "%TARGET_DIR%" 2>nul
echo Done: %TARGET_DIR%
echo.

echo Step 2: Copying files...
echo Please run this command in CMD (Administrator):

echo.
echo ================================================
echo COPY COMMAND:
echo ================================================
echo xcopy "K:\chanbpin4.0\120.产品经理技能包 4.0\trae-agents\*" "%TARGET_DIR%\" /E /I /H /Y
echo ================================================
echo.

echo To continue, please:
echo 1. Copy the COPY COMMAND above
echo 2. Open CMD as Administrator
echo 3. Paste and run the command
echo 4. Come back here and press any key
echo.

pause
