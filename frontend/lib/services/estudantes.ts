import { apiClient } from '../api';
import { Estudante, EstudanteCreate } from '../types';

export class EstudanteService {
  // Obter todos os estudantes
  static async getAllEstudantes(): Promise<{ success: boolean; data?: Estudante[]; error?: string }> {
    try {
      const response = await apiClient.get<Estudante[]>('/estudantes/');
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter estudantes' 
      };
    }
  }

  // Obter estudante por ID
  static async getEstudanteById(estudanteId: number): Promise<{ success: boolean; data?: Estudante; error?: string }> {
    try {
      const response = await apiClient.get<Estudante>(`/estudantes/${estudanteId}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter estudante' 
      };
    }
  }

  // Criar novo estudante
  static async createEstudante(estudanteData: EstudanteCreate): Promise<{ success: boolean; data?: Estudante; error?: string }> {
    try {
      const response = await apiClient.post<Estudante>('/estudantes/', estudanteData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao criar estudante' 
      };
    }
  }

  // Atualizar estudante
  static async updateEstudante(estudanteId: number, estudanteData: Partial<EstudanteCreate>): Promise<{ success: boolean; data?: Estudante; error?: string }> {
    try {
      const response = await apiClient.put<Estudante>(`/estudantes/${estudanteId}`, estudanteData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao atualizar estudante' 
      };
    }
  }

  // Deletar estudante
  static async deleteEstudante(estudanteId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.delete(`/estudantes/${estudanteId}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao deletar estudante' 
      };
    }
  }

  // Obter estudantes por curso
  static async getEstudantesByCurso(curso: string): Promise<{ success: boolean; data?: Estudante[]; error?: string }> {
    try {
      const response = await apiClient.get<Estudante[]>(`/estudantes/?curso=${curso}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter estudantes do curso' 
      };
    }
  }

  // Obter estudantes por vínculo
  static async getEstudantesByVinculo(vinculo: string): Promise<{ success: boolean; data?: Estudante[]; error?: string }> {
    try {
      const response = await apiClient.get<Estudante[]>(`/estudantes/?vinculo=${vinculo}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter estudantes por vínculo' 
      };
    }
  }

  // Buscar estudantes por nome
  static async searchEstudantesByName(nome: string): Promise<{ success: boolean; data?: Estudante[]; error?: string }> {
    try {
      const response = await apiClient.get<Estudante[]>(`/estudantes/?full_name=${nome}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao buscar estudantes por nome' 
      };
    }
  }
}
