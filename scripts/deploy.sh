#!/bin/bash
# Deployment script for Trivaro Prop Firm

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if environment is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Environment not specified${NC}"
    echo "Usage: ./deploy.sh [staging|production]"
    exit 1
fi

ENV=$1

echo -e "${YELLOW}Deploying to $ENV environment...${NC}"

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm ci && cd ..
cd frontend && npm ci && cd ..

# Run tests
echo "🧪 Running tests..."
cd backend && npm test && cd ..
cd frontend && npm test && cd ..

# Build frontend
echo "🏗️  Building frontend..."
cd frontend && npm run build && cd ..

# Backup database
echo "💾 Creating database backup..."
./scripts/backup.sh

# Deploy using docker-compose
echo "🐳 Deploying with Docker..."
docker-compose -f docker/docker-compose.yml down
docker-compose -f docker/docker-compose.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Health check
echo "🏥 Running health checks..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)

if [ "$HEALTH_CHECK" -eq 200 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}Application is running and healthy${NC}"
else
    echo -e "${RED}❌ Deployment failed! Health check returned: $HEALTH_CHECK${NC}"
    echo "Rolling back..."
    docker-compose -f docker/docker-compose.yml down
    exit 1
fi

# Clean up old Docker images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
