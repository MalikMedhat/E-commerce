# Start the shop dev server (PowerShell)
Set-Location $PSScriptRoot
$env:PORT = "3000"
$env:BASE_PATH = "/"
$env:VITE_API_BASE_URL = "http://localhost:8088"
pnpm install
pnpm dev
