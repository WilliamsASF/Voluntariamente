# Voluntariamente

### 1. Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados
- Acesso ao arquivo `.env` com as variáveis de ambiente do banco de dados

### 2. Subindo o banco de dados
```sh
docker-compose up -d
```
- Criar um container PostgreSQL na porta 5432
- Executar os scripts `01-schema.sql` (estrutura) e `02-populate.sql` (dados iniciais)

### 3. Acessando o banco de dados
Você pode acessar o banco de dados usando um cliente PostgreSQL, como o [DBeaver](https://dbeaver.io/) ou o [psql](https://www.postgresql.org/docs/current/app-psql.html):

- Host: `localhost`
- Porta: `5432`
- Usuário: conforme `.env`
- Senha: conforme `.env`
- Banco: conforme `.env`

Exemplo usando psql:
```sh
psql -h localhost -U seu_usuario_dev -d seu_banco_de_dados_dev
```
### 4. Estrutura do banco

O banco já possui as principais tabelas para usuários, professores, estudantes, ONGs, disciplinas, projetos, tarefas e matrículas. Veja os arquivos [`01-schema.sql`](01-schema.sql) e [`02-populate.sql`](02-populate.sql) para detalhes.

### 5. Reiniciando o banco

Se precisar resetar o banco (apagar tudo e recriar):
```sh
docker-compose down -v
docker-compose up -d
```