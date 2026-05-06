#!/bin/bash
# Script para desenvolvimento com Vercel CLI
# Use: ./dev-vercel.sh ou bash dev-vercel.sh

echo "Instalando Vercel CLI globalmente..."
npm install -g vercel

echo ""
echo "Puxando variáveis de ambiente..."
vercel env pull

echo ""
echo "Iniciando servidor de desenvolvimento na porta 3000..."
vercel dev
