@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo  Starting Clarity Minds Platform
echo  Backend:  Spring Boot 3 (Port 8080)
echo  Frontend: SolidJS + Vite (Port 3000)
echo ==========================================

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"

:: Check for mvn in PATH or .m2 cache
where mvn >nul 2>nul
if %errorlevel% equ 0 (
    set "MVN_CMD=mvn"
) else (
    for /r "%USERPROFILE%\.m2\wrapper\dists" %%f in (mvn.cmd) do (
        if not defined MVN_CMD set "MVN_CMD=%%f"
    )
)

if not defined MVN_CMD set "MVN_CMD=mvn"

:: Try Windows Terminal first, fallback to standard CMD windows
where wt.exe >nul 2>nul
if %errorlevel% equ 0 (
    echo Launching tabs in Windows Terminal...
    start wt.exe -w 0 nt -d "%BACKEND_DIR%" --title "Clarity Minds - Backend" cmd.exe /k "!MVN_CMD! spring-boot:run" ; nt -d "%FRONTEND_DIR%" --title "Clarity Minds - Frontend" cmd.exe /k "npm run dev"
) else (
    echo Launching separate command prompt windows...
    start "Clarity Minds - Backend" cmd.exe /k "cd /d "%BACKEND_DIR%" && "!MVN_CMD!" spring-boot:run"
    start "Clarity Minds - Frontend" cmd.exe /k "cd /d "%FRONTEND_DIR%" && npm run dev"
)

echo Both backend and frontend have been launched in separate terminal windows.

