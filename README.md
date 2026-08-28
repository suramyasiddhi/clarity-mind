# Clarity Minds — Cognitive Training & Rehabilitation Platform

Clarity Minds is a cognitive-training and rehabilitation-support web application built around short, targeted, gamified interactive exercises:

1. **Reaction Speed** — *Quick Tap* (Visual stimulus latency, motor response, distraction filtering)
2. **Working Memory** — *Sequence Recall* (Pattern reproduction, sequence expansion, reverse recall)
3. **Selective Attention** — *Target Focus* (Visual search matrix, distractor filtration, rapid target identification)

---

## 🏗️ Architecture

- **Backend:** Spring Boot 3.3.3 (Java 21/24), Spring Data JPA, Spring Security, JJWT, SQLite
- **Frontend:** SolidJS 1.9, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Database:** SQLite (`backend/data/clarity-minds.db`), auto-created & seeded on first boot

```text
clarity-mind-subham/
│
├── backend/                  # Spring Boot application
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd       # Maven wrappers
│   ├── data/                 # SQLite database storage
│   └── src/                  # Java 21+ source code & test suites
│
├── frontend/                 # SolidJS lightweight UI
│   ├── package.json
│   ├── vite.config.js
│   └── src/                  # Reactive pages, components & game engines
│
├── start.sh                  # Multi-terminal launcher for Bash / Linux / macOS
├── start.ps1                 # Multi-terminal launcher for PowerShell
├── start.bat                 # Multi-terminal launcher for Windows Command Prompt
├── clarity-minds-system-design.md
└── README.md
```

---

## 📋 Prerequisites

Before running the application, ensure you have installed:

- **Java Development Kit (JDK):** Version 21 or 24 (`java -version`)
- **Node.js:** Version 18+ and npm (`node -v` and `npm -v`)
- **Maven:** Optional (the repo includes `mvnw.cmd` and `mvnw` wrapper scripts)

---

## ⚡ Quick Start (One-Click Multi-Terminal)

We provide automated launch scripts that open the Backend and Frontend in two separate terminal windows simultaneously:

### Option A: From Git Bash / Linux / macOS
```bash
./start.sh
```

### Option B: From Windows PowerShell
```powershell
./start.ps1
```

### Option C: From Windows Command Prompt (or Double-Click)
```cmd
start.bat
```

---

## 🛠️ Manual Run Instructions

If you prefer to start each service manually in separate terminal tabs:

### 1. Start the Backend

Open Terminal 1:
```bash
cd backend
# On Windows:
mvnw.cmd spring-boot:run
# Or on macOS / Linux:
./mvnw spring-boot:run
# Or if you have maven globally installed:
mvn spring-boot:run
```

- **Backend API Base:** `http://localhost:8080`
- **REST Endpoints:** `http://localhost:8080/api/v1`
- **Database:** Auto-seeds 3 games with 10 levels each (30 levels total) and a demo user.

---

### 2. Start the Frontend

Open Terminal 2:
```bash
cd frontend
npm install
npm run dev
```

- **Frontend Application URL:** `http://localhost:3000`
- Vite automatically proxies API requests (`/api/*`) to the backend at `http://localhost:8080`.

---

## 🔑 Default Demo Credentials

You can log in immediately with the pre-seeded demo user or register a new account:

- **Username:** `demo`
- **Password:** `password123`
- **Display Name:** `Subham Demo`
- **Pre-seeded Progress:** Level 2 player, 2-day streak, 350 XP

---

## 🎮 Available Cognitive Games

| Game | Category | Mechanics | Progression Parameters |
|---|---|---|---|
| **Quick Tap** | Reaction Speed | Tap target when it appears; avoid early taps and false red warning targets | Target size (80px $\rightarrow$ 25px), random delay (350ms $\rightarrow$ 2500ms), distractor count (0 $\rightarrow$ 8) |
| **Sequence Recall** | Working Memory | Memorize flashing colored pads and reproduce them in order | Sequence length (3 $\rightarrow$ 8 items), flash speed (1000ms $\rightarrow$ 300ms), reverse recall mode |
| **Target Focus** | Selective Attention | Scan grid matrix and locate all items matching the target shape & color rule | Matrix grid ($3\times3 \rightarrow 7\times7$), target count, similar color/shape distractors, countdown timer |

---

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Production Build
```bash
cd frontend
npm run build
```

---

## 🌐 API Overview (`/api/v1`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new player account | No |
| `POST` | `/api/v1/auth/login` | Login and obtain JWT token | No |
| `GET` | `/api/v1/users/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/v1/users/me` | Update user profile | Yes |
| `GET` | `/api/v1/games` | List all cognitive training games | No |
| `GET` | `/api/v1/games/{id}/levels` | Get 10 progressive difficulty levels for a game | No |
| `POST` | `/api/v1/game-sessions` | Start a new game session | Yes |
| `POST` | `/api/v1/game-sessions/{id}/complete` | Submit game results for authoritative scoring & XP | Yes |
| `POST` | `/api/v1/game-sessions/{id}/abandon` | Abandon an active game session | Yes |
| `GET` | `/api/v1/progress/stats` | Get player stats (XP, level, streaks) | Yes |
| `GET` | `/api/v1/progress/games` | Get progress across all 3 games | Yes |
| `GET` | `/api/v1/progress/recent-results` | Get recent training session history | Yes |
| `GET` | `/api/v1/achievements` | List unlocked and available badges | Yes |
| `GET` | `/api/v1/leaderboards` | Global player rankings | No |

