from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from typing import List
from .. import models, schemas, database
from . import auth

router = APIRouter(prefix="/matriculas", tags=["matriculas"])

@router.post("/", response_model=schemas.MatriculaProjetosRead)
async def create_matricula(
    matricula: schemas.MatriculaProjetosCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Estudante).where(models.Estudante.student_id == matricula.student_id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Student not found")
    
    result = await db.execute(select(models.Projeto).where(models.Projeto.projeto_id == matricula.projeto_id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        db_matricula = models.MatriculaProjetos(**matricula.dict())
        db.add(db_matricula)
        await db.commit()
        await db.refresh(db_matricula)
        return db_matricula
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400, 
            detail="Student is already enrolled in this project"
        )

@router.get("/", response_model=List[schemas.MatriculaProjetosRead])
async def read_matriculas(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.MatriculaProjetos)
        .options(
            selectinload(models.MatriculaProjetos.estudante),
            selectinload(models.MatriculaProjetos.projeto)
        )
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.get("/{matricula_id}", response_model=schemas.MatriculaProjetosRead)
async def read_matricula(
    matricula_id: int,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.MatriculaProjetos)
        .options(
            selectinload(models.MatriculaProjetos.estudante),
            selectinload(models.MatriculaProjetos.projeto)
        )
        .where(models.MatriculaProjetos.matricula_id == matricula_id)
    )
    matricula = result.scalars().first()
    if matricula is None:
        raise HTTPException(status_code=404, detail="Matricula not found")
    return matricula

@router.put("/{matricula_id}", response_model=schemas.MatriculaProjetosRead)
async def update_matricula(
    matricula_id: int,
    matricula_update: schemas.MatriculaProjetosUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.MatriculaProjetos).where(models.MatriculaProjetos.matricula_id == matricula_id))
    db_matricula = result.scalars().first()
    if db_matricula is None:
        raise HTTPException(status_code=404, detail="Matricula not found")
    
    update_data = matricula_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_matricula, field, value)
    
    await db.commit()
    await db.refresh(db_matricula)
    return db_matricula

@router.delete("/{matricula_id}")
async def delete_matricula(
    matricula_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.MatriculaProjetos).where(models.MatriculaProjetos.matricula_id == matricula_id))
    db_matricula = result.scalars().first()
    if db_matricula is None:
        raise HTTPException(status_code=404, detail="Matricula not found")
    
    await db.delete(db_matricula)
    await db.commit()
    return {"message": "Matricula deleted successfully"}

@router.get("/student/{student_id}", response_model=List[schemas.MatriculaProjetosRead])
async def read_matriculas_by_student(
    student_id: int,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.MatriculaProjetos)
        .options(selectinload(models.MatriculaProjetos.projeto))
        .where(models.MatriculaProjetos.student_id == student_id)
    )
    return result.scalars().all()

@router.get("/project/{projeto_id}", response_model=List[schemas.MatriculaProjetosRead])
async def read_matriculas_by_project(
    projeto_id: int,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.MatriculaProjetos)
        .options(selectinload(models.MatriculaProjetos.estudante))
        .where(models.MatriculaProjetos.projeto_id == projeto_id)
    )
    return result.scalars().all()