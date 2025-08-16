import { apiClient, authUtils } from '../api';
import { LoginForm, RegisterForm, Token, User } from '../types';

export class AuthService {
  // Login do usuário
  static async login(credentials: LoginForm): Promise<{ success: boolean; data?: Token; error?: string }> {
    try {
      // O backend espera form-data para login
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/token`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Credenciais inválidas');
      }

      const tokenData: Token = await response.json();
      
      // Salvar token no localStorage
      authUtils.setToken(tokenData.access_token);
      
      return { success: true, data: tokenData };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao fazer login' 
      };
    }
  }

  // Registro de usuário
  static async register(userData: RegisterForm): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await apiClient.post<User>('/users/', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao registrar usuário' 
      };
    }
  }

  // Logout
  static logout(): void {
    authUtils.removeToken();
    // Redirecionar para página de login
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // Verificar se usuário está autenticado
  static isAuthenticated(): boolean {
    return authUtils.isAuthenticated();
  }

  // Obter token atual
  static getToken(): string | null {
    return authUtils.getToken();
  }

  // Verificar se token é válido
  static async validateToken(): Promise<boolean> {
    try {
      const token = authUtils.getToken();
      if (!token) return false;

      const response = await apiClient.get<User>('/users/me');
      return !response.error;
    } catch {
      return false;
    }
  }

  // Obter dados do usuário atual
  static async getCurrentUser(): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await apiClient.get<User>('/users/me');
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao obter dados do usuário' 
      };
    }
  }
}
