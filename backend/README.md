# Typing Contest Platform — Backend API

## Quick Start

```bash
cd backend
cp .env.example .env   # edit with your MongoDB URI & JWT secret
npm install
npm run dev            # starts with nodemon on port 5000
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✅ | Current user |
| POST | `/api/passages` | Admin | Create passage |
| GET | `/api/passages` | Admin | List passages |
| PATCH | `/api/passages/:id` | Admin | Update passage |
| DELETE | `/api/passages/:id` | Admin | Delete passage |
| POST | `/api/contests` | Admin | Create contest |
| GET | `/api/contests` | — | List contests |
| GET | `/api/contests/:id` | — | Contest detail |
| POST | `/api/contests/join` | ✅ | Join contest |
| PATCH | `/api/contests/:id` | Admin | Update contest |
| POST | `/api/attempt/start/:contestId` | ✅ | Start attempt |
| POST | `/api/attempt/submit` | ✅ | Submit attempt |
| GET | `/api/attempt/user/:contestId` | ✅ | User attempts |
| GET | `/api/leaderboard/:contestId` | — | Contest leaderboard |
| GET | `/api/admin/users` | Admin | List users |
| PATCH | `/api/admin/ban/:userId` | Admin | Ban/unban user |
| GET | `/api/admin/analytics` | Admin | Platform stats |

## Socket.io Events

- `join_contest` — join contest room
- `attempt_started` — broadcast typing status
- `attempt_finished` — broadcast + leaderboard update
- `contest_countdown` — synchronized timer
- `leaderboard_update` — real-time rankings
