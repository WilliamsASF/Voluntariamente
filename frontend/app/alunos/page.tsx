'use client';

import { useEffect, useState } from 'react';
import { EstudanteService } from '../../lib/services/estudantes';
import { Estudante } from '../../lib/types';

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Estudante[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadAlunos() {
      const response = await EstudanteService.getAllEstudantes();
      if (response.success && response.data) {
        setAlunos(response.data);
      } else {
        console.error(response.error || 'Erro ao carregar alunos');
      }
      setLoading(false);
    }
    loadAlunos();
  }, []);

  // Filtra os alunos pelo nome
  const filteredAlunos = alunos.filter((aluno) =>
    aluno.full_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-4">Carregando alunos...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Alunos</h2>

      {/* Barra de pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar aluno..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Listagem de alunos */}
      <div className="grid grid-cols-3 gap-4">
        {filteredAlunos.map((aluno) => (
          <div
            key={aluno.student_id}
            className="border rounded-lg p-4 flex flex-col items-center shadow"
          >
            {/* Avatar placeholder */}
            <div className="w-16 h-16 rounded-full bg-gray-200 mb-2" />

            {/* Nome */}
            <p className="font-semibold">{aluno.full_name}</p>
            {/* Curso/Vínculo */}
            <p className="text-sm text-gray-600">
              {aluno.curso || aluno.vinculo || 'Sem curso definido'}
            </p>

            {/* Grupo/Etapa (placeholder por enquanto) */}
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 text-xs rounded bg-red-500 text-white">
                Grupo 1
              </span>
              <span className="px-2 py-1 text-xs rounded bg-gray-300">
                Etapa 1
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}