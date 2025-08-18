"use client"

import { useState, useEffect } from "react"
import Button from "../../components/ui/button"
import Input from "../../components/ui/input"
import Textarea from "../../components/ui/textarea"
import Card from "../../components/ui/card"
import { Plus, Menu, Trash2, X, User, Building, FileText, Package } from "lucide-react"
import ProtectedRoute from '../../components/ProtectedRoute'
import { useAuth } from '../../hooks/useAuth'
import { Group, Student, Document, Deliverable, Project } from '../../lib/types'
import ConfirmationDialog from '../../components/ConfirmationDialog'

interface Stage {
  id: string
  name: string
  description: string
}

export default function NovaTurmaPage() {
  const [className, setClassName] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewStudentForm, setShowNewStudentForm] = useState(false)
  const [newStudent, setNewStudent] = useState({ login: "", email: "" })
  const [showNewGroupForm, setShowNewGroupForm] = useState(false)
  const [newGroup, setNewGroup] = useState({
    name: "",
    ngoName: "",
    problemDescription: "",
    category: "Vistoria"
  })
  
  const { user } = useAuth();
  const userRole = user?.role === 'professor' ? 'Professor' : 'Aluno';

  // Student data - starts empty, will be populated when new students are added
  const [students, setStudents] = useState<Student[]>([])
  
  // Group data - starts empty, will be populated when new groups are created
  const [groups, setGroups] = useState<Group[]>([])

  // Confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)

  // Selected students state
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

  // Load global students on component mount
  useEffect(() => {
    const globalStudents = JSON.parse(localStorage.getItem('globalStudents') || '[]');
    
    // If no global students exist, create some initial ones for testing
    if (globalStudents.length === 0) {
      const initialStudents: Student[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao.silva@email.com'
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria.santos@email.com'
        },
        {
          id: '3',
          name: 'Pedro Costa',
          email: 'pedro.costa@email.com'
        },
        {
          id: '4',
          name: 'Ana Oliveira',
          email: 'ana.oliveira@email.com'
        },
        {
          id: '5',
          name: 'Carlos Ferreira',
          email: 'carlos.ferreira@email.com'
        },
        {
          id: '6',
          name: 'Lucia Rodrigues',
          email: 'lucia.rodrigues@email.com'
        },
        {
          id: '7',
          name: 'Roberto Almeida',
          email: 'roberto.almeida@email.com'
        },
        {
          id: '8',
          name: 'Fernanda Lima',
          email: 'fernanda.lima@email.com'
        },
        {
          id: '9',
          name: 'Diego Souza',
          email: 'diego.souza@email.com'
        },
        {
          id: '10',
          name: 'Camila Martins',
          email: 'camila.martins@email.com'
        },
        {
          id: '11',
          name: 'Rafael Pereira',
          email: 'rafael.pereira@email.com'
        },
        {
          id: '12',
          name: 'Juliana Cardoso',
          email: 'juliana.cardoso@email.com'
        }
      ];
      
      localStorage.setItem('globalStudents', JSON.stringify(initialStudents));
      setStudents(initialStudents);
    } else {
      setStudents(globalStudents);
    }
  }, []);

  // Create a test turma for immediate testing
  useEffect(() => {
    const existingTurmas = JSON.parse(localStorage.getItem('turmas') || '[]');
    
    // Only create test turma if none exist
    if (existingTurmas.length === 0) {
      const testTurma = {
        id: 'test-turma-1',
        title: 'Turma de Teste - Desenvolvimento de Software',
        subtitle: 'Turma criada para testar funcionalidades',
        instructor: 'Professor Teste',
        instructorImage: '',
        headerColor: 'bg-blue-600',
        year: '2024',
        projects: [
          {
            id: 'project-1',
            name: 'Sistema de Gestão',
            description: 'Desenvolvimento de sistema completo para ONG',
            stages: [
              { id: '1', name: 'Etapa 1', description: 'Análise de Requisitos' },
              { id: '2', name: 'Etapa 2', description: 'Design do Sistema' },
              { id: '3', name: 'Etapa 3', description: 'Implementação' },
              { id: '4', name: 'Etapa 4', description: 'Testes e Deploy' }
            ],
            createdAt: new Date().toISOString()
          }
        ],
        students: [
          {
            id: '1',
            name: 'João Silva',
            email: 'joao.silva@email.com'
          },
          {
            id: '2',
            name: 'Maria Santos',
            email: 'maria.santos@email.com'
          },
          {
            id: '3',
            name: 'Pedro Costa',
            email: 'pedro.costa@email.com'
          },
          {
            id: '4',
            name: 'Ana Oliveira',
            email: 'ana.oliveira@email.com'
          },
          {
            id: '5',
            name: 'Carlos Ferreira',
            email: 'carlos.ferreira@email.com'
          },
          {
            id: '6',
            name: 'Lucia Rodrigues',
            email: 'lucia.rodrigues@email.com'
          },
          {
            id: '7',
            name: 'Roberto Almeida',
            email: 'roberto.almeida@email.com'
          },
          {
            id: '8',
            name: 'Fernanda Lima',
            email: 'fernanda.lima@email.com'
          },
          {
            id: '9',
            name: 'Diego Souza',
            email: 'diego.souza@email.com'
          },
          {
            id: '10',
            name: 'Camila Martins',
            email: 'camila.martins@email.com'
          },
          {
            id: '11',
            name: 'Rafael Pereira',
            email: 'rafael.pereira@email.com'
          },
          {
            id: '12',
            name: 'Juliana Cardoso',
            email: 'juliana.cardoso@email.com'
          }
        ],
        groups: [
          {
            id: 'group-1',
            name: 'Grupo Alpha',
            ngoName: 'ONG Teste 1',
            problemDescription: 'Sistema de gestão para ONG',
            category: 'Desenvolvimento',
            students: [],
            documents: [
              {
                id: 'doc-1',
                title: 'Documento de Análise',
                stage: 'Etapa 1',
                uploadedAt: new Date().toISOString()
              }
            ],
            deliverables: [
              { stage: 'Etapa 1', status: 'completed' },
              { stage: 'Etapa 2', status: 'pending' },
              { stage: 'Etapa 3', status: 'pending' },
              { stage: 'Etapa 4', status: 'pending' }
            ],
            createdAt: new Date().toISOString()
          },
          {
            id: 'group-2',
            name: 'Grupo Beta',
            ngoName: 'ONG Teste 2',
            problemDescription: 'Aplicativo mobile para voluntários',
            category: 'Mobile',
            students: [],
            documents: [
              {
                id: 'doc-2',
                title: 'Especificação Técnica',
                stage: 'Etapa 1',
                uploadedAt: new Date().toISOString()
              }
            ],
            deliverables: [
              { stage: 'Etapa 1', status: 'completed' },
              { stage: 'Etapa 2', status: 'pending' },
              { stage: 'Etapa 3', status: 'pending' },
              { stage: 'Etapa 4', status: 'pending' }
            ],
            createdAt: new Date().toISOString()
          }
        ]
      };
      
      existingTurmas.push(testTurma);
      localStorage.setItem('turmas', JSON.stringify(existingTurmas));
    }
  }, []);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      stages: [
        { id: "1", name: "Etapa 1", description: "Descrição da Etapa 1" },
        { id: "2", name: "Etapa 2", description: "Descrição da Etapa 2" },
        { id: "3", name: "Etapa 3", description: "Descrição da Etapa 3" },
        { id: "4", name: "Etapa 4", description: "Descrição da Etapa 4" }
      ],
      createdAt: new Date().toISOString()
    }
    setProjects([...projects, newProject])
  }

  const removeProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)))
  }

  const updateProjectStage = (projectId: string, stageId: string, field: keyof { id: string; name: string; description: string }, value: string) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? {
            ...project,
            stages: project.stages.map(stage =>
              stage.id === stageId ? { ...stage, [field]: value } : stage
            )
          }
        : project
    ))
  }

  const addStageToProject = (projectId: string) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? {
            ...project,
            stages: [
              ...project.stages,
              {
                id: Date.now().toString(),
                name: `Etapa ${project.stages.length + 1}`,
                description: "Descrição da nova etapa"
              }
            ]
          }
        : project
    ))
  }

  const removeStageFromProject = (projectId: string, stageId: string) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? {
            ...project,
            stages: project.stages.filter(stage => stage.id !== stageId)
          }
        : project
    ))
  }

  const handleNewStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newStudent.login && newStudent.email) {
      // Create new student and add to the list
      const newStudentObj: Student = {
        id: Date.now().toString(),
        name: newStudent.login,
        email: newStudent.email,
      }
      
      // Add to local state
      setStudents([...students, newStudentObj])
      
      // Also add to global students list
      const globalStudents = JSON.parse(localStorage.getItem('globalStudents') || '[]');
      globalStudents.push(newStudentObj);
      localStorage.setItem('globalStudents', JSON.stringify(globalStudents));
      
      setNewStudent({ login: "", email: "" })
      setShowNewStudentForm(false)
    }
  }

  const toggleNewStudentForm = () => {
    setShowNewStudentForm(!showNewStudentForm)
  }

  const removeStudent = (id: string) => {
    // Remove from local state
    setStudents(students.filter((student) => student.id !== id))
    
    // Also remove from global students list
    const globalStudents = JSON.parse(localStorage.getItem('globalStudents') || '[]');
    const updatedGlobalStudents = globalStudents.filter((student: Student) => student.id !== id);
    localStorage.setItem('globalStudents', JSON.stringify(updatedGlobalStudents));
  }

  const handleDeleteStudentClick = (student: Student) => {
    setStudentToDelete(student);
    setShowDeleteDialog(true);
  }

  const confirmDeleteStudent = () => {
    if (studentToDelete) {
      removeStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  }

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  }

  const selectAllStudents = () => {
    setSelectedStudents(new Set(students.map(s => s.id)));
  }

  const deselectAllStudents = () => {
    setSelectedStudents(new Set());
  }

  const handleNewGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newGroup.name && newGroup.ngoName) {
      // Create new group with default structure
      const newGroupObj: Group = {
        id: Date.now().toString(),
        name: newGroup.name,
        ngoName: newGroup.ngoName,
        problemDescription: newGroup.problemDescription,
        category: newGroup.category,
        students: [], // Will be populated later
        documents: [
          {
            id: Date.now().toString(),
            title: "Visita ao espaço físico da Ong",
            stage: "Etapa 1",
            uploadedAt: new Date().toISOString()
          }
        ],
        deliverables: [
          { stage: "Etapa 1", status: "completed" },
          { stage: "Etapa 2", status: "pending" },
          { stage: "Etapa 3", status: "pending" },
          { stage: "Etapa 4", status: "pending" }
        ],
        assignedProjects: [],
        createdAt: new Date().toISOString()
      }
      setGroups([...groups, newGroupObj])
      setNewGroup({ name: "", ngoName: "", problemDescription: "", category: "Vistoria" })
      setShowNewGroupForm(false)
    }
  }

  const toggleNewGroupForm = () => {
    setShowNewGroupForm(!showNewGroupForm)
  }

  const removeGroup = (id: string) => {
    setGroups(groups.filter((group) => group.id !== id))
  }

  const handleCreateTurma = () => {
    if (!className.trim()) {
      alert("Por favor, insira o nome da turma")
      return
    }

    // Get only selected students
    const selectedStudentList = students.filter(student => selectedStudents.has(student.id));
    
    if (selectedStudentList.length === 0) {
      alert("Por favor, selecione pelo menos um aluno para a turma")
      return
    }

    const turmaData = {
      id: Date.now().toString(),
      title: className,
      subtitle: `Turma criada por ${user?.name || user?.username}`,
      instructor: user?.name || user?.username || "Professor",
      instructorImage: "",
      headerColor: "bg-blue-600",
      year: new Date().getFullYear().toString(),
      students: selectedStudentList,
      groups: groups,
      projects: projects
    }

    // Save to localStorage
    const existingTurmas = JSON.parse(localStorage.getItem('turmas') || '[]')
    existingTurmas.push(turmaData)
    localStorage.setItem('turmas', JSON.stringify(existingTurmas))

    // Redirect to grupos page
    window.location.href = '/grupos'
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Nova turma</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
      <div className="space-y-6">
            {/* Class Name Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Nome da turma</h2>
              <div className="relative">
                <Input
                  label=""
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="pl-10 bg-gray-100 border-0 h-12"
                  placeholder=""
                />
                <Menu className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Projects Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Projetos</h2>
                <Button
                  onClick={addProject}
                  variant="default"
                  className="bg-gray-100 border-0 text-gray-600 hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Projeto
                </Button>
        </div>

              <div className="space-y-4">
                {projects.map((project, index) => (
                  <Card key={project.id} className="p-4 bg-white border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-700">Projeto {index + 1}</h3>
                      <Button
                        onClick={() => removeProject(project.id)}
                        variant="default"
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <Input
                        label=""
                        value={project.name}
                        onChange={(e) => updateProject(project.id, "name", e.target.value)}
                        placeholder="Nome do Projeto"
                        className="bg-gray-50 border-0"
                      />
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        placeholder="Descrição do projeto"
                        className="bg-gray-50 border-0 min-h-[60px] resize-none"
                      />
                      
                                             {/* Project Stages */}
                       <div className="mt-4">
                         <div className="flex items-center justify-between mb-3">
                           <h4 className="text-sm font-medium text-gray-700">Etapas do Projeto</h4>
                           <Button
                             onClick={() => addStageToProject(project.id)}
                             variant="default"
                             className="text-xs px-2 py-1 h-auto bg-blue-100 text-blue-700 hover:bg-blue-200"
                           >
                             <Plus className="h-3 w-3 mr-1" />
                             Adicionar Etapa
                           </Button>
          </div>
                         <div className="space-y-3">
                           {project.stages.map((stage, stageIndex) => (
                             <div key={stage.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                               <div className="flex items-center justify-between mb-2">
                                 <span className="text-xs font-medium text-gray-600">Etapa {stageIndex + 1}</span>
                                 {project.stages.length > 1 && (
                                   <Button
                                     onClick={() => removeStageFromProject(project.id, stage.id)}
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
                                   onChange={(e) => updateProjectStage(project.id, stage.id, "name", e.target.value)}
                                   placeholder="Nome da etapa"
                                   className="bg-white border border-gray-200 text-sm"
                                 />
                                 <Textarea
                                   value={stage.description}
                                   onChange={(e) => updateProjectStage(project.id, stage.id, "description", e.target.value)}
                                   placeholder="Descrição da etapa"
                                   className="bg-white border border-gray-200 min-h-[60px] resize-none text-sm"
                  />
                </div>
                             </div>
                           ))}
                         </div>
                       </div>
                    </div>
            </Card>
                ))}
              </div>
            </div>

            {/* Groups Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Grupos
                </h2>
                {userRole === "Professor" && (
                  <Button
                    onClick={toggleNewGroupForm}
                    variant="default"
                    className="bg-gray-100 border-0 text-gray-600 hover:bg-gray-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Grupo
                  </Button>
                )}
                </div>

              {/* New Group Form */}
              {userRole === "Professor" && showNewGroupForm && (
                <Card className="p-4 bg-white border border-gray-200 mb-6">
                  <form onSubmit={handleNewGroupSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                        label=""
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        placeholder="Nome do Grupo"
                        className="bg-gray-50 border-0"
                        />
                        <Input
                        label=""
                        value={newGroup.ngoName}
                        onChange={(e) => setNewGroup({ ...newGroup, ngoName: e.target.value })}
                        placeholder="Nome da ONG"
                        className="bg-gray-50 border-0"
                      />
                    </div>
                    <Textarea
                      value={newGroup.problemDescription}
                      onChange={(e) => setNewGroup({ ...newGroup, problemDescription: e.target.value })}
                      placeholder="Descrição do problema"
                      className="bg-gray-50 border-0 min-h-[60px] resize-none"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="default"
                        onClick={toggleNewGroupForm}
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                      >
                        Cancelar
                      </Button>
                        <Button
                        type="submit"
                        variant="primary"
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Adicionar
                        </Button>
                      </div>
                  </form>
                </Card>
              )}

              {/* Groups List */}
              <div className="space-y-3">
                {groups.map((group) => (
                  <Card key={group.id} className="p-3 bg-blue-50 border border-blue-200 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{group.name}</p>
                          <p className="text-xs text-gray-600">{group.ngoName}</p>
                        </div>
                      </div>
                      {userRole === "Professor" && (
                        <Button
                          variant="default"
                          onClick={() => removeGroup(group.id)}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3 text-gray-400" />
                        </Button>
                  )}
                </div>
            </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Alunos</h2>
              {userRole === "Professor" && (
            <Button
                  onClick={toggleNewStudentForm}
                  variant="default"
                  className="bg-gray-100 border-0 text-gray-600 hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Aluno
            </Button>
              )}
          </div>

            {/* New Student Form */}
            {userRole === "Professor" && showNewStudentForm && (
              <Card className="p-4 bg-white border border-gray-200 mb-6">
                <form onSubmit={handleNewStudentSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label=""
                      value={newStudent.login}
                      onChange={(e) => setNewStudent({ ...newStudent, login: e.target.value })}
                      placeholder="Login"
                      className="bg-gray-50 border-0"
                    />
                  <Input
                      label=""
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      placeholder="Email"
                      className="bg-gray-50 border-0"
                  />
                </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="default"
                      onClick={toggleNewStudentForm}
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Adicionar
                    </Button>
                  </div>
                </form>
            </Card>
            )}

                         {/* Search Input */}
             <div className="relative mb-4">
               <Input
                 label=""
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Email ou nome"
                 className="pl-10 bg-white border border-gray-200 h-12"
               />
               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
             </div>

             {/* Selection Controls */}
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                   {selectedStudents.size} de {students.length} alunos selecionados
                  </span>
                </div>
               <div className="flex gap-2">
                 <Button
                   onClick={selectAllStudents}
                   variant="default"
                   className="text-xs px-3 py-1 h-auto bg-blue-100 text-blue-700 hover:bg-blue-200"
                 >
                   Selecionar Todos
                 </Button>
                 <Button
                   onClick={deselectAllStudents}
                   variant="default"
                   className="text-xs px-3 py-1 h-auto bg-gray-100 text-gray-700 hover:bg-gray-300"
                 >
                   Desmarcar Todos
                 </Button>
               </div>
             </div>

                         {/* Students Grid */}
             <div className="grid grid-cols-3 gap-3 mb-6">
               {students.map((student) => (
                 <Card 
                   key={student.id} 
                   className={`p-3 border-0 relative group cursor-pointer transition-all ${
                     selectedStudents.has(student.id) 
                       ? 'bg-blue-100 border-2 border-blue-300' 
                       : 'bg-gray-100 hover:bg-gray-200'
                   }`}
                   onClick={() => toggleStudentSelection(student.id)}
                 >
                   <div className="flex items-center space-x-2">
                     {/* Checkbox */}
                     <div className="flex-shrink-0">
                       <div className={`w-4 h-4 border-2 rounded transition-colors ${
                         selectedStudents.has(student.id)
                           ? 'bg-blue-600 border-blue-600'
                           : 'border-gray-400'
                       }`}>
                         {selectedStudents.has(student.id) && (
                           <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                        )}
                      </div>
                     </div>
                     
                     {/* Student Info */}
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                       <p className="text-xs text-gray-500 truncate">{student.email}</p>
                     </div>
                    </div>
                   
                   {/* Delete Button */}
                   {userRole === "Professor" && (
                     <Button
                       variant="default"
                       onClick={(e) => {
                         e.stopPropagation();
                         handleDeleteStudentClick(student);
                       }}
                       className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <X className="h-3 w-3 text-gray-400" />
                     </Button>
                   )}
            </Card>
               ))}
          </div>
        </div>
      </div>

                 {/* Action Buttons */}
         <div className="flex justify-between mt-6">
           <Button 
             onClick={() => window.location.href = '/grupos'}
             variant="default"
             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 h-auto"
           >
             Ver Turmas Existentes
           </Button>
                       <Button 
              onClick={handleCreateTurma}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 h-auto"
              disabled={selectedStudents.size === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar turma ({selectedStudents.size} alunos)
            </Button>
         </div>
       </div>

       {/* Confirmation Dialog */}
       <ConfirmationDialog
         isOpen={showDeleteDialog}
         onClose={() => setShowDeleteDialog(false)}
         onConfirm={confirmDeleteStudent}
         title="Remover Aluno"
         message={`Tem certeza que deseja remover o aluno "${studentToDelete?.name}" da turma? Esta ação não pode ser desfeita.`}
         confirmText="Remover"
         cancelText="Cancelar"
         type="danger"
       />
    </ProtectedRoute>
   )
}
