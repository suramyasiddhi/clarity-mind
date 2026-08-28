#!/usr/bin/env bash

# Clarity Minds — Multi-terminal Launch Script

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "=========================================="
echo " Starting Clarity Minds Platform"
echo " Backend:  Spring Boot 3 (Port 8080)"
echo " Frontend: SolidJS + Vite (Port 3000)"
echo "=========================================="

# Find Maven executable (system PATH or user .m2 cache fallback)
MVN_CMD="mvn"
if ! command -v mvn &> /dev/null; then
    M2_MVN=$(find "$USERPROFILE/.m2/wrapper/dists" -name "mvn.cmd" 2>/dev/null | head -n 1)
    if [ -n "$M2_MVN" ]; then
        MVN_CMD="$M2_MVN"
    fi
fi

# Detect OS and open two separate terminal windows
if [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "cygwin"* || "$OSTYPE" == "win32"* ]]; then
    # Windows (Git Bash / MSYS)
    echo "Detected Windows environment..."
    
    # Check if Windows Terminal (wt.exe) is available
    if command -v wt.exe &> /dev/null; then
        echo "Launching tabs in Windows Terminal..."
        wt.exe -w 0 nt -d "$BACKEND_DIR" --title "Clarity Minds - Backend" cmd.exe /k "$MVN_CMD spring-boot:run" \; nt -d "$FRONTEND_DIR" --title "Clarity Minds - Frontend" cmd.exe /k "npm run dev"
    else
        echo "Launching separate CMD windows..."
        cmd.exe /c start "Clarity Minds - Backend" cmd.exe /k "cd /d \"$BACKEND_DIR\" && $MVN_CMD spring-boot:run"
        cmd.exe /c start "Clarity Minds - Frontend" cmd.exe /k "cd /d \"$FRONTEND_DIR\" && npm run dev"
    fi

elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Detected macOS environment..."
    osascript -e "tell application \"Terminal\" to do script \"cd '$BACKEND_DIR' && $MVN_CMD spring-boot:run\""
    osascript -e "tell application \"Terminal\" to do script \"cd '$FRONTEND_DIR' && npm run dev\""

elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "Detected Linux environment..."
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="Clarity Minds - Backend" -- bash -c "cd '$BACKEND_DIR' && $MVN_CMD spring-boot:run; exec bash"
        gnome-terminal --title="Clarity Minds - Frontend" -- bash -c "cd '$FRONTEND_DIR' && npm run dev; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -title "Clarity Minds - Backend" -e "cd '$BACKEND_DIR' && $MVN_CMD spring-boot:run; exec bash" &
        xterm -title "Clarity Minds - Frontend" -e "cd '$FRONTEND_DIR' && npm run dev; exec bash" &
    else
        # Fallback to background processes
        echo "No desktop terminal emulator found. Starting in background..."
        (cd "$BACKEND_DIR" && $MVN_CMD spring-boot:run) &
        (cd "$FRONTEND_DIR" && npm run dev) &
    fi
else
    # Generic fallback
    echo "Starting in background..."
    (cd "$BACKEND_DIR" && $MVN_CMD spring-boot:run) &
    (cd "$FRONTEND_DIR" && npm run dev) &
fi

echo "Both services dispatched successfully!"

