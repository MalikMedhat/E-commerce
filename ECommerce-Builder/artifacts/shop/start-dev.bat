@echo off
REM Start the shop dev server from the artifacts/shop folder
set PORT=3000
set BASE_PATH=/
set VITE_API_BASE_URL=http://localhost:8088
cd /d %~dp0
pnpm install
pnpm dev
