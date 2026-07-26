# TechHub Frontend

React + Vite + Tailwind UI (from Figma) connected to the Spring Boot API.

## Run

1. Start the backend from the repo root: `mvn spring-boot:run`
2. In this folder: `npm install` then `npm run dev`
3. Open http://localhost:5173

API base URL defaults to `http://localhost:8088/api` (override with `VITE_API_BASE_URL` in `.env`).

## If you see a Vite CSS error

Stop any running dev servers (Ctrl+C in the terminal), then:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run dev
```
