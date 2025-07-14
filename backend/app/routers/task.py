from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..database import get_db
from ..models import Task
from ..schemas import TaskRead, TaskCreate, TaskUpdate
from .auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["tarefas"])

@router.get("/", response_model=List[TaskRead])
async def read_tasks(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).offset(skip).limit(limit))
    tasks = result.scalars().all()
    return tasks

@router.get("/{task_id}", response_model=TaskRead)
async def read_task(task_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.task_id == task_id))
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return task

@router.post("/", response_model=TaskRead)
async def create_task(
    task: TaskCreate, 
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_task = Task(**task.dict())
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task
