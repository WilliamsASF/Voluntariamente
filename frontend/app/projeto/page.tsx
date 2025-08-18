'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, Trash2, Calendar, Building, X, FileText, Clock, Tag } from 'lucide-react';
import { ProjetoService } from '../../lib/services/projetos';
import { Projeto, Turma as UITurma, Group as UIGroup, Project as UIProject } from '../../lib/types';
import Card, { CardHeader, CardContent } from '../../components/ui/card';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Textarea from '../../components/ui/textarea';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [novoProjeto, setNovoProjeto] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'ativo'
  });

  const [stages, setStages] = useState([
    { id: '1', name: 'Etapa 1', description: 'Descrição da Etapa 1' },
    { id: '2', name: 'Etapa 2', description: 'Descrição da Etapa 2' },
    { id: '3', name: 'Etapa 3', description: 'Descrição da Etapa 3' },
    { id: '4', name: 'Etapa 4', description: 'Descrição da Etapa 4' }
  ]);

  // Local turmas/groups (from localStorage) for assigning projects to groups
  const [turmasStore, setTurmasStore] = useState<UITurma[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadProjetos();
    // load turmas from localStorage for group assignment UI
    try {
      const savedTurmas = typeof window !== 'undefined' ? localStorage.getItem('turmas') : null;
      if (savedTurmas) {
        setTurmasStore(JSON.parse(savedTurmas));
      }
    } catch {
      // ignore
    }
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

        // Assign created project to selected groups (localStorage turmas)
        try {
          const projectIdStr = String(result.data.projeto_id);
          const localProject: UIProject = {
            id: projectIdStr,
            name: novoProjeto.name,
            description: novoProjeto.description || '',
            stages: stages.map((s) => ({ id: s.id, name: s.name, description: s.description })),
            createdAt: new Date().toISOString(),
          };

          const updatedTurmas: UITurma[] = (turmasStore || []).map((turma) => {
            const turmaHasSelected = (turma.groups || []).some((g) => selectedGroups.has(g.id));
            if (!turmaHasSelected) return turma;

            const updatedGroups: UIGroup[] = (turma.groups || []).map((g) => {
              if (!selectedGroups.has(g.id)) return g;
              const assigned = Array.isArray(g.assignedProjects) ? g.assignedProjects : [];
              if (assigned.includes(projectIdStr)) return g;
              return { ...g, assignedProjects: [...assigned, projectIdStr] };
            });

            const projects = Array.isArray(turma.projects) ? turma.projects : [];
            const hasProject = projects.some((p) => p.id === projectIdStr);
            const updatedProjects = hasProject ? projects : [...projects, localProject];

            return { ...turma, groups: updatedGroups, projects: updatedProjects };
          });

          setTurmasStore(updatedTurmas);
          localStorage.setItem('turmas', JSON.stringify(updatedTurmas));
        } catch {
          // ignore assignment failures silently for now
        }

        setNovoProjeto({
          name: '',
          description: '',
          start_date: '',
          end_date: '',
          status: 'ativo'
        });
        setStages([
          { id: '1', name: 'Etapa 1', description: 'Descrição da Etapa 1' },
          { id: '2', name: 'Etapa 2', description: 'Descrição da Etapa 2' },
          { id: '3', name: 'Etapa 3', description: 'Descrição da Etapa 3' },
          { id: '4', name: 'Etapa 4', description: 'Descrição da Etapa 4' }
        ]);
        setSelectedGroups(new Set());
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

  const handleViewDetails = (projeto: Projeto) => {
    setSelectedProjeto(projeto);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedProjeto(null);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não definida';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const addStage = () => {
    const newStage = {
      id: Date.now().toString(),
      name: `Etapa ${stages.length + 1}`,
      description: 'Descrição da nova etapa'
    };
    setStages([...stages, newStage]);
  };

  const removeStage = (id: string) => {
    if (stages.length > 1) {
      setStages(stages.filter(stage => stage.id !== id));
    }
  };

  const updateStage = (id: string, field: 'name' | 'description', value: string) => {
    setStages(stages.map(stage => 
      stage.id === id ? { ...stage, [field]: value } : stage
    ));
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId); else next.add(groupId);
      return next;
    });
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Projetos</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Gerencie todos os projetos cadastrados no sistema
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base">
            {error}
          </div>
        )}

        {!showForm ? (
          /* Lista de projetos */
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div className="text-sm text-gray-600">
                Total: {projetos.length} projetos
              </div>

              <Button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Plus size={18} />
                Novo Projeto
              </Button>
            </div>

            {projetos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {projetos.map((projeto) => (
                  <Card key={projeto.projeto_id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <span className="text-xs text-gray-500">ID: {projeto.projeto_id}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                            {projeto.name}
                          </h3>
                          {projeto.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {projeto.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">Início: {formatDate(projeto.start_date)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">Fim: {formatDate(projeto.end_date)}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(projeto.status || '')}`}>
                            {projeto.status || 'Status não definido'}
                          </span>
                          
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button 
                              variant="default" 
                              onClick={() => handleViewDetails(projeto)}
                              className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button 
                              variant="default" 
                              onClick={() => handleDeleteProjeto(projeto.projeto_id)}
                              className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center">
                <Building className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum projeto cadastrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece criando seu primeiro projeto para organizar as atividades.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Formulário de novo projeto */
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col max-h-[80vh] overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Novo Projeto</h2>
                <Button 
                  variant="default"
                  onClick={() => setShowForm(false)}
                  className="text-gray-600 hover:text-gray-800 w-full sm:w-auto"
                >
                  Cancelar
                </Button>
              </div>
              
              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Projeto *
                  </label>
                  <Input
                    label=""
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Início
                    </label>
                    <Input
                      label=""
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
                      label=""
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

                {/* Stages Section */}
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                    <label className="block text-sm font-medium text-gray-700">
                      Etapas do Projeto
                    </label>
                    <Button
                      onClick={addStage}
                      variant="default"
                      className="text-xs px-3 py-1 h-auto bg-blue-100 text-blue-700 hover:bg-blue-200 w-full sm:w-auto"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar Etapa
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {stages.map((stage, index) => (
                      <div key={stage.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">Etapa {index + 1}</span>
                          {stages.length > 1 && (
                            <Button
                              onClick={() => removeStage(stage.id)}
                              variant="default"
                              className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            label=""
                            value={stage.name}
                            onChange={(e) => updateStage(stage.id, 'name', e.target.value)}
                            placeholder="Nome da etapa"
                            className="bg-white border border-gray-200 text-sm"
                          />
                          <Textarea
                            value={stage.description}
                            onChange={(e) => updateStage(stage.id, 'description', e.target.value)}
                            placeholder="Descrição da etapa"
                            className="bg-white border border-gray-200 min-h-[40px] resize-none text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assign to Groups (optional) */}
                {turmasStore.length > 0 && (
                  <div>
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Atribuir a grupos (opcional)</h3>
                      <p className="text-xs text-gray-500">Selecione os grupos das turmas que receberão este projeto</p>
                    </div>
                    <div className="space-y-4">
                      {turmasStore.map((turma) => (
                        <div key={turma.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="font-medium text-gray-800 text-sm mb-2">{turma.title}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(turma.groups || []).map((group) => (
                              <label key={group.id} className="flex items-center gap-2 text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4"
                                  checked={selectedGroups.has(group.id)}
                                  onChange={() => toggleGroupSelection(group.id)}
                                />
                                <span className="text-gray-800">{group.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 shrink-0">
                <Button 
                  onClick={handleAddProjeto}
                  className="w-full"
                >
                  Criar Projeto
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Project Details Modal */}
        {showDetails && selectedProjeto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-2 sm:mx-0">
              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 gap-3 sm:gap-0">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                    <Building className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{selectedProjeto.name}</span>
                  </h2>
                  <p className="text-gray-600 mt-1">Detalhes do Projeto</p>
                </div>
                <Button
                  onClick={closeDetails}
                  variant="default"
                  className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)]">
                <div className="space-y-4 sm:space-y-6">
                  {/* Project Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <Card className="p-3 sm:p-4 bg-blue-50 border-blue-200">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-blue-700">Status</p>
                          <p className={`text-sm sm:text-lg font-semibold ${getStatusColor(selectedProjeto.status || '')} truncate`}>
                            {selectedProjeto.status || 'Não definido'}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 sm:p-4 bg-green-50 border-green-200">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-green-700">Data de Início</p>
                          <p className="text-sm sm:text-lg font-semibold text-green-800 truncate">
                            {formatDate(selectedProjeto.start_date)}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3 sm:p-4 bg-purple-50 border-purple-200 sm:col-span-2 lg:col-span-1">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-purple-700">Data de Fim</p>
                          <p className="text-sm sm:text-lg font-semibold text-purple-800 truncate">
                            {formatDate(selectedProjeto.end_date)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Project Description */}
                  {selectedProjeto.description && (
                    <Card className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        Descrição do Projeto
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{selectedProjeto.description}</p>
                    </Card>
                  )}

                  {/* Project Stages */}
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      Etapas do Projeto
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {stages.map((stage, index) => (
                        <div key={stage.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-semibold text-xs sm:text-sm">{index + 1}</span>
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{stage.name}</h4>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">{stage.description}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Assigned Groups */}
                  {turmasStore.length > 0 && (
                    <Card className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Building className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        Grupos Atribuídos
                      </h3>
                      <div className="space-y-3">
                        {turmasStore.map((turma) => (
                          <div key={turma.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                            <h4 className="font-medium text-gray-800 text-sm sm:text-base mb-2">{turma.title}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(turma.groups || []).map((group) => (
                                <div
                                  key={group.id}
                                  className={`p-2 sm:p-3 rounded-md border ${
                                    selectedGroups.has(group.id)
                                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                                      : 'bg-gray-50 border-gray-200 text-gray-600'
                                  }`}
                                >
                                  <span className="text-xs sm:text-sm font-medium truncate block">{group.name}</span>
                                  {selectedGroups.has(group.id) && (
                                    <span className="ml-2 text-xs bg-blue-200 px-2 py-1 rounded-full">
                                      Atribuído
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
