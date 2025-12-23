# SCT Tracker + Reminder + Guide App

A comprehensive self-hosted application for tracking Cognitive Disengagement Syndrome (SCT) / Sluggish Cognitive Tempo symptoms, with reminders, interactive guides, and progress analytics.

## Features

- **Daily Tracking**: Mental energy, fog episodes, sleep hours, and habit completion
- **Smart Reminders**: Configurable notifications for daily routines
- **Interactive Guides**: Cognitive exercises, Pomodoro timer, meditation, word games
- **Progress Dashboard**: Trend charts, correlations, and statistics
- **PWA Support**: Offline-capable progressive web app

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Scheduler**: Node.js + node-cron
- **Containerization**: Docker + Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd sct-app
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` and update the configuration (especially passwords and secrets)

4. Start all services:
```bash
docker-compose up -d
```

5. View logs:
```bash
docker-compose logs -f
```

6. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Production Deployment

1. Update `.env` with production values
2. Start services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Project Structure

```
sct-app/
├── docker-compose.yml          # Development orchestration
├── docker-compose.prod.yml     # Production orchestration
├── .env.example                # Environment template
├── frontend/                   # React + Vite application
├── backend/                    # FastAPI REST API
├── scheduler/                  # Notification scheduler service
└── db/                         # Database migrations
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/entries` - Get daily entries
- `POST /api/entries` - Create daily entry
- `PUT /api/entries/:date` - Update daily entry
- `GET /api/habits/today` - Get today's habits
- `POST /api/habits/:key/complete` - Complete a habit
- `GET /api/reminders` - Get user reminders
- `PUT /api/reminders/:id` - Update reminder
- `POST /api/activities/:type/start` - Start activity session
- `POST /api/activities/:id/end` - End activity session
- `GET /api/stats/summary` - Get statistics summary
- `GET /api/stats/correlations` - Get correlation data

## Development

### Backend

The backend uses FastAPI with SQLAlchemy. It auto-reloads on code changes in development mode.

### Frontend

The frontend uses Vite for fast HMR (Hot Module Replacement). Changes are reflected immediately.

### Database Migrations

Migrations are handled by Alembic. Run migrations manually if needed:

```bash
docker-compose exec backend alembic upgrade head
```

## Data Export

Users can export their data in CSV or JSON format from the Settings page. All data belongs to the user.

## Notes

### PWA Icons

The PWA manifest references icon files (`icon-192.png` and `icon-512.png`) that need to be created. You can generate these using any image editor or online tool. The icons should be:
- 192x192 pixels (icon-192.png)
- 512x512 pixels (icon-512.png)
- Square format
- Placed in `frontend/public/`

### Database Initialization

The database will be automatically initialized when the PostgreSQL container starts. Tables are created via SQLAlchemy models on first backend startup.

### First Run

1. Start the services: `docker-compose up -d`
2. Wait for all services to be healthy (check with `docker-compose ps`)
3. Access the frontend at http://localhost:3000
4. Register a new account
5. Start tracking your SCT symptoms!

## Troubleshooting

### Backend won't start
- Check database connection string in `.env`
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`

### Frontend won't connect to backend
- Verify `VITE_API_URL` in `.env` matches backend URL
- Check CORS settings in backend configuration
- Ensure backend is running: `docker-compose ps`

### Database connection errors
- Verify PostgreSQL credentials in `.env`
- Check if database volume exists: `docker volume ls`
- Restart database: `docker-compose restart db`

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

