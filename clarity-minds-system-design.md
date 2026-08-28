# Clarity Minds — System Design & Development Specification

## 1. Project Overview

**Clarity Minds** is a gamified cognitive-training and rehabilitation-support platform built around short interactive games targeting:

1. Attention
2. Memory
3. Reaction

Players complete games, progress through levels, earn XP, maintain streaks, and track their performance over time.

> **Important:** Clarity Minds should be presented as a cognitive-training/rehabilitation-support platform, not as a diagnostic or medical-treatment system.

### Core Architecture

```text
React Frontend
      │
      │ REST API
      ▼
Spring Boot Backend
      │
      ▼
SQLite
```

The initial database is SQLite, but the backend must be designed so that switching to MySQL or PostgreSQL later requires minimal changes.

---

# 2. Technology Stack

## Frontend

- React
- JavaScript / TypeScript
- React Router
- CSS
- Fetch API or Axios
- Vite

The frontend is responsible for:

- UI
- Game rendering
- Game timers
- Animations
- User input
- Game mechanics
- Temporary game state
- Calculating raw gameplay metrics
- Sending completed game results to the backend

## Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- Bean Validation
- Hibernate
- SQLite
- Maven
- JUnit

The backend is responsible for:

- Authentication
- Users
- Game metadata
- Level configuration
- Game sessions
- Game results
- Player progress
- XP
- Player level
- Streaks
- Achievements
- Leaderboards
- Analytics

---

# 3. Monorepo Structure

```text
clarity-minds/
│
├── backend/
│   ├── pom.xml
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── clarityminds/
│   │   │   │           └── backend/
│   │   │   │               │
│   │   │   │               ├── BackendApplication.java
│   │   │   │               │
│   │   │   │               ├── config/
│   │   │   │               │   ├── SecurityConfig.java
│   │   │   │               │   ├── CorsConfig.java
│   │   │   │               │   └── DatabaseConfig.java
│   │   │   │               │
│   │   │   │               ├── common/
│   │   │   │               │   ├── exception/
│   │   │   │               │   ├── response/
│   │   │   │               │   └── util/
│   │   │   │               │
│   │   │   │               ├── user/
│   │   │   │               │   ├── controller/
│   │   │   │               │   ├── dto/
│   │   │   │               │   ├── entity/
│   │   │   │               │   ├── repository/
│   │   │   │               │   └── service/
│   │   │   │               │
│   │   │   │               ├── game/
│   │   │   │               │   ├── controller/
│   │   │   │               │   ├── dto/
│   │   │   │               │   ├── entity/
│   │   │   │               │   ├── enums/
│   │   │   │               │   ├── repository/
│   │   │   │               │   └── service/
│   │   │   │               │
│   │   │   │               ├── progress/
│   │   │   │               │   ├── controller/
│   │   │   │               │   ├── dto/
│   │   │   │               │   ├── entity/
│   │   │   │               │   ├── repository/
│   │   │   │               │   └── service/
│   │   │   │               │
│   │   │   │               ├── achievement/
│   │   │   │               │   ├── controller/
│   │   │   │               │   ├── dto/
│   │   │   │               │   ├── entity/
│   │   │   │               │   ├── repository/
│   │   │   │               │   └── service/
│   │   │   │
│   │   │   │               ├── leaderboard/
│   │   │   │               │   ├── controller/
│   │   │   │               │   ├── dto/
│   │   │   │               │   └── service/
│   │   │   │
│   │   │   │               └── analytics/
│   │   │   │                   ├── controller/
│   │   │   │                   ├── dto/
│   │   │   │                   └── service/
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-dev.properties
│   │   │
│   │   └── test/
│   │       └── java/
│   │
│   └── data/
│       └── clarity-minds.db
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   │
│   ├── public/
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       │
│       ├── assets/
│       │
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── games/
│       │   └── progress/
│       │
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── GamesPage.jsx
│       │   ├── GamePage.jsx
│       │   ├── ResultsPage.jsx
│       │   ├── ProfilePage.jsx
│       │   └── LeaderboardPage.jsx
│       │
│       ├── games/
│       │   ├── reaction/
│       │   │   ├── ReactionGame.jsx
│       │   │   ├── reactionEngine.js
│       │   │   └── reactionConfig.js
│       │   │
│       │   ├── memory/
│       │   │   ├── MemoryGame.jsx
│       │   │   ├── memoryEngine.js
│       │   │   └── memoryConfig.js
│       │   │
│       │   └── attention/
│       │       ├── AttentionGame.jsx
│       │       ├── attentionEngine.js
│       │       └── attentionConfig.js
│       │
│       ├── services/
│       │   ├── api.js
│       │   ├── gameService.js
│       │   ├── progressService.js
│       │   └── userService.js
│       │
│       ├── hooks/
│       │   ├── useGame.js
│       │   └── usePlayer.js
│       │
│       ├── context/
│       │   └── PlayerContext.jsx
│       │
│       ├── utils/
│       │   ├── scoreUtils.js
│       │   └── timeUtils.js
│       │
│       └── styles/
│           ├── global.css
│           └── variables.css
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── games.md
│   └── database.md
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

---

# 4. Core Architectural Principle

## Frontend owns gameplay

React handles:

```text
Game loop
Timers
Randomization
Animations
Player input
Difficulty mechanics
Game completion
Raw game metrics
Temporary game state
```

## Backend owns persistence and progression

Spring Boot handles:

```text
Authentication
Users
Game metadata
Game levels
Game sessions
Game results
Player progress
XP
Player level
Streak
Achievements
Leaderboards
Analytics
```

### Important Rule

Do **not** send every click/event to the backend.

Bad:

```text
Player clicks
    ↓
API
    ↓
Database
    ↓
API
    ↓
React
```

Correct:

```text
React
 │
 ├── Game loop
 ├── Clicks
 ├── Timers
 ├── Animations
 └── Calculations
          │
          ▼
     Game finishes
          │
          ▼
 POST /game-sessions/{id}/complete
          │
          ▼
       Backend
          │
          ▼
       Database
```

The browser owns temporary gameplay state. The backend stores durable state.

---

# 5. Games

## 5.1 Reaction Game — Quick Tap

### Objective

Measure how quickly the player responds to a visual target.

### Gameplay

```text
WAIT...
   ↓
Random delay
   ↓
TARGET APPEARS
   ↓
Player clicks
   ↓
Calculate reaction time
```

Example:

```text
Target appeared: 10:00:01.420
Player clicked:  10:00:01.687

Reaction time = 267 ms
```

### Level Parameters

Each level should be configurable.

```text
targetSize
minimumDelay
maximumDelay
roundCount
timeLimit
falseTargetEnabled
distractionCount
```

### Example Levels

| Level | Target Size | Rounds | Distractions |
|---:|---:|---:|---:|
| 1 | Large | 5 | 0 |
| 2 | Large | 6 | 0 |
| 3 | Medium | 6 | 0 |
| 4 | Medium | 8 | 1 |
| 5 | Small | 8 | 2 |
| 6 | Small | 10 | 3 |
| 7 | Small | 10 | 4 |
| 8 | Small | 12 | 5 |
| 9 | Tiny | 12 | 6 |
| 10 | Tiny | 15 | 8 |

### Metrics

```text
averageReactionTime
bestReactionTime
worstReactionTime
accuracy
falseClicks
misses
roundsCompleted
```

---

# 6. Memory Game — Sequence Recall

## Objective

Remember and reproduce a sequence.

Example:

```text
🟦 → 🟢 → 🔴 → 🟡
```

Then the player sees:

```text
🟦 🟢 🔴 🟡
```

and must reproduce the sequence.

## Level Parameters

```text
sequenceLength
displayDuration
delayBeforeInput
numberOfSymbols
reverseMode
```

## Example Levels

| Level | Sequence Length | Display Duration |
|---:|---:|---:|
| 1 | 3 | 1000ms |
| 2 | 3 | 800ms |
| 3 | 4 | 800ms |
| 4 | 4 | 600ms |
| 5 | 5 | 600ms |
| 6 | 5 | 500ms |
| 7 | 6 | 500ms |
| 8 | 7 | 400ms |
| 9 | 8 | 350ms |
| 10 | 8 + Reverse | 300ms |

## Additional Difficulty

Difficulty can increase through:

1. Longer sequences
2. Faster display speed
3. Longer delay before recall
4. More symbols
5. More distractors
6. Reverse recall

Example:

```text
Forward:
A → B → C

Reverse:
C → B → A
```

## Metrics

```text
sequenceLength
correctSequences
incorrectSequences
accuracy
responseTime
highestSequence
```

---

# 7. Attention Game — Target Focus

## Objective

Find the correct target while ignoring distractions.

Example:

```text
🔵 🔵 🔴 🔵
🔵 🟢 🔵 🔵
🔵 🔵 🔵 🔵
```

Instruction:

```text
Find RED
```

The player must click the red target.

## Level Parameters

```text
gridSize
targetCount
distractorCount
timeLimit
targetMovement
similarDistractors
multipleRules
```

## Example Levels

| Level | Grid | Distractors | Time |
|---:|---:|---:|---:|
| 1 | 3×3 | 4 | 10s |
| 2 | 3×3 | 6 | 10s |
| 3 | 4×4 | 10 | 10s |
| 4 | 4×4 | 12 | 8s |
| 5 | 5×5 | 18 | 8s |
| 6 | 5×5 | 20 | 7s |
| 7 | 6×6 | 28 | 7s |
| 8 | 6×6 | 30 | 6s |
| 9 | 7×7 | 40 | 6s |
| 10 | 7×7 | 45 | 5s |

## Metrics

```text
correctClicks
incorrectClicks
missedTargets
accuracy
averageResponseTime
targetsFound
```

---

# 8. Game Metadata

The backend stores game definitions.

## Game Entity

```text
id
code
name
description
category
active
createdAt
updatedAt
```

Example codes:

```text
REACTION_QUICK_TAP
MEMORY_SEQUENCE
ATTENTION_TARGET
```

Categories:

```text
REACTION
MEMORY
ATTENTION
```

---

# 9. Game Level

## GameLevel Entity

```text
id
gameId
levelNumber
difficulty
configuration
xpReward
active
```

Game-specific configuration should be stored as JSON.

Example:

```json
{
  "targetSize": 80,
  "minimumDelay": 1000,
  "maximumDelay": 3000,
  "roundCount": 5,
  "distractionCount": 0
}
```

Another level:

```json
{
  "targetSize": 35,
  "minimumDelay": 400,
  "maximumDelay": 1200,
  "roundCount": 12,
  "distractionCount": 5
}
```

This allows new difficulty parameters to be added without changing the database schema.

---

# 10. User

## User Entity

```text
id
username
email
passwordHash
displayName
createdAt
updatedAt
active
```

Never store plaintext passwords.

---

# 11. Player Game Progress

## PlayerGameProgress Entity

```text
id
userId
gameId
currentLevel
highestLevel
totalAttempts
totalCompleted
bestScore
totalScore
lastPlayedAt
```

Example:

```text
Player
 │
 ├── Reaction   → Level 7
 ├── Memory     → Level 5
 └── Attention  → Level 8
```

---

# 12. Game Session

A game session represents one actual playthrough.

## GameSession Entity

```text
id
userId
gameId
levelId
startedAt
completedAt
status
```

Status:

```text
STARTED
COMPLETED
ABANDONED
```

---

# 13. Game Result

## GameResult Entity

```text
id
sessionId
userId
gameId
levelId
score
xpEarned
accuracy
completionTime
metricsJson
createdAt
```

The `metricsJson` field allows each game to store different metrics.

### Reaction Example

```json
{
  "averageReactionTime": 284,
  "bestReactionTime": 201,
  "falseClicks": 2,
  "misses": 1
}
```

### Memory Example

```json
{
  "sequenceLength": 7,
  "correctSequences": 8,
  "incorrectSequences": 2,
  "averageResponseTime": 1250
}
```

### Attention Example

```json
{
  "correctClicks": 18,
  "incorrectClicks": 3,
  "missedTargets": 2,
  "averageResponseTime": 620
}
```

---

# 14. Player Stats

## PlayerStats Entity

```text
userId
totalXp
level
currentStreak
longestStreak
lastPlayedDate
```

Example:

```text
XP: 2450
Level: 8
Current Streak: 6
Longest Streak: 12
```

---

# 15. XP System

The frontend should never be authoritative for XP.

The frontend submits performance data:

```json
{
  "score": 820,
  "accuracy": 94.5,
  "metrics": {
    "averageReactionTime": 284
  }
}
```

The backend determines:

```text
XP earned
Player level
Progression
Streak
Achievements
```

Example:

```text
Complete game
      ↓
Calculate performance
      ↓
Score = 820
      ↓
Award XP = 82
      ↓
Update player XP
      ↓
Check level-up
```

Simple initial formula:

```text
XP = baseXP + performanceBonus
```

Do not accept:

```json
{
  "xpEarned": 999999
}
```

from the frontend.

---

# 16. API Design

Base URL:

```text
/api/v1
```

---

## 16.1 Game APIs

### Get All Games

```http
GET /api/v1/games
```

Response:

```json
[
  {
    "id": 1,
    "code": "REACTION_QUICK_TAP",
    "name": "Quick Tap",
    "category": "REACTION",
    "description": "Test your reaction speed.",
    "active": true
  }
]
```

### Get Game

```http
GET /api/v1/games/{gameId}
```

### Get Game Levels

```http
GET /api/v1/games/{gameId}/levels
```

Response:

```json
[
  {
    "id": 1,
    "levelNumber": 1,
    "difficulty": "EASY",
    "configuration": {
      "targetSize": 80,
      "roundCount": 5
    },
    "xpReward": 50
  }
]
```

### Get Specific Level

```http
GET /api/v1/games/{gameId}/levels/{levelNumber}
```

React calls this before starting a level.

---

# 17. Game Session APIs

## Start Session

```http
POST /api/v1/game-sessions
```

Request:

```json
{
  "gameId": 1,
  "levelId": 3
}
```

Response:

```json
{
  "sessionId": 1024,
  "gameId": 1,
  "levelId": 3,
  "status": "STARTED",
  "startedAt": "2026-08-28T10:15:00Z"
}
```

## Complete Session

```http
POST /api/v1/game-sessions/{sessionId}/complete
```

Request:

```json
{
  "score": 820,
  "accuracy": 94.5,
  "completionTime": 32.5,
  "metrics": {
    "averageReactionTime": 284,
    "bestReactionTime": 201,
    "falseClicks": 2
  }
}
```

Response:

```json
{
  "sessionId": 1024,
  "score": 820,
  "xpEarned": 82,
  "levelUp": true,
  "newPlayerLevel": 6
}
```

## Abandon Session

```http
POST /api/v1/game-sessions/{sessionId}/abandon
```

---

# 18. Progress APIs

## Overall Player Progress

```http
GET /api/v1/users/me/progress
```

Response:

```json
{
  "totalXp": 2450,
  "level": 8,
  "currentStreak": 6,
  "longestStreak": 12
}
```

## Progress for All Games

```http
GET /api/v1/users/me/game-progress
```

Response:

```json
[
  {
    "gameCode": "REACTION_QUICK_TAP",
    "currentLevel": 7,
    "highestLevel": 7,
    "bestScore": 920
  },
  {
    "gameCode": "MEMORY_SEQUENCE",
    "currentLevel": 5,
    "highestLevel": 5,
    "bestScore": 780
  }
]
```

## Specific Game Progress

```http
GET /api/v1/users/me/game-progress/{gameId}
```

---

# 19. Result APIs

## Recent Results

```http
GET /api/v1/users/me/results?page=0&size=20
```

## Results for Game

```http
GET /api/v1/users/me/games/{gameId}/results
```

## Performance History

```http
GET /api/v1/users/me/games/{gameId}/performance
```

Response:

```json
[
  {
    "date": "2026-08-20",
    "score": 720,
    "accuracy": 87
  },
  {
    "date": "2026-08-25",
    "score": 810,
    "accuracy": 92
  }
]
```

This can later power performance graphs.

---

# 20. User APIs

```http
GET /api/v1/users/me
```

```http
PUT /api/v1/users/me
```

---

# 21. Authentication APIs

Authentication should be implemented using Spring Security.

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

For protected endpoints, the backend should identify the user from the authenticated principal.

The frontend should not send arbitrary `userId` values for `/me` endpoints.

---

# 22. Leaderboard APIs

These can be implemented after the core system.

```http
GET /api/v1/leaderboards
```

Optional:

```text
?gameId=1
&period=weekly
```

Do not make leaderboard functionality a blocker for the MVP.

---

# 23. Achievement APIs

Later:

```http
GET /api/v1/users/me/achievements
```

Possible achievements:

```text
FIRST_GAME
FIRST_LEVEL_COMPLETE
REACTION_MASTER
MEMORY_MASTER
ATTENTION_MASTER
SEVEN_DAY_STREAK
LEVEL_10
```

---

# 24. Database Architecture

Initial database:

```text
SQLite
```

Database file:

```text
backend/data/clarity-minds.db
```

Use:

```text
Spring Data JPA
+
Hibernate
+
JDBC
```

The persistence flow must be:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
JPA/Hibernate
    ↓
Database
```

Never put database access directly in controllers or game components.

---

# 25. Database Switching

The database configuration must be externalized.

Development:

```properties
spring.datasource.url=jdbc:sqlite:./data/clarity-minds.db
spring.datasource.driver-class-name=org.sqlite.JDBC
```

Later MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/clarity_minds
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

Do not hardcode database credentials.

Do not write SQLite-specific SQL inside services.

Use JPA repositories:

```java
public interface GameRepository
        extends JpaRepository<Game, Long> {
}
```

The goal is that changing the database does not require changing:

- Controllers
- Services
- DTOs
- Entities
- Repositories
- Frontend game code

---

# 26. Database Migrations

For the first prototype, JPA schema generation can be used.

Once the schema stabilizes, add Flyway.

Suggested migration structure:

```text
V1__create_users.sql
V2__create_games.sql
V3__create_game_levels.sql
V4__create_player_stats.sql
V5__create_game_sessions.sql
V6__create_game_results.sql
V7__create_player_game_progress.sql
V8__create_achievements.sql
```

Avoid relying indefinitely on:

```properties
spring.jpa.hibernate.ddl-auto=update
```

for production.

---

# 27. Backend Package Responsibilities

## Controller

Only HTTP concerns:

```text
Receive request
Validate request
Call service
Return response
```

No business logic.

## Service

Contains business logic:

```text
startGameSession()
completeGameSession()
calculateXp()
updatePlayerProgress()
updateStreak()
checkLevelUp()
```

## Repository

Database access only.

Example:

```java
public interface GameRepository
        extends JpaRepository<Game, Long> {
}
```

## DTO

Do not expose JPA entities directly.

Examples:

```text
GameResponse
GameLevelResponse
StartSessionRequest
CompleteSessionRequest
GameResultResponse
PlayerProgressResponse
```

---

# 28. Exception Handling

Create:

```text
common/
└── exception/
    ├── ResourceNotFoundException
    ├── InvalidGameStateException
    ├── InvalidGameResultException
    └── GlobalExceptionHandler
```

Use:

```java
@RestControllerAdvice
```

Standard error response:

```json
{
  "timestamp": "2026-08-28T10:30:00Z",
  "status": 404,
  "error": "GAME_NOT_FOUND",
  "message": "Game not found",
  "path": "/api/v1/games/99"
}
```

---

# 29. Frontend Game Architecture

Each game must be isolated.

```text
games/
│
├── reaction/
│   ├── ReactionGame.jsx
│   ├── reactionEngine.js
│   └── reactionConfig.js
│
├── memory/
│   ├── MemoryGame.jsx
│   ├── memoryEngine.js
│   └── memoryConfig.js
│
└── attention/
    ├── AttentionGame.jsx
    ├── attentionEngine.js
    └── attentionConfig.js
```

Do not put the entire game inside a single huge React component.

---

# 30. Game Engine Pattern

Example:

```text
ReactionGame.jsx
       │
       ▼
reactionEngine.js
       │
       ├── generateRound()
       ├── startRound()
       ├── calculateReactionTime()
       ├── recordClick()
       ├── calculateScore()
       └── buildResult()
```

Use the same pattern for Memory and Attention.

This makes gameplay logic independently testable.

---

# 31. Complete Game Flow

```text
User opens game
       ↓
GET /games/{id}/levels/{level}
       ↓
Backend returns level configuration
       ↓
React initializes game
       ↓
POST /game-sessions
       ↓
Backend creates session
       ↓
React runs game completely locally
       ↓
Game finishes
       ↓
React calculates raw metrics
       ↓
POST /game-sessions/{id}/complete
       ↓
Backend validates result
       ↓
Backend calculates XP
       ↓
Backend updates progress
       ↓
Backend updates streak
       ↓
Backend checks achievements
       ↓
Response
       ↓
React Results Page
```

---

# 32. Game State Persistence

Do not store every gameplay event.

Avoid:

```text
POST /game/state
POST /game/state
POST /game/state
POST /game/state
...
```

Instead persist:

```text
Session started
Session completed
Session abandoned
Game result
Player progress
```

React handles:

```text
Current round
Current timer
Current sequence
Current target
Animations
Temporary clicks
```

Backend handles:

```text
Session lifecycle
Results
Progress
XP
Long-term statistics
```

---

# 33. Backend Result Validation

The backend must perform sanity checks.

Examples:

```text
accuracy must be between 0 and 100
score must be >= 0
reaction time must be reasonable
game must exist
level must belong to game
session must belong to authenticated user
session must not already be completed
```

Never blindly trust frontend data.

---

# 34. Recommended Development Phases

Do not build the entire application in one huge step.

Build incrementally.

## Phase 1 — Foundation

```text
Monorepo
Spring Boot
React
SQLite
JPA
CORS
Basic API
```

## Phase 2 — Database

Implement:

```text
User
Game
GameLevel
PlayerStats
PlayerGameProgress
GameSession
GameResult
```

Seed:

```text
3 games
10 levels per game
```

## Phase 3 — Game APIs

Implement:

```text
GET games
GET levels
POST session
POST complete
POST abandon
GET progress
GET results
```

## Phase 4 — Reaction Game

Implement:

```text
Quick Tap
10 levels
Score
Metrics
Result submission
XP
Progression
```

## Phase 5 — Memory Game

Implement:

```text
Sequence Recall
10 levels
Score
Metrics
Progression
```

## Phase 6 — Attention Game

Implement:

```text
Target Focus
10 levels
Score
Metrics
Progression
```

## Phase 7 — Dashboard

Show:

```text
XP
Player level
Streak
Game levels
Best scores
Recent games
Performance graphs
```

## Phase 8 — Gamification

Add:

```text
Achievements
Daily challenges
Leaderboards
Badges
```

---

# 35. MVP Scope

The first working version should contain:

```text
✓ User
✓ Authentication
✓ 3 games
✓ 10 levels per game
✓ Game metadata
✓ Level configuration
✓ Game sessions
✓ Game results
✓ Score
✓ XP
✓ Player level
✓ Game progression
✓ Basic dashboard
✓ SQLite
✓ REST APIs
✓ React gameplay
```

Do not make these blockers for the MVP:

```text
○ Leaderboards
○ Achievements
○ Daily challenges
○ Advanced analytics
○ Notifications
○ Social features
```

---

# 36. Definition of Done

A user should be able to:

```text
Register/Login
      ↓
Dashboard
      ↓
Select Reaction
      ↓
See current level
      ↓
Start game
      ↓
Play game
      ↓
Finish game
      ↓
Result submitted
      ↓
Score calculated
      ↓
XP awarded
      ↓
Progress updated
      ↓
Return to dashboard
      ↓
See updated XP/level
```

The same flow must work for:

```text
Memory
Attention
```

---

# 37. Codex Development Rules

Codex must follow these rules:

1. Do not put game logic in Spring Boot.
2. Do not put database logic in controllers.
3. Do not expose JPA entities directly from REST APIs.
4. Use DTOs for requests and responses.
5. Put business logic in services.
6. Use repositories for persistence.
7. Do not hardcode database credentials.
8. Do not hardcode SQLite-specific SQL in business logic.
9. Keep database configuration externalized.
10. Use enums for fixed categories and statuses.
11. Validate all incoming API requests.
12. Do not trust XP or player progression values from React.
13. Backend calculates authoritative XP and progression.
14. React owns temporary game state.
15. Backend stores durable game state.
16. Each game must be independently testable.
17. Write unit tests for backend business logic.
18. Write integration tests for important REST endpoints.
19. Avoid unnecessary dependencies.
20. Do not over-engineer the initial MVP.
21. Keep each game isolated from the others.
22. Prefer configuration-driven difficulty over hardcoded level logic.
23. Keep API contracts stable and versioned under `/api/v1`.
24. Use transactions for operations that update session, result, XP, and progress together.
25. Never trust a `userId` supplied by the frontend for authenticated `/me` operations.
26. Ensure a game level belongs to the requested game before starting a session.
27. Ensure a game session belongs to the authenticated player before modifying it.
28. Prevent a completed session from being completed again.
29. Keep frontend API communication inside service modules rather than scattering fetch calls throughout components.
30. Keep secrets and environment-specific configuration outside source code.

---

# 38. Design Goal

The core architectural boundary is:

```text
┌─────────────────────────────────────────────┐
│                  FRONTEND                   │
│                                             │
│  UI                                        │
│  Game rendering                             │
│  Timers                                     │
│  Animations                                 │
│  Input handling                             │
│  Game mechanics                             │
│  Temporary game state                       │
│  Raw performance metrics                    │
│                                             │
└──────────────────────┬──────────────────────┘
                       │
                    REST API
                       │
┌──────────────────────▼──────────────────────┐
│                  BACKEND                    │
│                                             │
│  Authentication                             │
│  Game metadata                              │
│  Level configuration                        │
│  Game sessions                              │
│  Results                                    │
│  XP                                          │
│  Player progression                         │
│  Streaks                                    │
│  Achievements                               │
│  Analytics                                  │
│                                             │
└──────────────────────┬──────────────────────┘
                       │
                     JPA
                       │
┌──────────────────────▼──────────────────────┐
│                  DATABASE                   │
│                                             │
│                  SQLite                     │
│                                             │
│       Easily replaceable by MySQL           │
│             or PostgreSQL                   │
│                                             │
└─────────────────────────────────────────────┘
```

## Final Principle

> **React is responsible for playing the game. Spring Boot is responsible for remembering what happened and determining the player's long-term progression.**

This architecture should be treated as the baseline for **Clarity Minds v1**.
