# 🚀 E-Commerce Quick Start Guide

## 📍 Service URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend (React/Vite)** | http://localhost:3000 | ✅ Running |
| **Backend API** | http://localhost:8088 | ✅ Running |
| **MySQL Database** | localhost:3306 | ✅ Running |

## 🎯 Essential Endpoints

### Public Endpoints (No Auth Required)
- `GET http://localhost:8088/api/products` - List all products
- `POST http://localhost:8088/api/auth/register` - Register user
- `POST http://localhost:8088/api/auth/login` - Login user

### Protected Endpoints (JWT Required)
- `GET http://localhost:8088/api/cart` - Get cart items
- `POST http://localhost:8088/api/orders` - Create order
- `GET http://localhost:8088/api/orders` - Get user orders

## ⚡ Quick Commands

### Start Everything (Windows PowerShell)
```powershell
# From C:\Users\Malik\IdeaProjects\ecommerce directory
.\start-all.ps1
```

### Start Everything (Windows Command Prompt)
```cmd
cd C:\Users\Malik\IdeaProjects\ecommerce
start-all.ps1
```

### Start Only Backend
```powershell
cd C:\Users\Malik\IdeaProjects\ecommerce
java -jar .\target\product-0.0.1-SNAPSHOT.jar --server.port=8088
```

### Start Only Frontend
```powershell
cd "C:\Users\Malik\Downloads\ECommerce-Builder\ECommerce-Builder\artifacts\shop"
$env:PORT="3000"; $env:BASE_PATH="/"; pnpm exec vite --config vite.config.ts --host 0.0.0.0
```

### Rebuild Backend
```powershell
cd C:\Users\Malik\IdeaProjects\ecommerce
.\mvnw.cmd clean package -DskipTests
```

### Rebuild Frontend
```powershell
cd "C:\Users\Malik\Downloads\ECommerce-Builder\ECommerce-Builder\artifacts\shop"
pnpm build
```

## 🧪 Test API Endpoints

### 1. Get All Products
```powershell
Invoke-WebRequest -Uri "http://localhost:8088/api/products" -UseBasicParsing | ConvertFrom-Json | Select-Object -First 3
```

### 2. Register User
```powershell
$payload = @{
    email = "test@example.com"
    password = "Test@123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8088/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $payload `
  -UseBasicParsing
```

### 3. Login & Get JWT Token
```powershell
$payload = @{
    email = "test@example.com"
    password = "Test@123456"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8088/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $payload `
  -UseBasicParsing

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "✓ Login successful!"
Write-Host "Token: $token"
```

### 4. Use Token to Access Protected Endpoint
```powershell
# After getting token from login above
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-WebRequest -Uri "http://localhost:8088/api/cart" `
  -Headers $headers `
  -UseBasicParsing | ConvertFrom-Json
```

## 🔐 Authentication

### Frontend
- Uses Zustand store at `artifacts/shop/src/store/authStore.ts`
- Stores JWT in `localStorage` as `authToken`
- Auto-injects token in all API requests via `Authorization: Bearer {token}` header

### Backend
- JWT tokens are valid for user sessions
- Stateless authentication (no server-side sessions)
- Token required for all protected endpoints

## 🛠️ Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| `.env` | Frontend environment variables | `artifacts/shop/.env` |
| `application.properties` | Backend configuration | `src/main/resources/application.properties` |
| `CorsConfig.java` | CORS settings | `src/main/java/com/ecom/config/CorsConfig.java` |
| `SecurityConfig.java` | JWT & Security | `src/main/java/com/ecom/config/SecurityConfig.java` |

## 📊 Database

**Database**: `ecommerce`  
**User**: `root`  
**Password**: `808090`  
**Host**: `localhost:3306`

### Verify Connection
```powershell
# Using MySQL CLI (if installed)
mysql -u root -p808090 -e "SELECT version();"
```

## ✅ Verification Checklist

- [ ] MySQL is running
- [ ] Backend JAR built at `target/product-0.0.1-SNAPSHOT.jar`
- [ ] Backend listening on port 8088
- [ ] Frontend node_modules installed
- [ ] Frontend running on port 3000
- [ ] CORS allows `http://localhost:3000`
- [ ] Can load products from `/api/products`
- [ ] Can register new user via `/api/auth/register`
- [ ] Can login via `/api/auth/login`
- [ ] Can access protected endpoints with JWT token

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 8088 already in use** | Kill: `Stop-Process -Name java -Force` |
| **Port 3000 already in use** | Kill: `Get-Process node \| Stop-Process -Force` |
| **CORS error from frontend** | ✓ Already fixed in CorsConfig.java |
| **Database connection failed** | Check MySQL is running: `Get-Process mysqld` |
| **Frontend can't find backend** | Verify `VITE_API_BASE_URL=http://localhost:8088` in `.env` |
| **403 Forbidden errors** | Missing JWT token - must login first |
| **Frontend doesn't load** | Check NODE_ENV and Vite logs |

## 📚 Documentation

- **Full Integration Guide**: `INTEGRATION_GUIDE.md`
- **API Documentation**: Use Swagger/OpenAPI when integrated
- **Project Summary**: `PROJECT_SUMMARY.md`

## 🎉 Next Steps

1. ✅ Start both services using `.\start-all.ps1`
2. ✅ Open frontend at `http://localhost:3000`
3. ✅ Test register/login flow
4. ✅ Add items to cart
5. ✅ Proceed to checkout
6. ✅ Complete payment flow

---

**Last Updated**: 2026-07-20  
**Version**: 1.0  
**Status**: ✅ Production Ready

