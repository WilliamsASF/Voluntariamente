#!/bin/bash

echo "🚀 INICIANDO AMBIENTE DE DESENVOLVIMENTO VOLUNTARIAMENTE"
echo "=========================================================="

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker e tente novamente."
    exit 1
fi

# Verificar se docker-compose está disponível
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose não está disponível. Por favor, instale o docker-compose."
    exit 1
fi

echo "✅ Docker e docker-compose estão disponíveis"

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.dev.yml down

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose -f docker-compose.dev.yml up --build -d

# Aguardar serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 15

# Verificar status dos serviços
echo "🔍 Verificando status dos serviços..."

# Verificar PostgreSQL
if curl -s http://localhost:5432 > /dev/null 2>&1; then
    echo "✅ PostgreSQL está rodando na porta 5432"
else
    echo "⚠️  PostgreSQL pode não estar totalmente inicializado ainda"
fi

# Verificar Backend
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Backend FastAPI está rodando na porta 8000"
else
    echo "❌ Backend não está respondendo na porta 8000"
fi

# Verificar Frontend
if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Frontend Next.js está rodando na porta 3000"
else
    echo "❌ Frontend não está respondendo na porta 3000"
fi

echo ""
echo "🎯 AMBIENTE DE DESENVOLVIMENTO INICIADO!"
echo "=========================================="
echo "📊 Serviços disponíveis:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend API: http://localhost:8000"
echo "   • Banco de dados: localhost:5432"
echo ""
echo "📱 Para acessar o sistema:"
echo "   1. Abra http://localhost:3000 no navegador"
echo "   2. Navegue por todas as páginas usando o sidebar"
echo "   3. Teste formulários e funcionalidades"
echo "   4. Verifique responsividade em diferentes tamanhos de tela"
echo ""
echo "🔧 Comandos úteis:"
echo "   • Ver logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "   • Parar serviços: docker-compose -f docker-compose.dev.yml down"
echo "   • Reiniciar: docker-compose -f docker-compose.dev.yml restart"
echo ""
echo "🧪 Para testar a integração:"
echo "   • Execute: ./test-integration.sh"
echo ""
echo "✨ Desenvolvimento feliz!"
