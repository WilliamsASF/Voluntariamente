INSERT INTO "User" (username, email, password, role) VALUES
('joao.estudante', 'joao.silva@aluno.com', 'hash_senha_joao', 'Estudante'),
('maria.professora', 'maria.souza@professor.com', 'hash_senha_maria', 'Professor'),
('pedro.estudante', 'pedro.costa@aluno.com', 'hash_senha_pedro', 'Estudante'),
('ana.professora', 'ana.lima@professor.com', 'hash_senha_ana', 'Professor'),
('ong_user', 'contato@ong_feliz.org', 'hash_senha_ong', 'ONG_Admin'); -- Exemplo de usuário para ONG, se necessário

INSERT INTO Professor (user_id, full_name, vinculo, departamento) VALUES
((SELECT user_id FROM "User" WHERE username = 'maria.professora'), 'Maria Souza', 'Efetivo', 'Ciência da Computação'),
((SELECT user_id FROM "User" WHERE username = 'ana.professora'), 'Ana Lima', 'Substituto', 'Serviço Social');

INSERT INTO Estudante (user_id, full_name, vinculo, curso) VALUES
((SELECT user_id FROM "User" WHERE username = 'joao.estudante'), 'João Silva', 'Matriculado', 'Engenharia de Software'),
((SELECT user_id FROM "User" WHERE username = 'pedro.estudante'), 'Pedro Costa', 'Matriculado', 'Jornalismo');

INSERT INTO ONG (ngo_name, description, email, phone, area_atuacao, created_at, updated_at) VALUES
('ONG Amigos da Natureza', 'Proteção ambiental e conscientização.', 'contato@amigosdanatureza.org', '11987654321', 'Meio Ambiente', '2023-01-15 10:00:00', '2024-05-20 14:30:00'),
('Casa do Saber', 'Apoio educacional para crianças carentes.', 'info@casadosaber.org', '21998765432', 'Educação', '2022-03-01 09:00:00', '2024-06-10 11:00:00');

INSERT INTO Disciplina (professor_id, nome_disciplina, description) VALUES
((SELECT professor_id FROM Professor WHERE full_name = 'Maria Souza'), 'Desenvolvimento Ágil', 'Metodologias ágeis para software.'),
((SELECT professor_id FROM Professor WHERE full_name = 'Ana Lima'), 'Design Thinking Aplicado', 'Aplicação de Design Thinking em projetos sociais.');

INSERT INTO Projeto (disciplina_id, ngo_id, name, description, start_date, end_date, status) VALUES
((SELECT disciplina_id FROM Disciplina WHERE nome_disciplina = 'Design Thinking Aplicado'), (SELECT ngo_id FROM ONG WHERE ngo_name = 'ONG Amigos da Natureza'), 'Mapeamento de Necessidades Digitais', 'Mapear as necessidades de digitalização da ONG Amigos da Natureza.', '2024-06-01', '2024-07-30', 'Em Andamento'),
((SELECT disciplina_id FROM Disciplina WHERE nome_disciplina = 'Desenvolvimento Ágil'), (SELECT ngo_id FROM ONG WHERE ngo_name = 'Casa do Saber'), 'Sistema de Gestão de Voluntários', 'Desenvolver um protótipo de sistema para gerenciar voluntários da Casa do Saber.', '2024-07-01', '2024-10-31', 'Ideação');

INSERT INTO Task (projeto_id, name, description, type, status) VALUES
((SELECT projeto_id FROM Projeto WHERE name = 'Mapeamento de Necessidades Digitais'), 'Entrevista com Coordenadores', 'Realizar entrevistas para entender os processos atuais.', 'Consultoria', 'Pendente'),
((SELECT projeto_id FROM Projeto WHERE name = 'Mapeamento de Necessidades Digitais'), 'Análise de Fluxo de Trabalho', 'Documentar o fluxo de trabalho atual da ONG.', 'Consultoria', 'Em Progresso'),
((SELECT projeto_id FROM Projeto WHERE name = 'Sistema de Gestão de Voluntários'), 'Levantamento de Requisitos', 'Pesquisar os requisitos para o sistema de gestão.', 'Aplicação', 'Pendente');

INSERT INTO Matricula_Projetos (student_id, projeto_id, matricula_date, status) VALUES
((SELECT student_id FROM Estudante WHERE full_name = 'João Silva'), (SELECT projeto_id FROM Projeto WHERE name = 'Mapeamento de Necessidades Digitais'), '2024-06-05', 'Ativo'),
((SELECT student_id FROM Estudante WHERE full_name = 'Pedro Costa'), (SELECT projeto_id FROM Projeto WHERE name = 'Mapeamento de Necessidades Digitais'), '2024-06-05', 'Ativo');

INSERT INTO Task_estudante (student_id, task_id, assigned_date, deadline_date, status, description) VALUES
((SELECT student_id FROM Estudante WHERE full_name = 'João Silva'), (SELECT task_id FROM Task WHERE name = 'Entrevista com Coordenadores'), '2024-06-10', '2024-06-15', 'Atribuída', 'Realizar entrevistas com a coordenação da ONG.'),
((SELECT student_id FROM Estudante WHERE full_name = 'Pedro Costa'), (SELECT task_id FROM Task WHERE name = 'Análise de Fluxo de Trabalho'), '2024-06-12', '2024-06-20', 'Atribuída', 'Analisar e documentar o fluxo de processos.');