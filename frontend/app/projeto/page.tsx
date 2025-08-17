'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, Trash2, Calendar, Building } from 'lucide-react';
import { ProjetoService } from '../../lib/services/projetos';
import { Projeto } from '../../lib/types';
import Card, { CardHeader, CardContent } from '../../components/ui/card';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [novoProjeto, setNovoProjeto] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'ativo'
  });

  useEffect(() => {
    loadProjetos();
  }, []);

  const loadProjetos = async () => {
    try {
      setIsLoading(true);
      setError('');

      const result = await ProjetoService.getAllProjetos();

      if (result.success && result.data) {
        setProjetos(result.data);
      } else {
        setError(result.error || 'Erro ao carregar projetos');
      }
    } catch (error) {
      setError('Erro inesperado ao carregar projetos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProjeto = async () => {
    if (!novoProjeto.name.trim()) {
      setError('Nome do projeto é obrigatório');
      return;
    }

    try {
      const result = await ProjetoService.createProjeto(novoProjeto);

      if (result.success && result.data) {
        setProjetos([...projetos, result.data]);
        setNovoProjeto({
          name: '',
          description: '',
          start_date: '',
          end_date: '',
          status: 'ativo'
        });
        setShowForm(false);
        setError('');
      } else {
        setError(result.error || 'Erro ao criar projeto');
      }
    } catch (error) {
      setError('Erro inesperado ao criar projeto');
    }
  };

  const handleDeleteProjeto = async (projetoId: number) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        const result = await ProjetoService.deleteProjeto(projetoId);

        if (result.success) {
          setProjetos(projetos.filter(p => p.projeto_id !== projetoId));
        } else {
          setError(result.error || 'Erro ao excluir projeto');
        }
      } catch (error) {
        setError('Erro inesperado ao excluir projeto');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pendente':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'concluído':
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelado':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não definida';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando projetos...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Projetos</h1>
          <p className="text-gray-600 mt-2">
            Gerencie todos os projetos cadastrados no sistema
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {!showForm ? (
          <>
            {/* Lista de projetos */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Total: {projetos.length} projetos
              </div>
              <Button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
                variant="primary"
              >
                <Plus size={18} />
                Novo Projeto
              </Button>
            </div>

            {projetos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projetos.map((projeto) => (
                  <Card key={projeto.projeto_id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-xs text-gray-500">ID: {projeto.projeto_id}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {projeto.name}
                        </h3>
                        {projeto.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {projeto.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Início: {formatDate(projeto.start_date ?? '')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Fim: {formatDate(projeto.end_date ?? '')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(projeto.status ?? '')}`}>
                          {projeto.status || 'Status não definido'}
                        </span>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`/grupos/${projeto.projeto_id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProjeto(projeto.projeto_id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <Building className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum projeto cadastrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece criando seu primeiro projeto para organizar as atividades.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Formulário de novo projeto */
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Novo Projeto</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Projeto *
                </label>
                <Input
                  type="text"
                  placeholder="Digite o nome do projeto"
                  value={novoProjeto.name}
                  onChange={(e) => setNovoProjeto({ ...novoProjeto, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  placeholder="Descreva o projeto"
                  value={novoProjeto.description}
                  onChange={(e) => setNovoProjeto({ ...novoProjeto, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início
                  </label>
                  <Input
                    type="date"
                    value={novoProjeto.start_date}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, start_date: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Fim
                  </label>
                  <Input
                    type="date"
                    value={novoProjeto.end_date}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, end_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={novoProjeto.status}
                  onChange={(e) => setNovoProjeto({ ...novoProjeto, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="ativo">Ativo</option>
                  <option value="pendente">Pendente</option>
                  <option value="concluído">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleAddProjeto}
                className="w-full"
                variant="primary"
              >
                Criar Projeto
              </Button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}