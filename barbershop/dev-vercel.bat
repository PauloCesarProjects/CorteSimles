@echo off
REM Script para desenvolvimento com Vercel CLI
REM Use: dev-vercel.bat

echo Instalando Vercel CLI globalmente...
npm install -g vercel

echo.
echo Puxando variáveis de ambiente...
vercel env pull

echo.
echo Iniciando servidor de desenvolvimento na porta 3000...
vercel dev

pause
