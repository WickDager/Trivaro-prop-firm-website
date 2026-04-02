@echo off
echo ========================================
echo   Trivaro Prop Firm - Docker Setup
echo ========================================
echo.

REM Get absolute path to current directory
set "PROJECT_DIR=%CD%"

REM Stop and remove existing containers
echo [1/5] Stopping existing containers...
docker stop trivaro-mongodb trivaro-redis trivaro-backend trivaro-frontend 2>nul
docker rm trivaro-mongodb trivaro-redis trivaro-backend trivaro-frontend 2>nul

REM Create network
echo [2/5] Creating Docker network...
docker network create trivaro-network 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Network created successfully
) else (
    echo Network already exists
)

REM Start MongoDB
echo [3/5] Starting MongoDB...
docker run -d ^
  --name trivaro-mongodb ^
  --network trivaro-network ^
  -p 27017:27017 ^
  -e MONGO_INITDB_ROOT_USERNAME=trivaro ^
  -e MONGO_INITDB_ROOT_PASSWORD=trivaro123 ^
  -e MONGO_INITDB_DATABASE=trivaro ^
  -v mongodb_data:/data/db ^
  --restart always ^
  mongo:6.0

REM Start Redis
echo [4/5] Starting Redis...
docker run -d ^
  --name trivaro-redis ^
  --network trivaro-network ^
  -p 6379:6379 ^
  -v redis_data:/data ^
  --restart always ^
  redis:7-alpine ^
  redis-server --requirepass trivaro123

REM Wait for databases to be ready
echo [5/5] Waiting for databases to initialize...
timeout /t 10 /nobreak >nul

REM Start Backend
echo Starting Backend...
docker run -d ^
  --name trivaro-backend ^
  --network trivaro-network ^
  -p 5000:5000 ^
  -p 5001:5001 ^
  -e MONGODB_URI=mongodb://trivaro:trivaro123@mongodb:27017/trivaro?authSource=admin ^
  -e REDIS_HOST=redis ^
  -e REDIS_PORT=6379 ^
  -e REDIS_PASSWORD=trivaro123 ^
  -e FRONTEND_URL=http://localhost:3000 ^
  -e ALLOWED_ORIGINS=http://localhost:3000 ^
  -e NODE_ENV=development ^
  --restart always ^
  docker-backend:latest

if %ERRORLEVEL% EQU 0 (
    echo Backend started successfully
) else (
    echo Failed to start backend. Check Docker logs.
)

REM Start Frontend
echo Starting Frontend...
docker run -d ^
  --name trivaro-frontend ^
  --network trivaro-network ^
  -p 3000:80 ^
  --restart always ^
  docker-frontend:latest

echo.
echo ========================================
echo   Containers Started!
echo ========================================
echo.
echo Access the application:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo   Health:   http://localhost:5000/health
echo.
echo Container Status:
docker ps --filter "name=trivaro" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.
echo To view backend logs: docker logs -f trivaro-backend
echo To stop: .\scripts\stop-docker.bat
echo.
