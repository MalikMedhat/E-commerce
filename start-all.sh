#!/bin/bash
# E-Commerce Full Stack Startup Script
# Run from the root ecommerce directory

echo "🚀 Starting E-Commerce Full Stack..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running on Windows (Git Bash, WSL, or native)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    IS_WINDOWS=true
else
    IS_WINDOWS=false
fi

# Function to start backend
start_backend() {
    echo -e "${BLUE}► Starting Spring Boot Backend on port 8088...${NC}"

    if [ ! -f "target/product-0.0.1-SNAPSHOT.jar" ]; then
        echo -e "${BLUE}► Building backend (first time)...${NC}"
        if $IS_WINDOWS; then
            ./mvnw.cmd clean package -DskipTests
        else
            ./mvnw clean package -DskipTests
        fi
    fi

    if $IS_WINDOWS; then
        java -jar ".\target\product-0.0.1-SNAPSHOT.jar" --server.port=8088 &
    else
        java -jar ./target/product-0.0.1-SNAPSHOT.jar --server.port=8088 &
    fi

    BACKEND_PID=$!
    echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
    sleep 5

    # Verify backend is running
    if curl -s http://localhost:8088/api/products > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend verified (responding on :8088)${NC}"
    else
        echo -e "${RED}✗ Backend not responding yet, waiting...${NC}"
        sleep 5
    fi
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}► Starting React Frontend on port 3000...${NC}"

    SHOP_DIR="$( cd "$(dirname "${BASH_SOURCE[0]}")" && pwd )/../../Downloads/ECommerce-Builder/ECommerce-Builder/artifacts/shop"

    if [ ! -d "$SHOP_DIR" ]; then
        echo -e "${RED}✗ Shop directory not found at: $SHOP_DIR${NC}"
        echo "Update the path in this script or run manually:"
        echo "  cd artifacts/shop"
        echo "  PORT=3000 BASE_PATH=/ pnpm exec vite"
        return 1
    fi

    cd "$SHOP_DIR"

    if $IS_WINDOWS; then
        # Windows PowerShell
        cmd /c "set PORT=3000&set BASE_PATH=/&pnpm exec vite --config vite.config.ts --host 0.0.0.0" &
    else
        # Unix-like
        PORT=3000 BASE_PATH=/ pnpm exec vite --config vite.config.ts --host 0.0.0.0 &
    fi

    FRONTEND_PID=$!
    echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
    sleep 5

    # Verify frontend is running
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend verified (responding on :3000)${NC}"
    else
        echo -e "${RED}✗ Frontend not responding yet, waiting...${NC}"
        sleep 3
    fi
}

# Main execution
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  E-Commerce Full Stack Startup${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Start backend
start_backend

echo ""

# Start frontend
start_frontend

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ All Services Started${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "📍 Frontend:  http://localhost:3000"
echo "📍 Backend:   http://localhost:8088"
echo "📍 API Docs:  http://localhost:8088/api/products"
echo ""
echo "💡 To stop all services, press Ctrl+C"
echo ""

# Wait for all background processes
wait

