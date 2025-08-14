# 🚀 Voluntariamente - Sistema de Gestão de Projetos

Sistema completo para gerenciamento de projetos voluntários entre estudantes e ONGs, com integração total entre frontend e backend.

## 🏗️ Arquitetura do Sistema

### Frontend (Next.js 15 + React 19)
- **Porta**: 3000
- **Tecnologias**: TypeScript, Tailwind CSS, Radix UI
- **Funcionalidades**: Interface moderna e responsiva para usuários

### Backend (FastAPI + SQLAlchemy)
- **Porta**: 8000
- **Tecnologias**: Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL
- **Funcionalidades**: API RESTful completa com autenticação JWT

### Banco de Dados
- **Sistema**: PostgreSQL 15
- **Porta**: 5432
- **Funcionalidades**: Armazenamento persistente de dados

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose instalados
- Git para clonar o repositório

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd Voluntariamente
```

### 2. Iniciar todo o ambiente
```bash
./start-dev.sh
```

Este comando irá:
- ✅ Verificar dependências
- 🐳 Construir e iniciar containers Docker
- 🔄 Configurar banco de dados
- 🚀 Iniciar backend e frontend
- 📊 Verificar status dos serviços

### 3. Acessar o sistema
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentação da API**: http://localhost:8000/docs

## 🧪 Testando a Integração

### Teste automático completo
```bash
./test-integration.sh
```

Este script testa:
- ✅ Status dos serviços
- 🔐 Endpoints da API
- 🌐 Páginas do frontend
- 🔗 Comunicação entre serviços

### Teste manual
1. Acesse http://localhost:3000
2. Cadastre um novo usuário
3. Faça login
4. Navegue pelas funcionalidades
5. Verifique se os dados são carregados do backend

## 📁 Estrutura do Projeto

```
Voluntariamente/
├── 📱 CInvolunt-rio-front/          # Frontend Next.js
│   ├── app/                         # Páginas da aplicação
│   ├── components/                  # Componentes reutilizáveis
│   ├── lib/                         # Serviços e configurações
│   │   ├── api.ts                   # Cliente HTTP base
│   │   ├── types.ts                 # Tipos TypeScript
│   │   └── services/                # Serviços específicos
│   │       ├── auth.ts              # Autenticação
│   │       ├── users.ts             # Usuários
│   │       ├── estudantes.ts        # Estudantes
│   │       └── projetos.ts          # Projetos
│   └── hooks/                       # Hooks personalizados
│       └── useAuth.ts               # Hook de autenticação
├── 🔧 backend/                      # Backend FastAPI
│   ├── app/                         # Aplicação principal
│   │   ├── routers/                 # Endpoints da API
│   │   ├── models.py                # Modelos do banco
│   │   ├── schemas.py               # Schemas Pydantic
│   │   └── database.py              # Configuração do banco
│   └── main.py                      # Ponto de entrada
├── 🗄️ 01-schema.sql                # Schema do banco
├── 🗄️ 02-populate.sql              # Dados iniciais
├── 🐳 docker-compose.dev.yml        # Configuração Docker para desenvolvimento
├── 🚀 start-dev.sh                  # Script de inicialização
└── 🧪 test-integration.sh           # Script de testes
```

## 🔌 Integração Frontend-Backend

### Sistema de Autenticação
- **JWT Tokens**: Autenticação segura com tokens
- **Context API**: Estado global de autenticação
- **Proteção de Rotas**: Componente `ProtectedRoute` para páginas privadas

### Comunicação de Dados
- **API Client**: Cliente HTTP centralizado com interceptors
- **Serviços Especializados**: Cada entidade tem seu próprio serviço
- **Tipagem Completa**: TypeScript sincronizado com schemas do backend

### Funcionalidades Integradas
- ✅ **Login/Logout**: Autenticação completa
- ✅ **Cadastro**: Registro de novos usuários
- ✅ **Dashboard**: Visualização de dados em tempo real
- ✅ **Gestão de Estudantes**: CRUD completo
- ✅ **Gestão de Projetos**: Criação e gerenciamento
- ✅ **Gestão de Turmas**: Organização de grupos

## 🛠️ Desenvolvimento

### Comandos úteis

#### Iniciar ambiente completo
```bash
./start-dev.sh
```

#### Parar todos os serviços
```bash
docker-compose -f docker-compose.dev.yml down
```

#### Ver logs em tempo real
```bash
# Backend
docker-compose -f docker-compose.dev.yml logs -f backend

# Frontend
docker-compose -f docker-compose.dev.yml logs -f frontend

# Banco de dados
docker-compose -f docker-compose.dev.yml logs -f postgres
```

#### Reiniciar serviços
```bash
docker-compose -f docker-compose.dev.yml restart
```

#### Acessar banco de dados
```bash
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d voluntariamente
```

### Estrutura de Desenvolvimento

#### Frontend
- **Hot Reload**: Alterações refletem automaticamente
- **TypeScript**: Tipagem estática para melhor desenvolvimento
- **Tailwind CSS**: Sistema de design consistente
- **Componentes**: Biblioteca de componentes reutilizáveis

#### Backend
- **Auto-reload**: Servidor reinicia automaticamente
- **Documentação automática**: Swagger UI em `/docs`
- **Validação**: Schemas Pydantic para validação de dados
- **Migrations**: Sistema de migração de banco

## 🔐 Segurança

- **JWT Authentication**: Tokens seguros com expiração
- **CORS Configurado**: Comunicação segura entre serviços
- **Validação de Dados**: Schemas Pydantic para entrada
- **Proteção de Rotas**: Middleware de autenticação

## 📊 Monitoramento

### Logs
- **Backend**: Logs detalhados de requisições e erros
- **Frontend**: Logs de console e erros de rede
- **Banco**: Logs de conexões e queries

### Métricas
- **Status dos serviços**: Verificação automática de saúde
- **Performance**: Tempo de resposta das APIs
- **Erros**: Captura e log de erros

## 🚀 Deploy

### Desenvolvimento
```bash
./start-dev.sh
```

### Produção
```bash
docker-compose -f docker-compose.yml up -d
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

- **Issues**: Reporte bugs e solicite features
- **Documentação**: Consulte a documentação da API em `/docs`
- **Logs**: Verifique logs para debugging

---

## ✨ Status do Sistema

- 🟢 **Frontend**: Funcionando na porta 3000
- 🟢 **Backend**: Funcionando na porta 8000
- 🟢 **Banco**: PostgreSQL configurado
- 🟢 **Integração**: Frontend e backend comunicando perfeitamente
- 🟢 **Autenticação**: Sistema JWT funcionando
- 🟢 **APIs**: Todos os endpoints respondendo

**🎯 O sistema está completamente integrado e funcionando!**