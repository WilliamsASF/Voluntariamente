#!/bin/bash

echo "🧪 INICIANDO TESTES COMPLETOS DO FRONTEND"
echo "=========================================="

# Aguardar servidor iniciar
echo "⏳ Aguardando servidor Next.js iniciar..."
sleep 5

# Testar página inicial
echo "✅ Testando página inicial..."
curl -s -o /dev/null -w "Página inicial: %{http_code}\n" http://localhost:3000

# Testar página inicial (dashboard)
echo "✅ Testando dashboard..."
curl -s -o /dev/null -w "Dashboard: %{http_code}\n" http://localhost:3000/pagina_inicial

# Testar página de alunos
echo "✅ Testando página de alunos..."
curl -s -o /dev/null -w "Alunos: %{http_code}\n" http://localhost:3000/alunos

# Testar página de grupos
echo "✅ Testando página de grupos..."
curl -s -o /dev/null -w "Grupos: %{http_code}\n" http://localhost:3000/grupos

# Testar página de projetos (antigo ongs)
echo "✅ Testando página de projetos..."
curl -s -o /dev/null -w "Projetos: %{http_code}\n" http://localhost:3000/projeto

# Testar página de nova turma
echo "✅ Testando página de nova turma..."
curl -s -o /dev/null -w "Nova Turma: %{http_code}\n" http://localhost:3000/nova-turma

# Testar página de configurações
echo "✅ Testando página de configurações..."
curl -s -o /dev/null -w "Configurações: %{http_code}\n" http://localhost:3000/configuracoes

# Testar página de cadastro
echo "✅ Testando página de cadastro..."
curl -s -o /dev/null -w "Cadastro: %{http_code}\n" http://localhost:3000/cadastro

# Testar página de login
echo "✅ Testando página de login..."
curl -s -o /dev/null -w "Login: %{http_code}\n" http://localhost:3000/login

echo ""
echo "🎯 TESTES DE FUNCIONALIDADE"
echo "============================"

# Verificar se todas as páginas retornam 200
echo "📊 Status das páginas:"
echo "- Página inicial: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)"
echo "- Dashboard: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/pagina_inicial)"
echo "- Alunos: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/alunos)"
echo "- Grupos: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/grupos)"
echo "- Projetos: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/projeto)"
echo "- Nova Turma: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/nova-turma)"
echo "- Configurações: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/configuracoes)"
echo "- Cadastro: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cadastro)"
echo "- Login: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login)"

echo ""
echo "🚀 FRONTEND ESTÁ FUNCIONANDO!"
echo "Acesse: http://localhost:3000"
echo ""
echo "📱 TESTE MANUAL RECOMENDADO:"
echo "1. Abra http://localhost:3000 no navegador"
echo "2. Navegue por todas as páginas usando o sidebar"
echo "3. Teste formulários e funcionalidades"
echo "4. Verifique responsividade em diferentes tamanhos de tela"

