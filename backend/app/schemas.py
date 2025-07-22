from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)
    user_id: int

class UserInDB(UserBase):
    model_config = ConfigDict(from_attributes=True)
    user_id: int
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    password: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None 

class ProfessorBase(BaseModel):
    user_id: int
    full_name: str
    vinculo: Optional[str] = None
    departamento: Optional[str] = None

class ProfessorCreate(ProfessorBase):
    pass

class ProfessorRead(ProfessorBase):
    model_config = ConfigDict(from_attributes=True)
    professor_id: int

class ProfessorUpdate(BaseModel):
    full_name: Optional[str] = None
    vinculo: Optional[str] = None
    departamento: Optional[str] = None 

class EstudanteBase(BaseModel):
    user_id: int
    full_name: str
    vinculo: Optional[str] = None
    curso: Optional[str] = None

class EstudanteCreate(EstudanteBase):
    pass

class EstudanteRead(EstudanteBase):
    model_config = ConfigDict(from_attributes=True)
    student_id: int

class EstudanteUpdate(BaseModel):
    full_name: Optional[str] = None
    vinculo: Optional[str] = None
    curso: Optional[str] = None 

class ONGBase(BaseModel):
    ngo_name: str
    description: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class ONGCreate(ONGBase):
    pass

class ONGRead(ONGBase):
    model_config = ConfigDict(from_attributes=True)
    ngo_id: int

class ONGUpdate(BaseModel):
    ngo_name: Optional[str] = None
    description: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None 

class DisciplinaBase(BaseModel):
    professor_id: Optional[int] = None
    nome_disciplina: str
    description: Optional[str] = None

class DisciplinaCreate(DisciplinaBase):
    pass

class DisciplinaRead(DisciplinaBase):
    model_config = ConfigDict(from_attributes=True)
    disciplina_id: int

class DisciplinaUpdate(BaseModel):
    professor_id: Optional[int] = None
    nome_disciplina: Optional[str] = None
    description: Optional[str] = None 

class ProjetoBase(BaseModel):
    disciplina_id: Optional[int] = None
    ngo_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Optional[str] = None

class ProjetoCreate(ProjetoBase):
    pass

class ProjetoRead(ProjetoBase):
    model_config = ConfigDict(from_attributes=True)
    projeto_id: int

class ProjetoUpdate(BaseModel):
    disciplina_id: Optional[int] = None
    ngo_id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Optional[str] = None 

class TaskBase(BaseModel):
    projeto_id: int
    name: str
    description: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    model_config = ConfigDict(from_attributes=True)
    task_id: int

class TaskUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None 

class MatriculaProjetosBase(BaseModel):
    student_id: int
    projeto_id: int
    matricula_date: Optional[datetime] = None
    status: Optional[str] = None

class MatriculaProjetosCreate(MatriculaProjetosBase):
    pass

class MatriculaProjetosRead(MatriculaProjetosBase):
    model_config = ConfigDict(from_attributes=True)
    matricula_id: int

class MatriculaProjetosUpdate(BaseModel):
    matricula_date: Optional[datetime] = None
    status: Optional[str] = None 

class TaskEstudanteBase(BaseModel):
    student_id: int
    task_id: int
    assigned_date: Optional[str] = None
    deadline_date: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None

class TaskEstudanteCreate(TaskEstudanteBase):
    pass

class TaskEstudanteRead(TaskEstudanteBase):
    model_config = ConfigDict(from_attributes=True)
    estud_task_id: int

class TaskEstudanteUpdate(BaseModel):
    assigned_date: Optional[str] = None
    deadline_date: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None 