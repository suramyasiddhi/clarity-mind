@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   Starting Clarity Minds Cognitive Platform
echo   Backend  : Spring Boot 3 (Port 8080)
echo   Frontend : SolidJS + Vite (Port 3000)
echo ===================================================

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"

:: Determine the best Maven executable command
if exist "%BACKEND_DIR%\mvnw.cmd" (
    set "BACKEND_CMD=mvnw.cmd spring-boot:run"
) else (
    where mvn >nul 2>nul
    if !errorlevel! equ 0 (
        set "BACKEND_CMD=mvn spring-boot:run"
    ) else (
        for /r "%USERPROFILE%\.m2\wrapper\dists" %%f in (mvn.cmd) do (
            if not defined BACKEND_CMD set "BACKEND_CMD=%%f spring-boot:run"
        )
    )
)

if not defined BACKEND_CMD set "BACKEND_CMD=mvn spring-boot:run"

:: Check if user specified 'backend' only argument
if /I "%~1"=="backend" (
    echo Launching Backend only...
    cd /d "%BACKEND_DIR%"
    call %BACKEND_CMD%
    goto :eof
)

:: Check if user specified 'frontend' only argument
if /I "%~1"=="frontend" (
    echo Launching Frontend only...
    cd /d "%FRONTEND_DIR%"
    call npm run dev
    goto :eof
)

:: Launch both services in separate terminal windows
where wt.exe >nul 2>nul
if %errorlevel% equ 0 (
    echo Opening tabs in Windows Terminal...
    start wt.exe -w 0 nt -d "%BACKEND_DIR%" --title "Clarity Minds - Backend" cmd.exe /k "%BACKEND_CMD%" ; nt -d "%FRONTEND_DIR%" --title "Clarity Minds - Frontend" cmd.exe /k "npm run dev"
) else (
    echo Opening separate Command Prompt windows...
    start "Clarity Minds - Backend" cmd.exe /k "cd /d "%BACKEND_DIR%" && %BACKEND_CMD%"
    start "Clarity Minds - Frontend" cmd.exe /k "cd /d "%FRONTEND_DIR%" && npm run dev"
)

echo [OK] Both Backend and Frontend have been launched in separate terminal windows.
