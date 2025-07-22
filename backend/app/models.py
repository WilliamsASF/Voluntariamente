from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "User"
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    professor = relationship("Professor", uselist=False, back_populates="user")
    estudante = relationship("Estudante", uselist=False, back_populates="user")

class Professor(Base):
    __tablename__ = "Professor"
    professor_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("User.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    vinculo = Column(String(255))
    departamento = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user = relationship("User", back_populates="professor")
    disciplinas = relationship("Disciplina", back_populates="professor")

class Estudante(Base):
    __tablename__ = "Estudante"
    student_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("User.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    vinculo = Column(String(255))
    curso = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user = relationship("User", back_populates="estudante")
    matriculas = relationship("MatriculaProjetos", back_populates="estudante")
    task_estudantes = relationship("TaskEstudante", back_populates="estudante")

class ONG(Base):
    __tablename__ = "ONG"
    ngo_id = Column(Integer, primary_key=True, index=True)
    ngo_name = Column(String(255), nullable=False)
    description = Column(Text)
    email = Column(String(255))
    phone = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    projetos = relationship("Projeto", back_populates="ong")

class Disciplina(Base):
    __tablename__ = "Disciplina"
    disciplina_id = Column(Integer, primary_key=True, index=True)
    professor_id = Column(Integer, ForeignKey("Professor.professor_id"))
    nome_disciplina = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    professor = relationship("Professor", back_populates="disciplinas")
    projetos = relationship("Projeto", back_populates="disciplina")

class Projeto(Base):
    __tablename__ = "Projeto"
    projeto_id = Column(Integer, primary_key=True, index=True)
    disciplina_id = Column(Integer, ForeignKey("Disciplina.disciplina_id"))
    ngo_id = Column(Integer, ForeignKey("ONG.ngo_id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    disciplina = relationship("Disciplina", back_populates="projetos")
    ong = relationship("ONG", back_populates="projetos")
    tasks = relationship("Task", back_populates="projeto")
    matriculas = relationship("MatriculaProjetos", back_populates="projeto")

class Task(Base):
    __tablename__ = "Task"
    task_id = Column(Integer, primary_key=True, index=True)
    projeto_id = Column(Integer, ForeignKey("Projeto.projeto_id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50))
    status = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    projeto = relationship("Projeto", back_populates="tasks")
    task_estudantes = relationship("TaskEstudante", back_populates="task")

class MatriculaProjetos(Base):
    __tablename__ = "Matricula_Projetos"
    matricula_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("Estudante.student_id", ondelete="CASCADE"), nullable=False)
    projeto_id = Column(Integer, ForeignKey("Projeto.projeto_id", ondelete="CASCADE"), nullable=False)
    matricula_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    estudante = relationship("Estudante", back_populates="matriculas")
    projeto = relationship("Projeto", back_populates="matriculas")
    __table_args__ = (UniqueConstraint('student_id', 'projeto_id', name='_student_projeto_uc'),)

class TaskEstudante(Base):
    __tablename__ = "Task_estudante"
    estud_task_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("Estudante.student_id", ondelete="CASCADE"), nullable=False)
    task_id = Column(Integer, ForeignKey("Task.task_id", ondelete="CASCADE"), nullable=False)
    assigned_date = Column(Date)
    deadline_date = Column(Date)
    status = Column(String(50))
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    estudante = relationship("Estudante", back_populates="task_estudantes")
    task = relationship("Task", back_populates="task_estudantes")
    __table_args__ = (UniqueConstraint('student_id', 'task_id', name='_student_task_uc'),) 