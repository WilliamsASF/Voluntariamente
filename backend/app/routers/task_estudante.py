from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..database import get_db
from ..models import TaskEstudante
from ..schemas import TaskEstudanteRead, TaskEstudanteCreate, TaskEstudanteUpdate
from .auth import get_current_user

router = APIRouter(prefix="/task-estudantes", tags=["tarefas-estudantes"])

@router.get("/", response_model=List[TaskEstudanteRead])
async def read_task_estudantes(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TaskEstudante).offset(skip).limit(limit))
    task_estudantes = result.scalars().all()
    return task_estudantes

@router.post("/", response_model=TaskEstudanteRead)
async def create_task_estudante(
    task_estudante: TaskEstudanteCreate, 
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_task_estudante = TaskEstudante(**task_estudante.dict())
    db.add(db_task_estudante)
    await db.commit()
    await db.refresh(db_task_estudante)
    return db_task_estudante
