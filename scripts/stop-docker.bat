@echo off
echo ========================================
echo   Trivaro Prop Firm - Docker Stop
echo ========================================
echo.

echo Stopping all containers...
docker stop trivaro-mongodb trivaro-redis trivaro-backend trivaro-frontend

echo.
echo Removing containers...
docker rm trivaro-mongodb trivaro-redis trivaro-backend trivaro-frontend

echo.
echo Done!
echo.
