# Trivaro Prop Firm - Docker Management Script for Windows PowerShell

param(
    [Parameter(Position=0)]
    [string]$Action = "start"
)

$ComposeFile = "docker/docker-compose.yml"
$ProjectName = "trivaro"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Trivaro Prop Firm - Docker Manager" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Start-Services {
    Write-Host "[1/4] Starting Docker services..." -ForegroundColor Yellow
    
    # Check if Docker is running
    $dockerStatus = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "[2/4] Building Docker images (first time may take 5-10 minutes)..." -ForegroundColor Yellow
    docker-compose -f $ComposeFile build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Build failed. Check the error messages above." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "[3/4] Starting containers..." -ForegroundColor Yellow
    docker-compose -f $ComposeFile up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to start containers." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "[4/4] Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check container status
    Write-Host ""
    Write-Host "Container Status:" -ForegroundColor Cyan
    docker-compose -f $ComposeFile ps
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Services Started Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access the application:" -ForegroundColor Cyan
    Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
    Write-Host "  Backend:   http://localhost:5000" -ForegroundColor White
    Write-Host "  Health:    http://localhost:5000/health" -ForegroundColor White
    Write-Host ""
    Write-Host "To view logs, run: .\scripts\docker.ps1 logs" -ForegroundColor Gray
    Write-Host "To stop, run:    .\scripts\docker.ps1 stop" -ForegroundColor Gray
    Write-Host ""
}

function Stop-Services {
    Write-Host "Stopping Docker services..." -ForegroundColor Yellow
    docker-compose -f $ComposeFile down
    Write-Host "Services stopped." -ForegroundColor Green
}

function View-Logs {
    Write-Host "Viewing logs (Press Ctrl+C to exit)..." -ForegroundColor Yellow
    docker-compose -f $ComposeFile logs -f
}

function Restart-Services {
    Write-Host "Restarting Docker services..." -ForegroundColor Yellow
    docker-compose -f $ComposeFile restart
    Write-Host "Services restarted." -ForegroundColor Green
}

function Rebuild-Services {
    Write-Host "Rebuilding Docker images..." -ForegroundColor Yellow
    docker-compose -f $ComposeFile build --no-cache
    Write-Host "Rebuild complete. Starting services..." -ForegroundColor Green
    docker-compose -f $ComposeFile up -d
}

function Clean-All {
    Write-Host "WARNING: This will remove all containers and data!" -ForegroundColor Red
    Write-Host "Are you sure? (y/n): " -NoNewline -ForegroundColor Red
    $response = Read-Host
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host "Removing all containers and volumes..." -ForegroundColor Yellow
        docker-compose -f $ComposeFile down -v
        Write-Host "Cleanup complete." -ForegroundColor Green
    } else {
        Write-Host "Cancelled." -ForegroundColor Yellow
    }
}

function Show-Status {
    Write-Host "Container Status:" -ForegroundColor Cyan
    docker-compose -f $ComposeFile ps
    Write-Host ""
    Write-Host "Resource Usage:" -ForegroundColor Cyan
    docker stats --no-stream
}

# Execute based on action
switch ($Action.ToLower()) {
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "logs" { View-Logs }
    "rebuild" { Rebuild-Services }
    "clean" { Clean-All }
    "status" { Show-Status }
    default {
        Write-Host "Usage: .\scripts\docker.ps1 [action]" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Actions:" -ForegroundColor Yellow
        Write-Host "  start   - Build and start all services (default)" -ForegroundColor White
        Write-Host "  stop    - Stop all services" -ForegroundColor White
        Write-Host "  restart - Restart all services" -ForegroundColor White
        Write-Host "  logs    - View logs (Ctrl+C to exit)" -ForegroundColor White
        Write-Host "  rebuild - Rebuild images from scratch" -ForegroundColor White
        Write-Host "  clean   - Remove all containers and data" -ForegroundColor White
        Write-Host "  status  - Show container status and resource usage" -ForegroundColor White
        Write-Host ""
    }
}
