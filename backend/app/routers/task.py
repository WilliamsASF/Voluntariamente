from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from .. import models, schemas, database
from . import auth

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=schemas.TaskRead)
async def create_task(
    task: schemas.TaskCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Projeto).where(models.Projeto.projeto_id == task.projeto_id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[schemas.TaskRead])
async def read_tasks(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.Task)
        .options(selectinload(models.Task.projeto))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.get("/{task_id}", response_model=schemas.TaskRead)
async def read_task(
    task_id: int,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.Task)
        .options(
            selectinload(models.Task.projeto),
            selectinload(models.Task.task_estudantes)
        )
        .where(models.Task.task_id == task_id)
    )
    task = result.scalars().first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=schemas.TaskRead)
async def update_task(
    task_id: int,
    task_update: schemas.TaskUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Task).where(models.Task.task_id == task_id))
    db_task = result.scalars().first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    await db.commit()
    await db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Task).where(models.Task.task_id == task_id))
    db_task = result.scalars().first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await db.delete(db_task)
    await db.commit()
    return {"message": "Task deleted successfully"}

@router.get("/projeto/{projeto_id}", response_model=List[schemas.TaskRead])
async def read_tasks_by_projeto(
    projeto_id: int,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.Task)
        .where(models.Task.projeto_id == projeto_id)
    )
    return result.scalars().all()

@router.get("/status/{status}", response_model=List[schemas.TaskRead])
async def read_tasks_by_status(
    status: str,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.Task)
        .where(models.Task.status == status)
    )
    return result.scalars().all()
