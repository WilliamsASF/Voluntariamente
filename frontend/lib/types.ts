// Tipos baseados nos schemas do backend
export interface User {
  user_id: number;
  username: string;
  email: string;
  role: 'aluno' | 'professor';
  name: string;
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
  projeto_id: number;
  disciplina_id?: number;
  ngo_id?: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export interface ProjetoCreate {
  disciplina_id?: number;
  ngo_id?: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
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
  matricula_id: number;
  student_id: number;
  projeto_id: number;
  matricula_date?: string;
  status?: string;
}

export interface MatriculaProjetoCreate {
  student_id: number;
  projeto_id: number;
  matricula_date?: string;
  status?: string;
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

export interface Student {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface Document {
  id: string;
  title: string;
  stage: string;
  fileUrl?: string;
  uploadedAt: string;
}

export interface Deliverable {
  stage: string;
  status: 'completed' | 'pending' | 'rejected';
  completedAt?: string;
}

export interface Group {
  id: string;
  name: string;
  ngoName: string;
  problemDescription: string;
  category: string;
  students: Student[];
  documents: Document[];
  deliverables: Deliverable[];
  assignedProjects: string[]; // Array of project IDs assigned to this group
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  stages: Array<{ id: string; name: string; description: string }>;
  createdAt: string;
  assignedToGroup?: string; // ID of the group this project is assigned to
}

export interface Turma {
  id: string;
  title: string;
  subtitle: string;
  instructor: string;
  instructorImage: string;
  headerColor: string;
  year: string;
  coverImage?: string;
  students: Student[];
  groups: Group[];
  projects: Project[];
}
