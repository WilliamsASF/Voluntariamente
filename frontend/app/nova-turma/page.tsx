'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Layers, CheckCircle, XCircle } from 'lucide-react';
import { EstudanteService } from '../lib/services/estudantes';
import { Estudante } from '../lib/types';
import Card, { CardHeader, CardContent } from '../components/ui/card';
import Button from '../components/ui/button';
import Input from '../components/ui/input';
import ProtectedRoute from '../components/ProtectedRoute';

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

export default function NovaTurmaPage() {
  const [nomeTurma, setNomeTurma] = useState('');
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [alunos, setAlunos] = useState<AlunoSelecionado[]>([]);
  const [buscaAluno, setBuscaAluno] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEstudantes();
  }, []);

  const loadEstudantes = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await EstudanteService.getAllEstudantes();
      
      if (result.success && result.data) {
        const alunosFormatados: AlunoSelecionado[] = result.data.map(est => ({
          id: est.student_id,
          nome: est.full_name,
          email: `${est.full_name.toLowerCase().replace(/\s+/g, '.')}@estudante.ufpe.br`,
          selecionado: false
        }));
        setAlunos(alunosFormatados);
      } else {
        setError(result.error || 'Erro ao carregar estudantes');
      }
    } catch (error) {
      setError('Erro inesperado ao carregar estudantes');
    } finally {
      setIsLoading(false);
    }
  };

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
    setAlunos(alunos.map(aluno =>
      aluno.id === id ? { ...aluno, selecionado: !aluno.selecionado } : aluno
    ));
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
      
      // TODO: Implementar criação real da turma via API
      alert(`Turma "${nomeTurma}" criada com sucesso! ${alunosSelecionados} alunos matriculados.`);
      
      // Limpar formulário após criação
      setNomeTurma('');
      setEtapas([]);
      setAlunos(alunos.map(aluno => ({ ...aluno, selecionado: false })));
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando estudantes...</p>
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
          <h1 className="text-3xl font-bold text-gray-800">Nova Turma</h1>
          <p className="text-gray-600 mt-2">
            Crie uma nova turma para organizar projetos e gerenciar alunos
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Dados da Turma */}
          <div className="space-y-6">
            {/* Nome da Turma */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-800">Informações da Turma</h2>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da turma *
                  </label>
                  <Input
                    type="text"
                    value={nomeTurma}
                    onChange={(e) => setNomeTurma(e.target.value)}
                    placeholder="Digite o nome da turma"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Seção de Etapas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Etapas do Projeto</h2>
                  <Button
                    onClick={adicionarEtapa}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {etapas.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Adicione etapas para organizar o projeto
                    </p>
                  ) : (
                    etapas.map((etapa) => (
                      <div key={etapa.id} className="flex space-x-2">
                        <Input
                          type="text"
                          value={etapa.nome}
                          onChange={(e) => atualizarEtapa(etapa.id, 'nome', e.target.value)}
                          placeholder="Nome da etapa"
                          className="flex-1"
                        />
                        <Input
                          type="text"
                          value={etapa.descricao}
                          onChange={(e) => atualizarEtapa(etapa.id, 'descricao', e.target.value)}
                          placeholder="Descrição"
                          className="flex-1"
                        />
                        <Button
                          onClick={() => removerEtapa(etapa.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle size={16} />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Botão Criar Turma */}
            <Button
              onClick={criarTurma}
              disabled={!podeCriarTurma}
              className={`w-full py-3 ${!podeCriarTurma ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <CheckCircle size={18} className="mr-2" />
              Criar Turma
            </Button>
          </div>

          {/* Coluna Direita - Seleção de Alunos */}
          <div className="space-y-6">
            {/* Busca de Alunos */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-800">Seleção de Alunos</h2>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar alunos
                  </label>
                  <Input
                    type="text"
                    value={buscaAluno}
                    onChange={(e) => setBuscaAluno(e.target.value)}
                    placeholder="Digite o nome ou email do aluno"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lista de Alunos */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Alunos Disponíveis
                  </h2>
                  <span className="text-sm text-gray-600">
                    {alunosSelecionados} selecionados
                  </span>
                </div>
              </CardHeader>
              <CardContent>
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
                        {aluno.selecionado && (
                          <CheckCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Users className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      Nenhum aluno encontrado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
