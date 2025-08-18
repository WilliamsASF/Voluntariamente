'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface User {
  user_id: number;
  username: string;
  email: string;
  role: 'aluno' | 'professor';
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isDevBypass = process.env.NODE_ENV === 'development';

  // Mock users for development
  const mockUsers = [
    {
      user_id: 1,
      username: 'professor1',
      email: 'professor@cin.ufpe.br',
      role: 'professor' as const,
      name: 'João Silva',
      password: '123456'
    },
    {
      user_id: 2,
      username: 'aluno1',
      email: 'aluno@cin.ufpe.br',
      role: 'aluno' as const,
      name: 'Maria Santos',
      password: '123456'
    }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      if (isDevBypass) {
        // Check if there's a stored user in development
        const storedUser = localStorage.getItem('devUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
        setIsLoading(false);
        return;
      }

      // Check for valid token in production
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await fetchUserData(token);
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [isDevBypass]);

  const fetchUserData = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    if (isDevBypass) {
      // Mock login for development
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      if (mockUser) {
        const { password: _, ...userData } = mockUser;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('devUser', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: 'Email ou senha incorretos' };
      }
    }

    try {
      setIsLoading(true);
      
      // Login API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        
        // Fetch user data
        const userData = await fetchUserData(data.token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, error: 'Erro ao obter dados do usuário' };
        }
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          return { success: false, error: 'Email ou senha incorretos' };
        } else if (response.status === 400) {
          return { success: false, error: 'Email inválido' };
        } else {
          return { success: false, error: errorData.message || 'Erro no login' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('devUser');
    
    if (!isDevBypass) {
      // Call logout API in production
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(console.error);
    }
    
    window.location.href = '/';
  };

                const register = async (userData: any) => {
                if (isDevBypass) {
                  // Mock registration for development
                  const newUser = {
                    user_id: Date.now(),
                    ...userData,
                    password: undefined
                  };
                  // Add to mockUsers with password for login testing
                  mockUsers.push({ ...userData, user_id: newUser.user_id });

                  // If user is registered as 'aluno', add them to the global students list
                  if (userData.role === 'aluno') {
                    const globalStudents = JSON.parse(localStorage.getItem('globalStudents') || '[]');
                    const newStudent = {
                      id: newUser.user_id.toString(),
                      name: userData.name || userData.username,
                      email: userData.email,
                      profilePicture: undefined
                    };
                    globalStudents.push(newStudent);
                    localStorage.setItem('globalStudents', JSON.stringify(globalStudents));
                  }

                  // Auto-login after successful registration in development
                  setUser(newUser);
                  setIsAuthenticated(true);
                  localStorage.setItem('devUser', JSON.stringify(newUser));
                  return { success: true };
                }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Erro no registro' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
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
