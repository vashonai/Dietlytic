@echo off
echo Starting NutriHelp Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend App...
start "Frontend App" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: Check the Expo CLI output for the URL
echo.
echo Press any key to exit...
pause > nul
