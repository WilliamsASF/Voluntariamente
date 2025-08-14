'use client';

import { useState } from 'react';

type Etapa = {
  id: number;
  nome: string;
  descricao: string;
};

type Aluno = {
  id: number;
  nome: string;
  email: string;
  selecionado: boolean;
};

export default function NovaTurmaPage() {
  const [nomeTurma, setNomeTurma] = useState('');
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([
    { id: 1, nome: 'João Silva', email: 'joao.silva@email.com', selecionado: false },
    { id: 2, nome: 'Maria Santos', email: 'maria.santos@email.com', selecionado: false },
    { id: 3, nome: 'Pedro Costa', email: 'pedro.costa@email.com', selecionado: false },
    { id: 4, nome: 'Ana Oliveira', email: 'ana.oliveira@email.com', selecionado: false },
    { id: 5, nome: 'Carlos Lima', email: 'carlos.lima@email.com', selecionado: false },
  ]);
  const [buscaAluno, setBuscaAluno] = useState('');

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
      alert('Turma criada com sucesso!');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Nova turma</h1>
      
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o nome da turma"
            />
          </div>

          {/* Seção de Etapas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Etapas</h2>
              <button
                onClick={adicionarEtapa}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                + Nova Etapa
              </button>
            </div>

            <div className="space-y-4">
              {etapas.map((etapa, index) => (
                <div key={etapa.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-700">Etapa {index + 1}</h3>
                    <button
                      onClick={() => removerEtapa(etapa.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={etapa.nome}
                      onChange={(e) => atualizarEtapa(etapa.id, 'nome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome da etapa"
                    />
                    
                    <textarea
                      value={etapa.descricao}
                      onChange={(e) => atualizarEtapa(etapa.id, 'descricao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="Escreva uma descrição para esta etapa"
                    />
                  </div>
                </div>
              ))}

              {etapas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma etapa criada ainda</p>
                  <p className="text-sm">Clique em "Nova Etapa" para começar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita - Seleção de Alunos */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Alunos</h2>
            
            {/* Campo de Busca */}
            <div className="mb-4">
              <input
                type="text"
                value={buscaAluno}
                onChange={(e) => setBuscaAluno(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email ou nome"
              />
            </div>

            {/* Lista de Alunos */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aluno
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seleção
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {alunosFiltrados.map((aluno) => (
                    <tr key={aluno.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            {aluno.nome.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {aluno.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {aluno.email}
                      </td>
                      <td className="px-4 py-3">
                                                 <input
                           type="checkbox"
                           checked={aluno.selecionado}
                           onChange={() => toggleAluno(aluno.id)}
                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                         />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {alunosFiltrados.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum aluno encontrado</p>
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              {alunosSelecionados > 0 ? (
                <span className="text-green-600">
                  {alunosSelecionados} aluno{alunosSelecionados > 1 ? 's' : ''} selecionado{alunosSelecionados > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-gray-500">Nenhum aluno selecionado</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Ação */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={criarTurma}
          disabled={!podeCriarTurma}
          className={`w-full py-3 px-6 rounded-lg text-lg font-medium transition-colors ${
            podeCriarTurma
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Criar turma
        </button>
        
        {!podeCriarTurma && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            {nomeTurma.trim() === '' ? 'Preencha o nome da turma' : ''}
            {nomeTurma.trim() !== '' && alunosSelecionados === 0 ? 'Selecione pelo menos um aluno' : ''}
          </p>
        )}
      </div>
    </div>
  );
}
