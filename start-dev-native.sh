#!/bin/bash

echo "🚀 INICIANDO AMBIENTE DE DESENVOLVIMENTO VOLUNTARIAMENTE (NATIVO)"
echo "===================================================================="

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não está instalado. Por favor, instale o Python 3.11+"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js 18+"
    exit 1
fi

# Verificar se PostgreSQL está rodando
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "⚠️  PostgreSQL não está rodando na porta 5433"
    echo "   Por favor, inicie o PostgreSQL ou use Docker:"
    echo "   sudo systemctl start postgresql"
    echo "   ou"
    echo "   docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5433:5432 -d postgres:17"
fi

echo "✅ Dependências básicas verificadas"

# Função para limpar processos
cleanup() {
    echo "🛑 Parando todos os serviços..."
    pkill -f "uvicorn main:app"
    pkill -f "next dev"
    echo "✅ Serviços parados"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Iniciar Backend
echo "🔧 Iniciando Backend FastAPI..."
cd backend

# Verificar se o ambiente virtual existe
if [ ! -d ".venv" ]; then
    echo "📦 Criando ambiente virtual Python..."
    python3 -m venv .venv
fi

# Ativar ambiente virtual
source .venv/bin/activate

# Instalar dependências
echo "📦 Instalando dependências Python..."
pip install -r requirements.txt

# Iniciar backend em background
echo "🚀 Iniciando servidor FastAPI na porta 8000..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

cd ..

# Aguardar backend inicializar
echo "⏳ Aguardando backend inicializar..."
sleep 5

# Verificar se backend está rodando
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Backend iniciado com sucesso na porta 8000"
else
    echo "❌ Falha ao iniciar backend"
    exit 1
fi

# Iniciar Frontend
echo "🎨 Iniciando Frontend Next.js..."
cd CInvolunt-rio-front

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências Node.js..."
    npm run install
fi

# Iniciar frontend em background
echo "🚀 Iniciando servidor Next.js na porta 3000..."
npm run dev -- --port 3000 &
FRONTEND_PID=$!

cd ..

# Aguardar frontend inicializar
echo "⏳ Aguardando frontend inicializar..."
sleep 10

# Verificar se frontend está rodando
if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Frontend iniciado com sucesso na porta 3000"
else
    echo "❌ Falha ao iniciar frontend"
    exit 1
fi

echo ""
echo "🎯 AMBIENTE DE DESENVOLVIMENTO INICIADO!"
echo "=========================================="
echo "📊 Serviços disponíveis:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend API: http://localhost:8000"
echo "   • Documentação da API: http://localhost:8000/docs"
echo ""
echo "📱 Para acessar o sistema:"
echo "   1. Abra http://localhost:3000 no navegador"
echo "   2. Faça login ou cadastre-se"
echo "   3. Navegue pelas funcionalidades"
echo ""
echo "🔧 Comandos úteis:"
echo "   • Ver logs do backend: tail -f backend/logs/*.log"
echo "   • Ver logs do frontend: tail -f CInvolunt-rio-front/.next/server.log"
echo "   • Parar serviços: Ctrl+C"
echo ""
echo "🧪 Para testar a integração:"
echo "   • Execute: ./test-integration.sh"
echo ""
echo "✨ Desenvolvimento feliz!"
echo ""
echo "Pressione Ctrl+C para parar todos os serviços"

# Aguardar indefinidamente
wait
