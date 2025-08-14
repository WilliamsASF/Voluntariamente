'use client';

import { useState, useEffect } from 'react';

type Projeto = {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  responsavel: string;
  descricao: string;
};

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [novoProjeto, setNovoProjeto] = useState({
    nome: '',
    telefone: '',
    email: '',
    responsavel: '',
    descricao: ''
  });

  // Buscar projetos (substituir pela API)
  useEffect(() => {
    setProjetos([]); // Lista vazia inicialmente
  }, []);

  const handleAddProjeto = () => {
    // Substitua por chamada API real
    const novo = {
      id: Math.random(),
      ...novoProjeto
    };
    
    setProjetos([...projetos, novo]);
    setNovoProjeto({
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
        /* Lista de projetos */
        <>
          <h1 className="text-2xl font-bold mb-6">Projetos cadastrados na turma</h1>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-200 px-4 py-2 rounded mb-6 flex items-center gap-2 hover:bg-gray-300"
          >
            <span className="text-lg font-bold">+</span> Novo Projeto
          </button>

          {projetos.length > 0 ? (
            <div className="space-y-4">
              {projetos.map((proj) => (
                <div key={proj.id} className="p-4 border rounded-lg">
                  <h3 className="font-bold text-lg">{proj.nome}</h3>
                  <p className="text-gray-600">{proj.descricao}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-500">Nenhum projeto cadastrado ainda</p>
            </div>
          )}
        </>
      ) : (
        /* Novo projeto */
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">Novo Projeto</h1>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome"
              value={novoProjeto.nome}
              onChange={(e) => setNovoProjeto({ ...novoProjeto, nome: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded"
            />
            
            <input
              type="text"
              placeholder="Telefone"
              value={novoProjeto.telefone}
              onChange={(e) => setNovoProjeto({ ...novoProjeto, telefone: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded"
            />
            
            <input
              type="email"
              placeholder="Email"
              value={novoProjeto.email}
              onChange={(e) => setNovoProjeto({ ...novoProjeto, email: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded"
            />
            
            <input
              type="text"
              placeholder="Pessoa Responsável (nome)"
              value={novoProjeto.responsavel}
              onChange={(e) => setNovoProjeto({ ...novoProjeto, responsavel: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded"
            />
            
            <textarea
              placeholder="Descrição"
              value={novoProjeto.descricao}
              onChange={(e) => setNovoProjeto({ ...novoProjeto, descricao: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded h-32"
            />
          </div>
          
          <button
            onClick={handleAddProjeto}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Adicionar Projeto
          </button>
        </div>
      )}
    </div>
  );
}
