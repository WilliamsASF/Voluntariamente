from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from .. import models, schemas, auth, database

router = APIRouter(prefix="/disciplinas", tags=["disciplinas"])

@router.post("/", response_model=schemas.DisciplinaRead)
async def create_disciplina(
    disciplina: schemas.DisciplinaCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if disciplina.professor_id:
        result = await db.execute(select(models.Professor).where(models.Professor.professor_id == disciplina.professor_id))
        if not result.scalars().first():
            raise HTTPException(status_code=404, detail="Professor not found")
    
    db_disciplina = models.Disciplina(**disciplina.dict())
    db.add(db_disciplina)
    await db.commit()
    await db.refresh(db_disciplina)
    return db_disciplina

@router.get("/", response_model=List[schemas.DisciplinaRead])
async def read_disciplinas(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.Disciplina)
        .options(selectinload(models.Disciplina.professor))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.get("/{disciplina_id}", response_model=schemas.DisciplinaRead)
async def read_disciplina(
    disciplina_id: int,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.Disciplina)
        .options(
            selectinload(models.Disciplina.professor),
            selectinload(models.Disciplina.projetos)
        )
        .where(models.Disciplina.disciplina_id == disciplina_id)
    )
    disciplina = result.scalars().first()
    if disciplina is None:
        raise HTTPException(status_code=404, detail="Disciplina not found")
    return disciplina

@router.put("/{disciplina_id}", response_model=schemas.DisciplinaRead)
async def update_disciplina(
    disciplina_id: int,
    disciplina_update: schemas.DisciplinaUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Disciplina).where(models.Disciplina.disciplina_id == disciplina_id))
    db_disciplina = result.scalars().first()
    if db_disciplina is None:
        raise HTTPException(status_code=404, detail="Disciplina not found")
    
    update_data = disciplina_update.dict(exclude_unset=True)
    if 'professor_id' in update_data and update_data['professor_id']:
        result = await db.execute(select(models.Professor).where(models.Professor.professor_id == update_data['professor_id']))
        if not result.scalars().first():
            raise HTTPException(status_code=404, detail="Professor not found")
    
    for field, value in update_data.items():
        setattr(db_disciplina, field, value)
    
    await db.commit()
    await db.refresh(db_disciplina)
    return db_disciplina

@router.delete("/{disciplina_id}")
async def delete_disciplina(
    disciplina_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Disciplina).where(models.Disciplina.disciplina_id == disciplina_id))
    db_disciplina = result.scalars().first()
    if db_disciplina is None:
        raise HTTPException(status_code=404, detail="Disciplina not found")
    
    await db.delete(db_disciplina)
    await db.commit()
    return {"message": "Disciplina deleted successfully"}

@router.get("/professor/{professor_id}", response_model=List[schemas.DisciplinaRead])
async def read_disciplinas_by_professor(
    professor_id: int,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.Disciplina)
        .where(models.Disciplina.professor_id == professor_id)
    )
    return result.scalars().all()

@router.get("/search/{nome}", response_model=List[schemas.DisciplinaRead])
async def search_disciplinas_by_name(
    nome: str,
    db: AsyncSession = Depends(database.get_db)
):
    result = await db.execute(
        select(models.Disciplina)
        .options(selectinload(models.Disciplina.professor))
        .where(models.Disciplina.nome_disciplina.ilike(f"%{nome}%"))
    )
    return result.scalars().all()
