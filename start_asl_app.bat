@echo off
echo Starting ASL Detection Application...

echo.
echo Starting Flask API backend...
start cmd /k "cd Frontend && run_api.bat"

echo.
echo Waiting for API to initialize (5 seconds)...
timeout /t 5 /nobreak

echo.
echo Starting Next.js frontend...
start cmd /k "cd Frontend/Interface && npm run dev"

echo.
echo ASL Detection application is starting up!
echo - Flask API should be running on http://localhost:5000
echo - Next.js frontend should be running on http://localhost:3000
echo.
echo Open http://localhost:3000 in your browser to use the application.
echo Press any key to exit this window (the application will continue running)...
pause 