'use client';

import { useState, useEffect } from 'react';
import { Camera, Folder, MoreVertical, Plus, Building, Users, FileText } from 'lucide-react';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import GroupCard from '../../components/GroupCard';
import { Turma, Group } from '../../lib/types';

export default function TurmasPage() {
  const { user } = useAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  const [showGroups, setShowGroups] = useState(false);

  useEffect(() => {
    // Load turmas from localStorage on component mount
    const savedTurmas = localStorage.getItem('turmas');
    if (savedTurmas) {
      let allTurmas = JSON.parse(savedTurmas);
      
      // If user is aluno, only show turmas they're enrolled in
      if (user?.role === 'aluno') {
        // For now, show all turmas. In real app, filter by enrollment
        allTurmas = allTurmas.filter((turma: Turma) => 
          turma.students.some(student => student.email === user.email)
        );
      }
      
      setTurmas(allTurmas);
    }
  }, [user]);

  const removeTurma = (id: string) => {
    // Only professors can remove turmas
    if (user?.role !== 'professor') return;
    
    const updatedTurmas = turmas.filter(turma => turma.id !== id);
    setTurmas(updatedTurmas);
    localStorage.setItem('turmas', JSON.stringify(updatedTurmas));
  };

  const handleTurmaClick = (turma: Turma) => {
    setSelectedTurma(turma);
    setShowGroups(true);
  };

  const handleBackToTurmas = () => {
    setSelectedTurma(null);
    setShowGroups(false);
  };

  const handleGroupEdit = (group: Group) => {
    // TODO: Implement group editing
    console.log('Edit group:', group);
  };

  const handleGroupDelete = (groupId: string) => {
    if (!selectedTurma) return;
    
         const updatedGroups = (selectedTurma.groups || []).filter(g => g.id !== groupId);
    const updatedTurma = { ...selectedTurma, groups: updatedGroups };
    
    // Update turma in state
    setSelectedTurma(updatedTurma);
    
    // Update turma in localStorage
    const updatedTurmas = turmas.map(t => t.id === updatedTurma.id ? updatedTurma : t);
    setTurmas(updatedTurmas);
    localStorage.setItem('turmas', JSON.stringify(updatedTurmas));
  };

                // If showing groups for a specific turma
              if (showGroups && selectedTurma) {
                return (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <button
                          onClick={handleBackToTurmas}
                          className="text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-2"
                        >
                          ← Voltar para Turmas
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-900">{selectedTurma.title}</h1>
                        <p className="text-gray-600">Detalhes da turma</p>
                      </div>
                      {user?.role === 'professor' && (
                        <Link href="/nova-turma">
                          <Button variant="primary" className="flex items-center gap-2">
                            <Plus size={18} />
                            Nova Turma
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* Turma Cover Image */}
                    {selectedTurma.coverImage && (
                      <div className="mb-8">
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <img
                            src={selectedTurma.coverImage}
                            alt="Capa da turma"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                          <div className="absolute bottom-4 left-4 text-white">
                            <h2 className="text-2xl font-bold">{selectedTurma.title}</h2>
                            <p className="text-lg opacity-90">{selectedTurma.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Turma Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                      {/* Turma Info Card */}
                      <Card className="p-6 bg-white border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Informações da Turma</h3>
                            <p className="text-sm text-gray-500">Detalhes gerais</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Nome</p>
                            <p className="text-gray-900">{selectedTurma.title}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Instrutor</p>
                            <p className="text-gray-900">{selectedTurma.instructor}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Ano</p>
                            <p className="text-gray-900">{selectedTurma.year}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Subtitle</p>
                            <p className="text-gray-900">{selectedTurma.subtitle}</p>
                          </div>
                        </div>
                      </Card>

                      {/* Students Count Card */}
                      <Card className="p-6 bg-white border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Alunos</h3>
                            <p className="text-sm text-gray-500">Matriculados</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">{selectedTurma.students.length}</p>
                          <p className="text-sm text-gray-500">alunos registrados</p>
                        </div>
                      </Card>

                      {/* Groups Count Card */}
                      <Card className="p-6 bg-white border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Building className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Grupos</h3>
                            <p className="text-sm text-gray-500">Formados</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-purple-600">{(selectedTurma.groups || []).length}</p>
                          <p className="text-sm text-gray-500">grupos ativos</p>
                        </div>
                      </Card>
                    </div>

                    {/* Students Section */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-600" />
                          Alunos da Turma
                        </h2>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Buscar alunos..."
                            className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={(e) => {
                              const searchTerm = e.target.value.toLowerCase();
                              const filteredStudents = selectedTurma.students.filter(student =>
                                student.name.toLowerCase().includes(searchTerm) ||
                                student.email.toLowerCase().includes(searchTerm)
                              );
                              // You can implement state for filtered students if needed
                            }}
                          />
                          <Users className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedTurma.students.map((student) => (
                          <Card key={student.id} className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-semibold">
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{student.name}</p>
                                <p className="text-sm text-gray-500 truncate">{student.email}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                                                             {/* Projects Section */}
                     <div className="mb-8">
                       <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                         <FileText className="h-5 w-5 text-blue-600" />
                         Projetos da Turma
                       </h2>
                       {(selectedTurma.projects || []).length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {(selectedTurma.projects || []).map((project, index) => (
                             <Card key={project.id} className="p-4 bg-white border border-gray-200">
                               <div className="flex items-center gap-3 mb-3">
                                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                   <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                                 </div>
                                 <h3 className="font-medium text-gray-900">{project.name}</h3>
                               </div>
                               <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                               
                               {/* Project Stages */}
                               <div className="border-t pt-3">
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Etapas:</h4>
                                 <div className="space-y-1">
                                   {project.stages.map((stage, stageIndex) => (
                                     <div key={stage.id} className="flex items-center gap-2 text-xs">
                                       <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                                         {stageIndex + 1}
                                       </span>
                                       <span className="font-medium text-gray-800">{stage.name}</span>
                                       <span className="text-gray-500">-</span>
                                       <span className="text-gray-600">{stage.description}</span>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             </Card>
                           ))}
                         </div>
                       ) : (
                         <div className="text-center py-8 bg-gray-50 rounded-lg">
                           <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                           <p className="text-gray-500">Nenhum projeto criado nesta turma</p>
                         </div>
                       )}
                     </div>

                    {/* Groups Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5 text-purple-600" />
                        Grupos da Turma
                      </h2>
                      {(selectedTurma.groups || []).length > 0 ? (
                        <div className="space-y-6">
                          {(selectedTurma.groups || []).map((group) => (
                            <GroupCard
                              key={group.id}
                              group={group}
                              onEdit={handleGroupEdit}
                              onDelete={handleGroupDelete}
                              isEditable={user?.role === 'professor'}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                          <Building size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-500 mb-4">Nenhum grupo criado nesta turma</p>
                          {user?.role === 'professor' && (
                            <Link href="/nova-turma">
                              <Button variant="primary">Criar primeiro grupo</Button>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

  // Main turmas listing
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Turmas</h1>
        {user?.role === 'professor' && (
          <Link href="/nova-turma">
            <Button variant="primary" className="flex items-center gap-2">
              <Plus size={18} />
              Nova Turma
            </Button>
          </Link>
        )}
      </div>

      {turmas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turmas.map((turma) => (
            <Card key={turma.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => handleTurmaClick(turma)}>
              {/* Header with colored background or cover image */}
              <div className={`${turma.coverImage ? 'bg-cover bg-center' : turma.headerColor || 'bg-gray-700'} p-4 text-white relative h-24`} 
                   style={turma.coverImage ? { backgroundImage: `url(${turma.coverImage})` } : {}}>
                {turma.coverImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                )}
                <div className="relative z-10">
                  <h3 className="font-semibold text-lg mb-1 truncate">{turma.title}</h3>
                  {turma.subtitle && (
                    <p className="text-sm opacity-90 truncate">{turma.subtitle}</p>
                  )}
                </div>
                
                {/* Instructor profile picture overlapping header and body */}
                <div className="absolute -bottom-5 right-4">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-md overflow-hidden">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm">
                      {turma.instructor.charAt(0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 pt-6">
                <p className="text-sm text-gray-600 font-medium">{turma.instructor}</p>
                <p className="text-xs text-gray-500 mt-1">{turma.year}</p>
                                 <div className="mt-2 text-xs text-gray-500">
                   <span>{(turma.projects || []).length} projetos • {turma.students.length} alunos</span>
                 </div>
                
                {/* Groups Info */}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <Building size={14} />
                  <span>{(turma.groups || []).length} grupos</span>
                </div>
              </div>

              {/* Footer with action icons */}
              <div className="px-4 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Camera size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Folder size={16} className="text-gray-600" />
                  </button>
                </div>
                {user?.role === 'professor' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTurma(turma.id);
                    }}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-500 hover:text-red-600"
                    title="Remover turma"
                  >
                    <MoreVertical size={16} />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {user?.role === 'professor' 
              ? 'Nenhuma turma criada ainda' 
              : 'Nenhuma turma encontrada para você'
            }
          </div>
          {user?.role === 'professor' && (
            <Link href="/nova-turma">
              <Button variant="primary">Criar primeira turma</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}