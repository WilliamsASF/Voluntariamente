'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import { Plus, Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Turma } from '../../lib/types';

export default function PaginaInicial() {
  const { user } = useAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [stats, setStats] = useState({
    totalTurmas: 0,
    totalStudents: 0,
    totalStages: 0,
    totalGroups: 0
  });

  useEffect(() => {
    const savedTurmas = localStorage.getItem('turmas');
    if (savedTurmas) {
      const allTurmas = JSON.parse(savedTurmas);
      
      if (user?.role === 'aluno') {
        // Filter turmas for aluno (only show enrolled ones)
        const enrolledTurmas = allTurmas.filter((turma: Turma) => 
          turma.students.some(student => student.email === user.email)
        );
        setTurmas(enrolledTurmas);
      } else {
        // Professor sees all turmas
        setTurmas(allTurmas);
      }

      // Calculate stats
      const totalStudents = allTurmas.reduce((acc: number, turma: Turma) => acc + turma.students.length, 0);
      const totalStages = allTurmas.reduce((acc: number, turma: Turma) => acc + turma.stages.length, 0);
      const totalGroups = allTurmas.reduce((acc: number, turma: Turma) => acc + (turma.groups?.length || 0), 0);
      
      setStats({
        totalTurmas: allTurmas.length,
        totalStudents,
        totalStages,
        totalGroups
      });
    }
  }, [user]);

  if (user?.role === 'aluno') {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Bem-vindo, {user.name || user.username}!
            </h1>
            <p className="text-gray-600">Acompanhe suas turmas e atividades</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Minhas Turmas</p>
                  <p className="text-2xl font-bold">{turmas.length}</p>
                </div>
                <BookOpen size={24} className="text-blue-200" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total de Etapas</p>
                  <p className="text-2xl font-bold">
                    {turmas.reduce((acc, turma) => acc + turma.stages.length, 0)}
                  </p>
                </div>
                <TrendingUp size={24} className="text-green-200" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Próximas Atividades</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Calendar size={24} className="text-purple-200" />
              </div>
            </Card>
          </div>

          {/* My Turmas */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Minhas Turmas</h2>
            {turmas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {turmas.map((turma) => (
                  <Card key={turma.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{turma.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {turma.stages.length} etapas
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{turma.subtitle || 'Sem descrição'}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Professor: {turma.instructor}</span>
                      <span>{turma.students.length} alunos • {turma.groups?.length || 0} grupos</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Você ainda não está inscrito em nenhuma turma</p>
                <p className="text-sm text-gray-400">Entre em contato com seu professor para ser adicionado</p>
              </div>
            )}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Professor Dashboard
  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Dashboard do Professor
          </h1>
          <p className="text-gray-600">Gerencie suas turmas e acompanhe o progresso dos alunos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Total de Turmas</p>
                <p className="text-2xl font-bold">{stats.totalTurmas}</p>
              </div>
              <BookOpen size={24} className="text-red-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total de Alunos</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
              <Users size={24} className="text-blue-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total de Etapas</p>
                <p className="text-2xl font-bold">{stats.totalStages}</p>
              </div>
              <TrendingUp size={24} className="text-green-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total de Grupos</p>
                <p className="text-2xl font-bold">{stats.totalGroups}</p>
              </div>
              <Users size={24} className="text-purple-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100">Turmas Ativas</p>
                <p className="text-2xl font-bold">{turmas.length}</p>
              </div>
              <Calendar size={24} className="text-indigo-200" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/nova-turma">
              <Button variant="primary" className="flex items-center gap-2">
                <Plus size={18} />
                Nova Turma
              </Button>
            </Link>
            <Link href="/alunos">
              <Button variant="default" className="flex items-center gap-2">
                <Users size={18} />
                Gerenciar Alunos
              </Button>
            </Link>
            <Link href="/grupos">
              <Button variant="default" className="flex items-center gap-2">
                <BookOpen size={18} />
                Ver Todas as Turmas
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Turmas */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Turmas Recentes</h2>
          {turmas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {turmas.slice(0, 6).map((turma) => (
                <Card key={turma.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{turma.title}</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {turma.students.length} alunos
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{turma.subtitle || 'Sem descrição'}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{turma.stages.length} etapas</span>
                    <Link href={`/grupos/${turma.id}`} className="text-red-600 hover:text-red-700">
                      Ver detalhes →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">Nenhuma turma criada ainda</p>
              <Link href="/nova-turma">
                <Button variant="primary">Criar primeira turma</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
