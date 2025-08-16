'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { EstudanteService } from '../../lib/services/estudantes';
import { ProjetoService } from '../../lib/services/projetos';
import { Estudante, Projeto } from '../../lib/types';

type Etapa = {
  id: number;
  nome: string;
  descricao: string;
};

type AlunoSelecionado = {
  id: number;
  nome: string;
  email: string;
  selecionado: boolean;
};

export default function PaginaInicial() {
  const { user, logout } = useAuth();
  const [nomeTurma, setNomeTurma] = useState('');
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [alunos, setAlunos] = useState<AlunoSelecionado[]>([]);
  const [buscaAluno, setBuscaAluno] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Carregar estudantes
        const estudantesResult = await EstudanteService.getAllEstudantes();
        if (estudantesResult.success && estudantesResult.data) {
          const alunosFormatados: AlunoSelecionado[] = estudantesResult.data.map(est => ({
            id: est.student_id,
            nome: est.full_name,
            email: `${est.full_name.toLowerCase().replace(/\s+/g, '.')}@estudante.ufpe.br`,
            selecionado: false
          }));
          setAlunos(alunosFormatados);
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

  const adicionarEtapa = () => {
    const novaEtapa: Etapa = {
      id: Date.now(),
      nome: '',
      descricao: ''
    };
    setEtapas([...etapas, novaEtapa]);
  };

  const atualizarEtapa = (id: number, campo: keyof Etapa, valor: string) => {
    setEtapas(etapas.map(etapa => 
      etapa.id === id ? { ...etapa, [campo]: valor } : etapa
    ));
  };

  const removerEtapa = (id: number) => {
    setEtapas(etapas.filter(etapa => etapa.id !== id));
  };

  const toggleAluno = (id: number) => {
    const novosAlunos = alunos.map(aluno =>
      aluno.id === id ? { ...aluno, selecionado: !aluno.selecionado } : aluno
    );
    setAlunos(novosAlunos);
  };

  const alunosFiltrados = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase()) ||
    aluno.email.toLowerCase().includes(buscaAluno.toLowerCase())
  );

  const alunosSelecionados = alunos.filter(aluno => aluno.selecionado).length;
  const podeCriarTurma = nomeTurma.trim() !== '' && alunosSelecionados > 0;

  const criarTurma = () => {
    if (podeCriarTurma) {
      const dadosTurma = {
        nome: nomeTurma,
        etapas: etapas.filter(etapa => etapa.nome.trim() !== ''),
        alunos: alunos.filter(aluno => aluno.selecionado)
      };
      console.log('Criando turma:', dadosTurma);
      alert('Turma criada com sucesso!');
      
      // Limpar formulário após criação
      setNomeTurma('');
      setEtapas([]);
      setAlunos(alunos.map(aluno => ({ ...aluno, selecionado: false })));
    }
  };

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
                <p className="text-3xl font-bold text-red-600">{alunos.length}</p>
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

            {/* Título */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-3xl font-bold text-gray-800">Nova turma</h2>
              <p className="text-gray-600 mt-2">Crie uma nova turma para gerenciar projetos e alunos</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Coluna Esquerda - Dados da Turma */}
              <div className="space-y-6">
                {/* Nome da Turma */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da turma
                  </label>
                  <input
                    type="text"
                    value={nomeTurma}
                    onChange={(e) => setNomeTurma(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Digite o nome da turma"
                  />
                </div>

                {/* Etapas */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Etapas do projeto
                    </label>
                    <button
                      onClick={adicionarEtapa}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      + Adicionar
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {etapas.map((etapa) => (
                      <div key={etapa.id} className="flex space-x-2">
                        <input
                          type="text"
                          value={etapa.nome}
                          onChange={(e) => atualizarEtapa(etapa.id, 'nome', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Nome da etapa"
                        />
                        <input
                          type="text"
                          value={etapa.descricao}
                          onChange={(e) => atualizarEtapa(etapa.id, 'descricao', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Descrição"
                        />
                        <button
                          onClick={() => removerEtapa(etapa.id)}
                          className="bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão Criar Turma */}
                <button
                  onClick={criarTurma}
                  disabled={!podeCriarTurma}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    podeCriarTurma
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Criar Turma
                </button>
              </div>

              {/* Coluna Direita - Seleção de Alunos */}
              <div className="space-y-6">
                {/* Busca de Alunos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar alunos
                  </label>
                  <input
                    type="text"
                    value={buscaAluno}
                    onChange={(e) => setBuscaAluno(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Digite o nome ou email do aluno"
                  />
                </div>

                {/* Lista de Alunos */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Alunos disponíveis ({alunosSelecionados} selecionados)
                    </label>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                    {alunosFiltrados.length > 0 ? (
                      alunosFiltrados.map((aluno) => (
                        <div
                          key={aluno.id}
                          className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                            aluno.selecionado ? 'bg-red-50 border-red-200' : ''
                          }`}
                          onClick={() => toggleAluno(aluno.id)}
                        >
                          <input
                            type="checkbox"
                            checked={aluno.selecionado}
                            onChange={() => toggleAluno(aluno.id)}
                            className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <p className={`font-medium ${aluno.selecionado ? 'text-red-800' : 'text-gray-900'}`}>
                              {aluno.nome}
                            </p>
                            <p className={`text-sm ${aluno.selecionado ? 'text-red-600' : 'text-gray-500'}`}>
                              {aluno.email}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Nenhum aluno encontrado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
