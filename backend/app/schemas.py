from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    user_id: int
    class Config:
        orm_mode = True

class UserInDB(UserBase):
    user_id: int
    password: str
    class Config:
        orm_mode = True

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
    vinculo: str = None
    departamento: str = None

class ProfessorCreate(ProfessorBase):
    pass

class ProfessorRead(ProfessorBase):
    professor_id: int
    class Config:
        orm_mode = True

class ProfessorUpdate(BaseModel):
    full_name: str = None
    vinculo: str = None
    departamento: str = None 

class EstudanteBase(BaseModel):
    user_id: int
    full_name: str
    vinculo: str = None
    curso: str = None

class EstudanteCreate(EstudanteBase):
    pass

class EstudanteRead(EstudanteBase):
    student_id: int
    class Config:
        orm_mode = True

class EstudanteUpdate(BaseModel):
    full_name: str = None
    vinculo: str = None
    curso: str = None 

class ONGBase(BaseModel):
    ngo_name: str
    description: str = None
    email: str = None
    phone: str = None

class ONGCreate(ONGBase):
    pass

class ONGRead(ONGBase):
    ngo_id: int
    class Config:
        orm_mode = True

class ONGUpdate(BaseModel):
    ngo_name: str = None
    description: str = None
    email: str = None
    phone: str = None 

class DisciplinaBase(BaseModel):
    professor_id: int = None
    nome_disciplina: str
    description: str = None

class DisciplinaCreate(DisciplinaBase):
    pass

class DisciplinaRead(DisciplinaBase):
    disciplina_id: int
    class Config:
        orm_mode = True

class DisciplinaUpdate(BaseModel):
    professor_id: int = None
    nome_disciplina: str = None
    description: str = None 

class ProjetoBase(BaseModel):
    disciplina_id: int = None
    ngo_id: int = None
    name: str
    description: str = None
    start_date: str = None
    end_date: str = None
    status: str = None

class ProjetoCreate(ProjetoBase):
    pass

class ProjetoRead(ProjetoBase):
    projeto_id: int
    class Config:
        orm_mode = True

class ProjetoUpdate(BaseModel):
    disciplina_id: int = None
    ngo_id: int = None
    name: str = None
    description: str = None
    start_date: str = None
    end_date: str = None
    status: str = None 

class TaskBase(BaseModel):
    projeto_id: int
    name: str
    description: str = None
    type: str = None
    status: str = None

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    task_id: int
    class Config:
        orm_mode = True

class TaskUpdate(BaseModel):
    name: str = None
    description: str = None
    type: str = None
    status: str = None 

class MatriculaProjetosBase(BaseModel):
    student_id: int
    projeto_id: int
    matricula_date: str = None
    status: str = None

class MatriculaProjetosCreate(MatriculaProjetosBase):
    pass

class MatriculaProjetosRead(MatriculaProjetosBase):
    matricula_id: int
    class Config:
        orm_mode = True

class MatriculaProjetosUpdate(BaseModel):
    matricula_date: str = None
    status: str = None 

class TaskEstudanteBase(BaseModel):
    student_id: int
    task_id: int
    assigned_date: str = None
    deadline_date: str = None
    status: str = None
    description: str = None

class TaskEstudanteCreate(TaskEstudanteBase):
    pass

class TaskEstudanteRead(TaskEstudanteBase):
    estud_task_id: int
    class Config:
        orm_mode = True

class TaskEstudanteUpdate(BaseModel):
    assigned_date: str = None
    deadline_date: str = None
    status: str = None
    description: str = None 