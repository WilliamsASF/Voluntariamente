import { apiClient } from '../api';
import { Projeto, ProjetoCreate } from '../types';

// Alinha com o backend: MatriculaProjetosRead
export interface MatriculaProjeto {
  matricula_id: number;
  student_id: number;
  projeto_id: number;
  matricula_date?: string;
  status?: string;
}

export class MatriculasService {
  static async getByProjetoId(projetoId: number): Promise<{ success: boolean; data?: MatriculaProjeto[]; error?: string }> {
    try {
      const res = await apiClient.get<MatriculaProjeto[]>(`/matriculas/project/${projetoId}`);
      if (res.error) throw new Error(res.error);
      return { success: true, data: res.data };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Erro ao obter matrículas do projeto' };
    }
  }
}

export class ProjetoService {
  // Obter todos os projetos
  static async getAllProjetos(): Promise<{ success: boolean; data?: Projeto[]; error?: string }> {
    try {
      const response = await apiClient.get<Projeto[]>('/projetos/');
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter projetos' 
      };
    }
  }

  // Obter projeto por ID
  static async getProjetoById(projetoId: number): Promise<{ success: boolean; data?: Projeto; error?: string }> {
    try {
      const response = await apiClient.get<Projeto>(`/projetos/${projetoId}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter projeto' 
      };
    }
  }

  // Criar novo projeto
  static async createProjeto(projetoData: ProjetoCreate): Promise<{ success: boolean; data?: Projeto; error?: string }> {
    try {
      const response = await apiClient.post<Projeto>('/projetos/', projetoData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao criar projeto' 
      };
    }
  }

  // Atualizar projeto
  static async updateProjeto(projetoId: number, projetoData: Partial<ProjetoCreate>): Promise<{ success: boolean; data?: Projeto; error?: string }> {
    try {
      const response = await apiClient.put<Projeto>(`/projetos/${projetoId}`, projetoData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao atualizar projeto' 
      };
    }
  }

  // Deletar projeto
  static async deleteProjeto(projetoId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.delete(`/projetos/${projetoId}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao deletar projeto' 
      };
    }
  }

  // Obter projetos por disciplina
  static async getProjetosByDisciplina(disciplinaId: number): Promise<{ success: boolean; data?: Projeto[]; error?: string }> {
    try {
      const response = await apiClient.get<Projeto[]>(`/projetos/?disciplina_id=${disciplinaId}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter projetos da disciplina' 
      };
    }
  }

  // Obter projetos por ONG
  static async getProjetosByONG(ongId: number): Promise<{ success: boolean; data?: Projeto[]; error?: string }> {
    try {
      const response = await apiClient.get<Projeto[]>(`/projetos/?ngo_id=${ongId}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter projetos da ONG' 
      };
    }
  }

  // Obter projetos por status
  static async getProjetosByStatus(status: string): Promise<{ success: boolean; data?: Projeto[]; error?: string }> {
    try {
      const response = await apiClient.get<Projeto[]>(`/projetos/?status=${status}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter projetos por status' 
      };
    }
  }
}
