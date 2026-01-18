@echo off
echo ========================================
echo  CryptoManiac AI Trading Guardian
echo  Starting DEV Environment
echo ========================================
echo.

echo [1/2] Starting ML Backend...
start "ML Backend" cmd /k "cd ml-backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 5

echo [2/2] Starting React Frontend...
start "React Frontend" cmd /k "npm start"

echo.
echo ========================================
echo  Both servers starting!
echo  - Backend: http://localhost:8000/docs
echo  - Frontend: http://localhost:3000
echo ========================================
