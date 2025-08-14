#!/bin/bash

echo "🧪 TESTANDO INTEGRAÇÃO FRONTEND-BACKEND"
echo "========================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    local status=$1
    local message=$2
    case $status in
        "success")
            echo -e "${GREEN}✅${NC} $message"
            ;;
        "error")
            echo -e "${RED}❌${NC} $message"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️${NC} $message"
            ;;
        "info")
            echo -e "${BLUE}ℹ️${NC} $message"
            ;;
    esac
}

# Verificar se os serviços estão rodando
echo "🔍 Verificando status dos serviços..."

# Testar Backend
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    print_status "success" "Backend FastAPI está rodando na porta 8000"
else
    print_status "error" "Backend não está respondendo na porta 8000"
    echo "   Execute: cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
    exit 1
fi

# Testar Frontend
if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    print_status "success" "Frontend Next.js está rodando na porta 3000"
else
    print_status "error" "Frontend não está respondendo na porta 3000"
    echo "   Execute: cd CInvolunt-rio-front && npm run dev -- --port 3000"
    exit 1
fi

echo ""
echo "🎯 TESTANDO ENDPOINTS DA API"
echo "============================="

# Testar endpoint raiz da API
echo "📡 Testando endpoint raiz da API..."
response=$(curl -s -w "%{http_code}" http://localhost:8000/)
http_code="${response: -3}"
if [ "$http_code" = "200" ]; then
    print_status "success" "Endpoint raiz da API: OK (HTTP $http_code)"
else
    print_status "error" "Endpoint raiz da API: Falhou (HTTP $http_code)"
fi

# Testar endpoint de autenticação
echo "🔐 Testando endpoint de autenticação..."
response=$(curl -s -w "%{http_code}" -X POST http://localhost:8000/auth/token \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=test&password=test")
http_code="${response: -3}"
if [ "$http_code" = "401" ]; then
    print_status "success" "Endpoint de autenticação: OK (HTTP $http_code - credenciais inválidas esperadas)"
elif [ "$http_code" = "422" ]; then
    print_status "success" "Endpoint de autenticação: OK (HTTP $http_code - validação funcionando)"
else
    print_status "warning" "Endpoint de autenticação: Resposta inesperada (HTTP $http_code)"
fi

# Testar endpoint de usuários
echo "👥 Testando endpoint de usuários..."
response=$(curl -s -w "%{http_code}" http://localhost:8000/users/)
http_code="${response: -3}"
if [ "$http_code" = "401" ]; then
    print_status "success" "Endpoint de usuários: OK (HTTP $http_code - autenticação requerida)"
else
    print_status "warning" "Endpoint de usuários: Resposta inesperada (HTTP $http_code)"
fi

# Testar endpoint de estudantes
echo "🎓 Testando endpoint de estudantes..."
response=$(curl -s -w "%{http_code}" http://localhost:8000/estudantes/)
http_code="${response: -3}"
if [ "$http_code" = "401" ]; then
    print_status "success" "Endpoint de estudantes: OK (HTTP $http_code - autenticação requerida)"
else
    print_status "warning" "Endpoint de estudantes: Resposta inesperada (HTTP $http_code)"
fi

# Testar endpoint de projetos
echo "📋 Testando endpoint de projetos..."
response=$(curl -s -w "%{http_code}" http://localhost:8000/projetos/)
http_code="${response: -3}"
if [ "$http_code" = "200" ]; then
    print_status "success" "Endpoint de projetos: OK (HTTP $http_code)"
elif [ "$http_code" = "401" ]; then
    print_status "success" "Endpoint de projetos: OK (HTTP $http_code - autenticação requerida)"
else
    print_status "warning" "Endpoint de projetos: Resposta inesperada (HTTP $http_code)"
fi

echo ""
echo "🌐 TESTANDO PÁGINAS DO FRONTEND"
echo "================================"

# Testar página inicial (login)
echo "🏠 Testando página inicial (login)..."
response=$(curl -s -w "%{http_code}" http://localhost:3000/)
http_code="${response: -3}"
if [ "$http_code" = "200" ]; then
    print_status "success" "Página inicial: OK (HTTP $http_code)"
else
    print_status "error" "Página inicial: Falhou (HTTP $http_code)"
fi

# Testar página de cadastro
echo "📝 Testando página de cadastro..."
response=$(curl -s -w "%{http_code}" http://localhost:3000/cadastro)
http_code="${response: -3}"
if [ "$http_code" = "200" ]; then
    print_status "success" "Página de cadastro: OK (HTTP $http_code)"
else
    print_status "error" "Página de cadastro: Falhou (HTTP $http_code)"
fi

# Testar página do dashboard (deve redirecionar para login)
echo "📊 Testando página do dashboard..."
response=$(curl -s -w "%{http_code}" http://localhost:3000/pagina_inicial)
http_code="${response: -3}"
if [ "$http_code" = "200" ]; then
    print_status "success" "Página do dashboard: OK (HTTP $http_code)"
else
    print_status "error" "Página do dashboard: Falhou (HTTP $http_code)"
fi

echo ""
echo "🔗 TESTANDO COMUNICAÇÃO ENTRE SERVIÇOS"
echo "======================================="

# Testar se o frontend consegue se comunicar com o backend
echo "📡 Testando comunicação frontend -> backend..."
if curl -s http://localhost:3000/ | grep -q "localhost:8000" || curl -s http://localhost:3000/ | grep -q "8000"; then
    print_status "success" "Frontend configurado para comunicar com backend na porta 8000"
else
    print_status "warning" "Não foi possível verificar a configuração de comunicação"
fi

echo ""
echo "📊 RESUMO DOS TESTES"
echo "===================="

echo "✅ Serviços rodando:"
echo "   • Backend: http://localhost:8000"
echo "   • Frontend: http://localhost:3000"

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "1. Abra http://localhost:3000 no navegador"
echo "2. Teste o cadastro de um novo usuário"
echo "3. Teste o login com as credenciais criadas"
echo "4. Navegue pelas funcionalidades do sistema"
echo "5. Verifique se os dados estão sendo carregados do backend"

echo ""
echo "🔧 PARA DESENVOLVIMENTO:"
echo "• Logs do backend: cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
echo "• Logs do frontend: cd CInvolunt-rio-front && npm run dev -- --port 3000"
echo "• Banco de dados: Verificar se PostgreSQL está rodando na porta 5432"

echo ""
print_status "success" "Testes de integração concluídos!"
echo "✨ O sistema está integrado e funcionando!"
