import { apiClient } from '../api';
import { User, UserCreate, UserUpdate } from '../types';

export class UserService {
  // Obter todos os usuários (apenas para admins)
  static async getAllUsers(skip: number = 0, limit: number = 100): Promise<{ success: boolean; data?: User[]; error?: string }> {
    try {
      const response = await apiClient.get<User[]>(`/users/?skip=${skip}&limit=${limit}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter usuários' 
      };
    }
  }

  // Obter usuário por ID
  static async getUserById(userId: number): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await apiClient.get<User>(`/users/${userId}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter usuário' 
      };
    }
  }

  // Atualizar usuário
  static async updateUser(userId: number, userData: UserUpdate): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await apiClient.put<User>(`/users/${userId}`, userData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao atualizar usuário' 
      };
    }
  }

  // Deletar usuário
  static async deleteUser(userId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao deletar usuário' 
      };
    }
  }

  // Verificar se username está disponível
  static async checkUsernameAvailability(username: string): Promise<{ success: boolean; available: boolean; error?: string }> {
    try {
      // Tentar criar um usuário temporário para verificar disponibilidade
      const response = await apiClient.post('/users/', {
        username,
        email: 'temp@temp.com',
        password: 'temp123',
        role: 'Estudante'
      });

      // Se chegou aqui, o username não estava disponível
      return { success: true, available: false };
    } catch (error) {
      // Se deu erro de conflito, o username não está disponível
      if (error instanceof Error && error.message.includes('already registered')) {
        return { success: true, available: false };
      }
      // Se deu outro erro, assumimos que está disponível
      return { success: true, available: true };
    }
  }

  // Verificar se email está disponível
  static async checkEmailAvailability(email: string): Promise<{ success: boolean; available: boolean; error?: string }> {
    try {
      // Tentar criar um usuário temporário para verificar disponibilidade
      const response = await apiClient.post('/users/', {
        username: 'tempuser',
        email,
        password: 'temp123',
        role: 'Estudante'
      });

      // Se chegou aqui, o email não estava disponível
      return { success: true, available: false };
    } catch (error) {
      // Se deu erro de conflito, o email não está disponível
      if (error instanceof Error && error.message.includes('already registered')) {
        return { success: true, available: false };
      }
      // Se deu outro erro, assumimos que está disponível
      return { success: true, available: true };
    }
  }
}
