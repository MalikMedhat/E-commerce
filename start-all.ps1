# E-Commerce Full Stack Startup Script (Windows PowerShell)
# Run from the root ecommerce directory

Write-Host "🚀 Starting E-Commerce Full Stack..." -ForegroundColor Cyan
Write-Host ""

function Start-Backend {
    Write-Host "► Starting Spring Boot Backend on port 8088..." -ForegroundColor Cyan

    # Check if JAR exists
    if (!(Test-Path ".\target\product-0.0.1-SNAPSHOT.jar")) {
        Write-Host "► Building backend (first time)..." -ForegroundColor Cyan
        & ".\mvnw.cmd" clean package -DskipTests
    }

    # Start backend
    $backend = Start-Process -FilePath "java" `
        -ArgumentList "-jar", ".\target\product-0.0.1-SNAPSHOT.jar", "--server.port=8088" `
        -PassThru `
        -NoNewWindow

    Write-Host "✓ Backend started (PID: $($backend.Id))" -ForegroundColor Green
    Start-Sleep -Seconds 6

    # Verify backend is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8088/api/products" -UseBasicParsing -ErrorAction Stop
        Write-Host "✓ Backend verified (responding on :8088)" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Backend may still be starting..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
}

function Start-Frontend {
    Write-Host "► Starting React Frontend on port 3000..." -ForegroundColor Cyan

    $shopDir = "C:\Users\Malik\Downloads\ECommerce-Builder\ECommerce-Builder\artifacts\shop"

    if (!(Test-Path $shopDir)) {
        Write-Host "✗ Shop directory not found at: $shopDir" -ForegroundColor Red
        Write-Host "Update the path in this script or run manually:"
        Write-Host "  cd artifacts/shop"
        Write-Host "  `$env:PORT='3000'; `$env:BASE_PATH='/'; pnpm exec vite"
        return $false
    }

    Push-Location $shopDir

    # Start frontend with environment variables
    $frontend = Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c", "set PORT=3000 && set BASE_PATH=/ && pnpm exec vite --config vite.config.ts --host 0.0.0.0" `
        -PassThru `
        -NoNewWindow

    Write-Host "✓ Frontend started (PID: $($frontend.Id))" -ForegroundColor Green
    Start-Sleep -Seconds 8

    # Verify frontend is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction Stop
        Write-Host "✓ Frontend verified (responding on :3000)" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Frontend may still be starting..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }

    Pop-Location
    return $true
}

# Main execution
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  E-Commerce Full Stack Startup" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Start backend
Start-Backend

Write-Host ""

# Start frontend
if (Start-Frontend) {
    Write-Host ""
    Write-Host "════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  ✓ All Services Started" -ForegroundColor Green
    Write-Host "════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Frontend:  http://localhost:3000" -ForegroundColor Green
    Write-Host "📍 Backend:   http://localhost:8088" -ForegroundColor Green
    Write-Host "📍 API Docs:  http://localhost:8088/api/products" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 To stop services: close these windows or use Ctrl+C" -ForegroundColor Yellow
    Write-Host ""
}

