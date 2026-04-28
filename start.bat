@echo off
title iLoveMarkdown
echo.
echo  =============================
echo   iLoveMarkdown
echo  =============================
echo.

:: Go to project root
cd /d "%~dp0"

:: Check Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERRO] Python nao encontrado. Instale em https://python.org
    pause
    exit /b 1
)

:: Check Node
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERRO] Node.js nao encontrado. Instale em https://nodejs.org
    pause
    exit /b 1
)

:: Install backend deps if needed
if not exist "backend\app\__pycache__" (
    echo  [1/3] Instalando dependencias do backend...
    cd backend
    pip install -r requirements.txt -q
    cd /d "%~dp0"
) else (
    echo  [1/3] Backend pronto.
)

:: Install frontend deps if needed
if not exist "frontend\node_modules" (
    echo  [2/3] Instalando dependencias do frontend...
    cd frontend
    call npm install --silent
    cd /d "%~dp0"
) else (
    echo  [2/3] Frontend pronto.
)

:: Start backend in a new window
echo  [3/3] Iniciando servidor...
start "iLoveMarkdown - Backend" /min cmd /c "cd /d "%~dp0backend" && python run.py"

:: Wait for backend
echo  Aguardando backend...
timeout /t 4 /nobreak > nul

:: Start frontend in a new window
start "iLoveMarkdown - Frontend" /min cmd /c "cd /d "%~dp0frontend" && npm run dev"

:: Wait for frontend
timeout /t 3 /nobreak > nul

:: Open browser
start http://localhost:5173

echo.
echo  iLoveMarkdown rodando!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:8000/docs
echo.
echo  Feche esta janela para parar tudo.
echo.

:: Keep alive — when user closes this window, taskkill runs
pause
taskkill /fi "WINDOWTITLE eq iLoveMarkdown - Backend*" /f > nul 2>&1
taskkill /fi "WINDOWTITLE eq iLoveMarkdown - Frontend*" /f > nul 2>&1
