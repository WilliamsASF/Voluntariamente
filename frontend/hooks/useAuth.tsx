'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AuthService } from '../lib/services/auth';
import { User } from '../lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um token válido ao carregar a página
    const checkAuth = async () => {
      try {
        const token = AuthService.getToken();
        if (token) {
          const isValid = await AuthService.validateToken();
          if (isValid) {
            const userResult = await AuthService.getCurrentUser();
            if (userResult.success && userResult.data) {
              setUser(userResult.data);
              setIsAuthenticated(true);
            } else {
              // Token inválido, limpar
              AuthService.logout();
            }
          } else {
            // Token inválido, limpar
            AuthService.logout();
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await AuthService.login({ username, password });
      
      if (result.success && result.data) {
        // Obter dados do usuário após login bem-sucedido
        const userResult = await AuthService.getCurrentUser();
        if (userResult.success && userResult.data) {
          setUser(userResult.data);
          setIsAuthenticated(true);
        }
      }
      
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao fazer login' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const result = await AuthService.register(userData);
      
      if (result.success && result.data) {
        // Após registro bem-sucedido, fazer login automático
        const loginResult = await login(userData.username, userData.password);
        return loginResult;
      }
      
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao registrar usuário' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
