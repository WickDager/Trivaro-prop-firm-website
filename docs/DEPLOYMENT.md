# Trivaro Prop Firm - Deployment Guide

## Prerequisites

- Node.js 18+
- MongoDB 6.0+
- Redis 7+
- Docker & Docker Compose (optional)
- Git

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/trivaro/prop-firm.git
cd prop-firm
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Configure Environment Variables

#### Backend (.env)
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your values:
- MongoDB URI
- Redis connection
- JWT secrets
- MetaAPI token
- Email service
- Payment gateway keys

#### Frontend (.env)
```bash
cp frontend/.env.example frontend/.env
```

### 4. Start Services

#### Option A: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Option B: Docker Compose
```bash
npm run docker:up
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api

## Production Deployment

### Using Docker (Recommended)

1. **Build Images**
```bash
docker-compose -f docker/docker-compose.yml build
```

2. **Start Services**
```bash
docker-compose -f docker/docker-compose.yml up -d
```

3. **Check Status**
```bash
docker-compose ps
docker-compose logs -f
```

### Using Deployment Script

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh production
```

### Manual Production Setup

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Setup PM2 (Process Manager)**
```bash
npm install -g pm2
cd backend
pm2 start src/server.js --name trivaro-backend
pm2 save
pm2 startup
```

3. **Configure Nginx**
```bash
sudo cp nginx/nginx.conf /etc/nginx/sites-available/trivaro
sudo ln -s /etc/nginx/sites-available/trivaro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Database Backup

### Manual Backup
```bash
mongodump --uri="mongodb://user:pass@host:27017/trivaro" --gzip --archive=backup.gz
```

### Automated Backup
```bash
./scripts/backup.sh
```

### Restore from Backup
```bash
mongorestore --uri="mongodb://user:pass@host:27017/trivaro" --gzip --archive=backup.gz
```

## Environment Variables

### Required Backend Variables
- `NODE_ENV`: production
- `MONGODB_URI`: MongoDB connection string
- `REDIS_HOST`: Redis host
- `JWT_SECRET`: JWT signing secret
- `ENCRYPTION_KEY`: 32-byte hex key for encryption
- `META_API_TOKEN`: MetaAPI.cloud token
- `STRIPE_SECRET_KEY`: Stripe secret key
- `SENDGRID_API_KEY`: SendGrid API key

### Required Frontend Variables
- `VITE_API_URL`: Backend API URL
- `VITE_STRIPE_PUBLIC_KEY`: Stripe public key

## Monitoring

### Health Check
```bash
curl http://localhost:5000/health
```

### Logs
```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# All logs
docker-compose logs -f
```

## Troubleshooting

### Backend Won't Start
1. Check MongoDB connection
2. Verify Redis is running
3. Check environment variables
4. Review logs: `docker-compose logs backend`

### Frontend Build Fails
1. Clear node_modules: `rm -rf node_modules`
2. Clear cache: `npm cache clean --force`
3. Reinstall: `npm install`

### Database Connection Issues
1. Verify MongoDB is running
2. Check connection string
3. Ensure network access (for cloud MongoDB)

## Scaling

### Horizontal Scaling
1. Deploy multiple backend instances
2. Use load balancer (Nginx, AWS ALB)
3. Shared MongoDB and Redis

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Use MongoDB with more resources
- Optimize database indexes

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up DDoS protection
- [ ] Enable database authentication
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Regular security audits

## Performance Optimization

### Backend
- Enable Redis caching
- Use database indexes
- Implement query optimization
- Use compression

### Frontend
- Enable code splitting
- Optimize images
- Use CDN for static assets
- Enable browser caching

## Support

For deployment issues:
- Email: devops@trivaro.com
- Documentation: https://docs.trivaro.com
