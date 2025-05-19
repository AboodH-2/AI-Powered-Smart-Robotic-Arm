@echo off
echo Starting ASL Detection Project...

REM Start the API server in a new command window
start cmd /k "cd Frontend && python asl_api.py"

REM Wait 2 seconds for the API to initialize
timeout /t 2 /nobreak > nul

REM Start the frontend development server
start cmd /k "cd Frontend/Interface && npm run dev"

echo ASL Detection Project started!
echo API running at: http://localhost:5000
echo Frontend running at: http://localhost:3000

echo.
echo Press any key to close this window (the servers will continue running)
pause > nul 