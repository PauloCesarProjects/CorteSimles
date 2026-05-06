#!/bin/bash
# Script para instalar dependências e iniciar o servidor

echo "================================"
echo "🚀 Iniciando Sistema de Agendamento"
echo "================================"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js não está instalado!"
    echo "Por favor, instale Node.js em: https://nodejs.org"
    exit 1
fi

echo "✓ Node.js detectado: $(node -v)"
echo "✓ npm detectado: $(npm -v)"
echo ""

# Instalar dependências se não existirem
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo "✓ Dependências instaladas"
    echo ""
fi

# Iniciar o servidor
echo "🔧 Iniciando servidor..."
echo "================================"
echo "📱 Acesse: http://localhost:3000"
echo "================================"
echo ""

npm start
