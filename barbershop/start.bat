@echo off
REM Script para instalar dependências e iniciar o servidor no Windows

cls
echo ================================
echo 🚀 Iniciando Sistema de Agendamento
echo ================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não está instalado!
    echo Por favor, instale Node.js em: https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js detectado: 
node -v
echo ✓ npm detectado:
npm -v
echo.

REM Instalar dependências se não existirem
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    call npm install
    echo ✓ Dependências instaladas
    echo.
)

REM Iniciar o servidor
echo 🔧 Iniciando servidor...
echo ================================
echo 📱 Acesse: http://localhost:3000
echo ================================
echo.

call npm start
pause
