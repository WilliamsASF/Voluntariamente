// Tipos baseados nos schemas do backend
export interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  role?: string;
  password?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Professor {
  professor_id: number;
  user_id: number;
  full_name: string;
  vinculo?: string;
  departamento?: string;
}

export interface ProfessorCreate {
  user_id: number;
  full_name: string;
  vinculo?: string;
  departamento?: string;
}

export interface Estudante {
  student_id: number;
  user_id: number;
  full_name: string;
  vinculo?: string;
  curso?: string;
}

export interface EstudanteCreate {
  user_id: number;
  full_name: string;
  vinculo?: string;
  curso?: string;
}

export interface ONG {
  ngo_id: number;
  ngo_name: string;
  description?: string;
  email?: string;
  phone?: string;
}

export interface ONGCreate {
  ngo_name: string;
  description?: string;
  email?: string;
  phone?: string;
}

export interface Disciplina {
  disciplina_id: number;
  professor_id?: number;
  nome_disciplina: string;
  description?: string;
}

export interface DisciplinaCreate {
  professor_id?: number;
  nome_disciplina: string;
  description?: string;
}

export interface Projeto {
  project_id: number;
  disciplina_id: number;
  ngo_id: number;
  project_name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: string;
}

export interface ProjetoCreate {
  disciplina_id: number;
  ngo_id: number;
  project_name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: string;
}

export interface Task {
  task_id: number;
  project_id: number;
  task_name: string;
  description?: string;
  due_date?: string;
  status: string;
  priority: string;
}

export interface TaskCreate {
  project_id: number;
  task_name: string;
  description?: string;
  due_date?: string;
  status: string;
  priority: string;
}

export interface MatriculaProjeto {
  enrollment_id: number;
  student_id: number;
  project_id: number;
  enrollment_date: string;
  status: string;
}

export interface MatriculaProjetoCreate {
  student_id: number;
  project_id: number;
  enrollment_date: string;
  status: string;
}

export interface TaskEstudante {
  student_task_id: number;
  student_id: number;
  task_id: number;
  status: string;
  completion_date?: string;
  notes?: string;
}

export interface TaskEstudanteCreate {
  student_id: number;
  task_id: number;
  status: string;
  completion_date?: string;
  notes?: string;
}

// Tipos para formulários e UI
export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface TurmaForm {
  nome: string;
  etapas: Etapa[];
  alunos: AlunoSelecionado[];
}

export interface Etapa {
  id: number;
  nome: string;
  descricao: string;
}

export interface AlunoSelecionado {
  id: number;
  nome: string;
  email: string;
  selecionado: boolean;
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
