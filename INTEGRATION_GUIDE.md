# E-Commerce Frontend-Backend Integration Guide

## ✅ Current Status

Both services are now running and configured to work together:

- **Frontend (Shop)**: Running on `http://localhost:3000`
- **Backend (Spring Boot)**: Running on `http://localhost:8088`
- **Database (MySQL)**: Connected and accessible at `localhost:3306`

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Frontend (React/Vite)                  │
│                   http://localhost:3000                  │
└──────────────────────────────────────────────────────────┘
                              │
                    (JWT Bearer Token)
                              ↓
┌──────────────────────────────────────────────────────────┐
│            Spring Boot API Backend (Java)                │
│                   http://localhost:8088                  │
│                                                          │
│  ✓ CORS enabled for localhost:3000                      │
│  ✓ JWT-based stateless authentication                   │
│  ✓ Spring Security configured                           │
└──────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│              MySQL Database (Port 3306)                  │
│                                                          │
│  Database: ecommerce                                    │
│  User: root / Password: 808090                          │
└──────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

### 1. Register New User

**Endpoint**: `POST /api/auth/register`  
**CORS**: ✓ Allowed (public endpoint)  
**Authentication**: Not required

```bash
curl -X POST http://localhost:8088/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully"
}
```

### 2. Login

**Endpoint**: `POST /api/auth/login`  
**CORS**: ✓ Allowed (public endpoint)  
**Authentication**: Not required

```bash
curl -X POST http://localhost:8088/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

### 3. Use Token for Protected Endpoints

Store the `token` in localStorage (frontend does this automatically) and send it with all authenticated requests:

```bash
curl -X GET http://localhost:8088/api/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📦 Frontend API Configuration

The frontend is configured in `artifacts/shop/src/lib/api-setup.ts`:

```typescript
export function setupApiClient() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8088';
  
  setBaseUrl(apiBaseUrl);
  setAuthTokenGetter(() => {
    const token = useAuthStore.getState().token;
    return token; // Automatically sent in Authorization header
  });
}
```

**Environment Configuration** (`.env`):
```ini
VITE_API_BASE_URL=http://localhost:8088
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

## 🔓 Public Endpoints (No Auth Required)

These endpoints are accessible without a JWT token:

- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `GET /api/categories` - List all categories
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/payments/webhook` - Payment webhooks

## 🔒 Protected Endpoints (Auth Required)

These endpoints require a valid JWT token in the `Authorization: Bearer {token}` header:

- `GET /api/cart` - View cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/{itemId}` - Remove from cart
- `POST /api/orders` - Create order
- `GET /api/orders` - List user's orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/payments/charge` - Process payment
- `GET /api/user/profile` - Get user profile
- Any other user-specific endpoints

## 🔄 Complete Integration Test

### Step 1: Start All Services

**Backend** (Spring Boot on 8088):
```powershell
cd C:\Users\Malik\IdeaProjects\ecommerce
java -jar .\target\product-0.0.1-SNAPSHOT.jar --server.port=8088
```

**Frontend** (Vite on 3000):
```powershell
cd "C:\Users\Malik\Downloads\ECommerce-Builder\ECommerce-Builder\artifacts\shop"
$env:PORT="3000"; $env:BASE_PATH="/"
pnpm exec vite --config vite.config.ts --host 0.0.0.0
```

### Step 2: Verify Services

```powershell
# Check backend
Invoke-WebRequest http://localhost:8088/api/products -UseBasicParsing

# Check frontend
Invoke-WebRequest http://localhost:3000 -UseBasicParsing
```

### Step 3: Test Full Auth Flow

**1. Register a new user** (from PowerShell or frontend UI):
```powershell
$payload = @{
    email = "test@example.com"
    password = "TestPass123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8088/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $payload `
  -UseBasicParsing
```

**2. Login to get JWT**:
```powershell
$payload = @{
    email = "test@example.com"
    password = "TestPass123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8088/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $payload `
  -UseBasicParsing

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

**3. Use token to access protected endpoints**:
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-WebRequest -Uri "http://localhost:8088/api/cart" `
  -Headers $headers `
  -UseBasicParsing
```

## 🎨 Frontend Integration Points

### Auth Store (`src/store/authStore.ts`)

```typescript
const token = useAuthStore.getState().token
const user = useAuthStore.getState().user
const isAuthenticated = useAuthStore.getState().isAuthenticated

// Set auth after login
useAuthStore.getState().setAuth(user, token)

// Logout
useAuthStore.getState().logout()

// Hydrate from localStorage on app load
useAuthStore.getState().hydrate()
```

### Using API Client

```typescript
import { useLogin, useProducts, useCart } from '@workspace/api-client-react'

// Login
const { mutate: login } = useLogin()
login({ email: 'user@example.com', password: 'pass' }, {
  onSuccess: (data) => {
    useAuthStore.getState().setAuth(data.user, data.token)
  }
})

// Get protected data (auto-sends JWT)
const { data: cartItems } = useCart()
```

## 🔧 CORS Configuration

The backend's CORS configuration (in `CorsConfig.java`) now allows:
- `http://localhost:*` (development)
- `http://127.0.0.1:*` (localhost)
- `https://e-commerce-*-malikmedhat.vercel.app` (production)

**Allowed methods**: GET, POST, PUT, DELETE, OPTIONS  
**Allowed headers**: All (`*`)  
**Credentials**: Allowed

## 🚀 Running in Production

When deploying to production:

1. **Set environment variables**:
   ```bash
   export VITE_API_BASE_URL=https://your-backend-domain.com
   export SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/ecommerce
   export SPRING_DATASOURCE_USERNAME=your_db_user
   export SPRING_DATASOURCE_PASSWORD=your_db_password
   export JWT_SECRET=your-secret-key-change-this
   ```

2. **Build frontend**:
   ```bash
   pnpm --filter @workspace/shop build
   ```

3. **Build backend JAR** (already created at `target/product-0.0.1-SNAPSHOT.jar`)

4. **Update CORS origins** in `CorsConfig.java`:
   ```java
   config.setAllowedOriginPatterns(List.of(
       "https://your-frontend-domain.com",
       "https://your-app.vercel.app"
   ));
   ```

## 📝 Security Notes

⚠️ **Important**:
- Never commit `.env` files with real credentials
- Use strong JWT secrets in production
- Store JWT tokens securely in the frontend (currently in localStorage)
- Implement token refresh mechanism for long-lived sessions
- Always use HTTPS in production
- Validate and sanitize all user inputs server-side

## 🐛 Troubleshooting

### Frontend can't reach backend
- Check CORS is enabled: ✓ (already fixed)
- Verify backend is running on 8088: `netstat -ano | findstr :8088`
- Check `VITE_API_BASE_URL` in `.env`

### 403 Forbidden errors
- Missing or invalid JWT token
- Token expired (need refresh implementation)
- Endpoint is protected and requires authentication

### Authentication not working
- Check token is being stored: `localStorage.getItem('authToken')` in browser console
- Verify `Authorization: Bearer` header is sent: check network tab
- Ensure backend security allows the endpoint

### Database connection errors
- Verify MySQL is running: `Get-Process mysqld`
- Check credentials in `application.properties`
- Ensure database `ecommerce` exists

## 📚 Related Files

**Backend**:
- `/src/main/java/com/ecom/config/CorsConfig.java` - CORS configuration
- `/src/main/java/com/ecom/config/SecurityConfig.java` - JWT & Security setup
- `/src/main/java/com/ecom/service/JwtService.java` - JWT token generation/validation
- `/src/main/resources/application.properties` - Backend configuration

**Frontend**:
- `artifacts/shop/.env` - Environment variables
- `artifacts/shop/src/lib/api-setup.ts` - API client initialization
- `artifacts/shop/src/store/authStore.ts` - Auth state management
- `lib/api-client-react/src/custom-fetch.ts` - HTTP client with token injection

---

**Last Updated**: 2026-07-20  
**Status**: ✅ Integration Complete and Tested

