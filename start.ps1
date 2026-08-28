# Clarity Minds — PowerShell Launcher Script
$rootDir = $PSScriptRoot
$backendDir = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Starting Clarity Minds Platform" -ForegroundColor Cyan
Write-Host " Backend:  Spring Boot 3 (Port 8080)" -ForegroundColor Green
Write-Host " Frontend: SolidJS + Vite (Port 3000)" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# Locate Maven
$mvnCmd = "mvn"
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    $foundMvn = Get-ChildItem "$HOME\.m2\wrapper\dists" -Recurse -Filter "mvn.cmd" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($foundMvn) {
        $mvnCmd = $foundMvn.FullName
    }
}

# Check for Windows Terminal (wt.exe)
if (Get-Command wt.exe -ErrorAction SilentlyContinue) {
    Write-Host "Opening tabs in Windows Terminal..." -ForegroundColor Yellow
    Start-Process wt.exe -ArgumentList "-w 0 nt -d `"$backendDir`" --title `"Clarity Minds - Backend`" cmd.exe /k `"`"$mvnCmd`" spring-boot:run`" `; nt -d `"$frontendDir`" --title `"Clarity Minds - Frontend`" cmd.exe /k `"npm run dev`""
} else {
    Write-Host "Opening separate PowerShell windows..." -ForegroundColor Yellow
    Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd `"$backendDir`"; & `"$mvnCmd`" spring-boot:run"
    Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd `"$frontendDir`"; npm run dev"
}

Write-Host "Both backend and frontend services have been launched in separate terminals." -ForegroundColor Green

