'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, User } from 'lucide-react';
import Card from '../../components/ui/card';
import { useAuth } from '../../hooks/useAuth';
import { Turma, Student } from '../../lib/types';

interface StudentWithGroups extends Student {
  groups: string[];
  currentStage: string;
}

export default function AlunosPage() {
  const { user } = useAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [students, setStudents] = useState<StudentWithGroups[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStage, setActiveStage] = useState('Etapa 1');
  const [filteredStudents, setFilteredStudents] = useState<StudentWithGroups[]>([]);

    useEffect(() => {
    // Load both turmas and global students
    const savedTurmas = localStorage.getItem('turmas');
    const globalStudents = JSON.parse(localStorage.getItem('globalStudents') || '[]');
    
    if (savedTurmas) {
      const allTurmas = JSON.parse(savedTurmas);
      setTurmas(allTurmas);
      
      // Extract all students with their group and stage information
      const allStudents: StudentWithGroups[] = [];
      
      // Add students from turmas
      allTurmas.forEach((turma: Turma) => {
        turma.students.forEach((student: Student) => {
          // Find which groups this student belongs to
          const studentGroups = (turma.groups || []).filter(group => 
            group.students.some(s => s.id === student.id)
          );
          
          // Find current stage (for now, default to Etapa 1)
          const currentStage = 'Etapa 1';
          
          allStudents.push({
            ...student,
            groups: studentGroups.map(g => g.name),
            currentStage
          });
        });
      });
      
      // Add global students that aren't already in turmas
      globalStudents.forEach((globalStudent: Student) => {
        const isAlreadyInTurmas = allStudents.some(s => s.id === globalStudent.id);
        if (!isAlreadyInTurmas) {
          allStudents.push({
            ...globalStudent,
            groups: [],
            currentStage: 'Etapa 1'
          });
        }
      });
      
      setStudents(allStudents);
    } else if (globalStudents.length > 0) {
      // If no turmas exist, just show global students
      const allStudents: StudentWithGroups[] = globalStudents.map((student: Student) => ({
        ...student,
        groups: [],
        currentStage: 'Etapa 1'
      }));
      setStudents(allStudents);
    }
  }, []);

  useEffect(() => {
    // Filter students based on search term and active stage
    let filtered = students;
    
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeStage !== 'Todas') {
      filtered = filtered.filter(student => student.currentStage === activeStage);
    }
    
    setFilteredStudents(filtered);
  }, [students, searchTerm, activeStage]);

  const stages = ['Todas', 'Etapa 1', 'Etapa 2', 'Etapa 3', 'Etapa 4'];

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Alunos</h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquise por nome, login..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
        <div className="flex gap-2">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeStage === stage 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-3">
              {/* Profile Picture */}
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                {student.profilePicture ? (
                  <img 
                    src={student.profilePicture} 
                    alt={student.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-600" />
                )}
              </div>
              
              {/* Student Information */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">
                  {student.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">&lt;ft&gt;</p>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {student.groups.map((groupName, index) => (
                    <span
                      key={index}
                      className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {groupName}
                    </span>
                  ))}
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {student.currentStage}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-2">
            {searchTerm || activeStage !== 'Todas' 
              ? 'Nenhum aluno encontrado com os filtros aplicados'
              : 'Nenhum aluno cadastrado'
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveStage('Todas');
              }}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      {filteredStudents.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Mostrando {filteredStudents.length} de {students.length} alunos
        </div>
      )}
    </div>
  );
}