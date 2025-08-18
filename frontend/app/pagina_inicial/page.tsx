'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { EstudanteService } from '../../lib/services/estudantes';
import { ProjetoService } from '../../lib/services/projetos';
import { Projeto } from '../../lib/types';

export default function PaginaInicial() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [totalAlunos, setTotalAlunos] = useState(0);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);

        // Carregar estudantes
        const estudantesResult = await EstudanteService.getAllEstudantes();
        if (estudantesResult.success && estudantesResult.data) {
          setTotalAlunos(estudantesResult.data.length);
        }

        // Carregar projetos
        const projetosResult = await ProjetoService.getAllProjetos();
        if (projetosResult.success && projetosResult.data) {
          setProjetos(projetosResult.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Olá, {user?.username || 'Usuário'}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900">Total de Alunos</h3>
                <p className="text-3xl font-bold text-red-600">{totalAlunos}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900">Projetos Ativos</h3>
                <p className="text-3xl font-bold text-blue-600">{projetos.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900">Turmas Criadas</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
