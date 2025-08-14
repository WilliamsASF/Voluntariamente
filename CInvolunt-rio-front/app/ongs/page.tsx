'use client';

import { useState, useEffect } from 'react';

type Instituicao = {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  responsavel: string;
  descricao: string;
};

export default function InstituicoesPage() {
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [novaInstituicao, setNovaInstituicao] = useState({
    nome: '',
    telefone: '',
    email: '',
    responsavel: '',
    descricao: ''
  });

  // Buscar instituições (substituir pela API)
  useEffect(() => {
    setInstituicoes([]); // Lista vazia inicialmente
  }, []);

  const handleAddInstituicao = () => {
    // Substitua por chamada API real
    const nova = {
      id: Math.random(),
      ...novaInstituicao
    };
    
    setInstituicoes([...instituicoes, nova]);
    setNovaInstituicao({
      nome: '',
      telefone: '',
      email: '',
      responsavel: '',
      descricao: ''
    });
    setShowForm(false);
  };

  return (
    <div className="p-4">
      {!showForm ? (
        /* Lista de instituições */
        <>
          <h1 className="text-2xl font-bold mb-6">Instituições cadastradas na turma</h1>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-200 px-4 py-2 rounded mb-6 flex items-center gap-2 hover:bg-gray-300"
          >
            <span className="text-lg font-bold">+</span> Nova Instituição
          </button>

          {instituicoes.length > 0 ? (
            <div className="space-y-4">
              {instituicoes.map((inst) => (
                <div key={inst.id} className="p-4 border rounded-lg">
                  <h3 className="font-bold text-lg">{inst.nome}</h3>
                  <p className="text-gray-600">{inst.descricao}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-500">Nenhuma instituição cadastrada ainda</p>
            </div>
          )}
        </>
      ) : (
        /* Nova instituição */
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">Nova Instituição</h1>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome"
              value={novaInstituicao.nome}
              onChange={(e) => setNovaInstituicao({ ...novaInstituicao, nome: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded"
            />
            
            <input
              type="text"
              placeholder="Telefone"
              value={novaInstituicao.telefone}
              onChange={(e) => setNovaInstituicao({ ...novaInstituicao, telefone: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded"
            />
            
            <input
              type="email"
              placeholder="Email"
              value={novaInstituicao.email}
              onChange={(e) => setNovaInstituicao({ ...novaInstituicao, email: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded"
            />
            
            <input
              type="text"
              placeholder="Pessoa Responsável (nome)"
              value={novaInstituicao.responsavel}
              onChange={(e) => setNovaInstituicao({ ...novaInstituicao, responsavel: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded"
            />
            
            <textarea
              placeholder="Descrição"
              value={novaInstituicao.descricao}
              onChange={(e) => setNovaInstituicao({ ...novaInstituicao, descricao: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded h-32"
            />
          </div>
          
          <button
            onClick={handleAddInstituicao}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Adicionar Instituição
          </button>
        </div>
      )}
    </div>
  );
}
