# AskMe Project

A modern web application with a React frontend and a backend API, containerized with Docker.

## Project Structure

```
.
├── backend/          # Backend API application
├── frontend/         # React frontend application
├── docker-compose.yml
└── .env             # Environment variables
```

### Backend Structure

The backend is built with a modern API framework and includes:

- `app/` - Main application code
- `tests/` - Test files
- `requirements.txt` - Python dependencies
- `Dockerfile` - Backend container configuration

### Frontend Structure

The frontend is a React application with:

- `src/` - Source code
  - `components/` - Reusable React components
  - `pages/` - Page components
  - `static/` - Static assets and styles
  - `utils/` - Utility functions
- `public/` - Public assets
- `package.json` - Node.js dependencies
- `Dockerfile` - Frontend container configuration

## Environment Configuration

The project requires three separate `.env` files for different components:

### 1. Root `.env` file (/.env)
Place this file in the root directory:
```env
# Database Configuration
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=askme_db
MYSQL_USER=askme_user
MYSQL_PASSWORD=your_db_password
```

### 2. Backend `.env` file (/backend/.env)
Place this file in the backend directory:
```env
# Backend Configuration
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Connection
DB_HOST=db
DB_PORT=3306
DB_NAME=askme_db
DB_USER=askme_user
DB_PASSWORD=your_db_password
```

### 3. Frontend `.env` file (/frontend/.env)
Place this file in the frontend directory:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:8001/api/v1
NODE_ENV=development
```

## Docker Setup and Running the Project

### Prerequisites

- Docker
- Docker Compose

### Steps to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/ehsanulhaq19/aske-me-bot
   cd askme
   ```

2. Create and configure the `.env` files as described above.

3. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

4. Run database migrations:
   ```bash
   # Access the backend container
   docker-compose exec backend bash
   
   # Run migrations
   alembic upgrade head
   ```

5. Access the applications:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:8001
   - Database: localhost:3310

### Default Admin Credentials
After setting up the project, you can log in with these default credentials:
- Email: `admin@example.com`
- Password: `admin123`

> **Important**: Make sure to change these credentials in a production environment.

### Individual Service Management

Start specific services:
```bash
docker-compose up -d frontend  # Start only frontend
docker-compose up -d backend   # Start only backend
docker-compose up -d db        # Start only database
```

Stop services:
```bash
docker-compose down  # Stop all services
```

View logs:
```bash
docker-compose logs -f         # All services
docker-compose logs -f backend # Backend only
docker-compose logs -f frontend # Frontend only
```

## Development

### Backend Development
- The backend code is mounted as a volume, so changes will reflect immediately
- Access the backend container: `docker-compose exec backend bash`

### Frontend Development
- The frontend code is mounted as a volume, so changes will reflect immediately
- Node modules are preserved in a named volume
- Access the frontend container: `docker-compose exec frontend sh`

## Database

- MySQL 8.0 is used as the database
- Port: 3310 (host) -> 3306 (container)
- Data is persisted in a named volume: `mysql_data`

## Troubleshooting

1. If containers fail to start:
   - Check if ports 3001, 8001, or 3310 are already in use
   - Verify the .env files exist and have correct values
   - Check Docker logs for specific error messages

2. If changes don't reflect:
   - Rebuild the containers: `docker-compose up --build`
   - Check the Docker volume mounts

3. Database connection issues:
   - Ensure the database container is running
   - Verify database credentials in .env files
   - Wait a few seconds after container startup for database initialization

## License

[Your License Here] 