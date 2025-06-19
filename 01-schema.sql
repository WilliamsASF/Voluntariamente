-- Tabela Usuário (User)
CREATE TABLE "User" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Armazenar hashes de senhas, NUNCA texto plano!
    role VARCHAR(50) NOT NULL, -- Ex: 'Estudante', 'Professor', 'Admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Professor
CREATE TABLE Professor (
    professor_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    vinculo VARCHAR(255), -- Ex: 'Efetivo', 'Substituto'
    departamento VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Estudante
CREATE TABLE Estudante (
    student_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    vinculo VARCHAR(255), -- Ex: 'Matriculado', 'Voluntário'
    curso VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela ONG
CREATE TABLE ONG (
    ngo_id SERIAL PRIMARY KEY,
    ngo_name VARCHAR(255) NOT NULL, [cite: 1]
    description TEXT, [cite: 1]
    email VARCHAR(255), [cite: 1]
    phone VARCHAR(50), [cite: 1]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, [cite: 1]
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP [cite: 1]
);

-- Tabela Disciplina
CREATE TABLE Disciplina (
    disciplina_id SERIAL PRIMARY KEY,
    professor_id INTEGER REFERENCES Professor(professor_id), -- FK para o professor que leciona a disciplina
    nome_disciplina VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Projeto
CREATE TABLE Projeto (
    projeto_id SERIAL PRIMARY KEY,
    disciplina_id INTEGER REFERENCES Disciplina(disciplina_id),
    ngo_id INTEGER REFERENCES ONG(ngo_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50), -- Ex: 'Ideação', 'Em Andamento', 'Concluído'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Task (Tarefa)
CREATE TABLE Task (
    task_id SERIAL PRIMARY KEY,
    projeto_id INTEGER NOT NULL REFERENCES Projeto(projeto_id) ON DELETE CASCADE, -- Se o projeto for deletado, as tarefas também
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- Ex: 'Consultoria', 'Aplicação', 'Documentação'
    status VARCHAR(50), -- Ex: 'Pendente', 'Em Progresso', 'Concluída'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Junção: Matricula Projetos (para Estudante - Projeto)
CREATE TABLE Matricula_Projetos (
    matricula_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES Estudante(student_id) ON DELETE CASCADE,
    projeto_id INTEGER NOT NULL REFERENCES Projeto(projeto_id) ON DELETE CASCADE,
    matricula_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50), -- Ex: 'Ativo', 'Concluído', 'Abandonou'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, projeto_id) -- Garante que um estudante não se matricule no mesmo projeto mais de uma vez
);

-- Tabela de Junção: Task_estudante (para Estudante - Task)
CREATE TABLE Task_estudante (
    estud_task_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES Estudante(student_id) ON DELETE CASCADE,
    task_id INTEGER NOT NULL REFERENCES Task(task_id) ON DELETE CASCADE,
    assigned_date DATE,
    deadline_date DATE,
    status VARCHAR(50), -- Ex: 'Atribuída', 'Em Andamento', 'Concluída', 'Atrasada'
    description TEXT, -- Descrição específica da atribuição (opcional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, task_id) -- Garante que uma tarefa não seja atribuída ao mesmo estudante mais de uma vez
);

-- Índices para otimização de consultas em chaves estrangeiras
CREATE INDEX idx_professor_user_id ON Professor (user_id);
CREATE INDEX idx_estudante_user_id ON Estudante (user_id);
CREATE INDEX idx_disciplina_professor_id ON Disciplina (professor_id);
CREATE INDEX idx_projeto_disciplina_id ON Projeto (disciplina_id);
CREATE INDEX idx_projeto_ngo_id ON Projeto (ngo_id);
CREATE INDEX idx_task_projeto_id ON Task (projeto_id);
CREATE INDEX idx_matricula_projetos_student_id ON Matricula_Projetos (student_id);
CREATE INDEX idx_matricula_projetos_projeto_id ON Matricula_Projetos (projeto_id);
CREATE INDEX idx_task_estudante_student_id ON Task_estudante (student_id);
CREATE INDEX idx_task_estudante_task_id ON Task_estudante (task_id);

-- Funções para atualizar automaticamente 'updated_at'
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para as tabelas que possuem 'updated_at'
CREATE TRIGGER set_user_timestamp
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_professor_timestamp
BEFORE UPDATE ON Professor
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_estudante_timestamp
BEFORE UPDATE ON Estudante
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_ong_timestamp
BEFORE UPDATE ON ONG
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_disciplina_timestamp
BEFORE UPDATE ON Disciplina
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_projeto_timestamp
BEFORE UPDATE ON Projeto
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_task_timestamp
BEFORE UPDATE ON Task
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_matricula_projetos_timestamp
BEFORE UPDATE ON Matricula_Projetos
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER set_task_estudante_timestamp
BEFORE UPDATE ON Task_estudante
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();