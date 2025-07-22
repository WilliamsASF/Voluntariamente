from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from typing import List
from .. import models, schemas, database
from . import auth

router = APIRouter(prefix="/task-estudantes", tags=["task-estudantes"])

@router.post("/", response_model=schemas.TaskEstudanteRead)
async def create_task_estudante(
    task_estudante: schemas.TaskEstudanteCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Estudante).where(models.Estudante.student_id == task_estudante.student_id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Student not found")
    
    result = await db.execute(select(models.Task).where(models.Task.task_id == task_estudante.task_id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Task not found")
    
    try:
        db_task_estudante = models.TaskEstudante(**task_estudante.dict())
        db.add(db_task_estudante)
        await db.commit()
        await db.refresh(db_task_estudante)
        return db_task_estudante
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400, 
            detail="Task is already assigned to this student"
        )

@router.get("/", response_model=List[schemas.TaskEstudanteRead])
async def read_task_estudantes(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.TaskEstudante)
        .options(
            selectinload(models.TaskEstudante.estudante),
            selectinload(models.TaskEstudante.task)
        )
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.get("/{estud_task_id}", response_model=schemas.TaskEstudanteRead)
async def read_task_estudante(
    estud_task_id: int,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.TaskEstudante)
        .options(
            selectinload(models.TaskEstudante.estudante),
            selectinload(models.TaskEstudante.task)
        )
        .where(models.TaskEstudante.estud_task_id == estud_task_id)
    )
    task_estudante = result.scalars().first()
    if task_estudante is None:
        raise HTTPException(status_code=404, detail="Task assignment not found")
    return task_estudante

@router.put("/{estud_task_id}", response_model=schemas.TaskEstudanteRead)
async def update_task_estudante(
    estud_task_id: int,
    task_estudante_update: schemas.TaskEstudanteUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.TaskEstudante).where(models.TaskEstudante.estud_task_id == estud_task_id))
    db_task_estudante = result.scalars().first()
    if db_task_estudante is None:
        raise HTTPException(status_code=404, detail="Task assignment not found")
    
    update_data = task_estudante_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task_estudante, field, value)
    
    await db.commit()
    await db.refresh(db_task_estudante)
    return db_task_estudante

@router.delete("/{estud_task_id}")
async def delete_task_estudante(
    estud_task_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.TaskEstudante).where(models.TaskEstudante.estud_task_id == estud_task_id))
    db_task_estudante = result.scalars().first()
    if db_task_estudante is None:
        raise HTTPException(status_code=404, detail="Task assignment not found")
    
    await db.delete(db_task_estudante)
    await db.commit()
    return {"message": "Task assignment deleted successfully"}

@router.get("/student/{student_id}", response_model=List[schemas.TaskEstudanteRead])
async def read_task_estudantes_by_student(
    student_id: int,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.TaskEstudante)
        .options(selectinload(models.TaskEstudante.task))
        .where(models.TaskEstudante.student_id == student_id)
    )
    return result.scalars().all()

@router.get("/task/{task_id}", response_model=List[schemas.TaskEstudanteRead])
async def read_task_estudantes_by_task(
    task_id: int,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.TaskEstudante)
        .options(selectinload(models.TaskEstudante.estudante))
        .where(models.TaskEstudante.task_id == task_id)
    )
    return result.scalars().all()

@router.get("/status/{status}", response_model=List[schemas.TaskEstudanteRead])
async def read_task_estudantes_by_status(
    status: str,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.TaskEstudante)
        .options(
            selectinload(models.TaskEstudante.estudante),
            selectinload(models.TaskEstudante.task)
        )
        .where(models.TaskEstudante.status == status)
    )
    return result.scalars().all()
