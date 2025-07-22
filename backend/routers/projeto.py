from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from .. import models, schemas, auth, database

router = APIRouter(prefix="/projetos", tags=["projetos"])

@router.post("/", response_model=schemas.ProjetoRead)
async def create_projeto(
    projeto: schemas.ProjetoCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
   
    db_projeto = models.Projeto(**projeto.dict())
    db.add(db_projeto)
    await db.commit()
    await db.refresh(db_projeto)
    return db_projeto

@router.get("/", response_model=List[schemas.ProjetoRead])
async def read_projetos(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(database.get_db)
):
    
    result = await db.execute(
        select(models.Projeto)
        .options(
            selectinload(models.Projeto.disciplina),
            selectinload(models.Projeto.ong)
        )
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.get("/{projeto_id}", response_model=schemas.ProjetoRead)
async def read_projeto(
    projeto_id: int,
    db: AsyncSession = Depends(database.get_db)
):
    
    result = await db.execute(
        select(models.Projeto)
        .options(
            selectinload(models.Projeto.disciplina),
            selectinload(models.Projeto.ong),
            selectinload(models.Projeto.tasks),
            selectinload(models.Projeto.matriculas)
        )
        .where(models.Projeto.projeto_id == projeto_id)
    )
    projeto = result.scalars().first()
    if projeto is None:
        raise HTTPException(status_code=404, detail="Projeto not found")
    return projeto

@router.put("/{projeto_id}", response_model=schemas.ProjetoRead)
async def update_projeto(
    projeto_id: int,
    projeto_update: schemas.ProjetoUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Projeto).where(models.Projeto.projeto_id == projeto_id))
    db_projeto = result.scalars().first()
    if db_projeto is None:
        raise HTTPException(status_code=404, detail="Projeto not found")
    
    update_data = projeto_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_projeto, field, value)
    
    await db.commit()
    await db.refresh(db_projeto)
    return db_projeto

@router.delete("/{projeto_id}")
async def delete_projeto(
    projeto_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    
    result = await db.execute(select(models.Projeto).where(models.Projeto.projeto_id == projeto_id))
    db_projeto = result.scalars().first()
    if db_projeto is None:
        raise HTTPException(status_code=404, detail="Projeto not found")
    
    await db.delete(db_projeto)
    await db.commit()
    return {"message": "Projeto deleted successfully"}

@router.get("/disciplina/{disciplina_id}", response_model=List[schemas.ProjetoRead])
async def read_projetos_by_disciplina(
    disciplina_id: int,
    db: AsyncSession = Depends(database.get_db)
):

    result = await db.execute(
        select(models.Projeto)
        .where(models.Projeto.disciplina_id == disciplina_id)
    )
    return result.scalars().all()

@router.get("/ong/{ngo_id}", response_model=List[schemas.ProjetoRead])
async def read_projetos_by_ong(
    ngo_id: int,
    db: AsyncSession = Depends(database.get_db)
):
   
    result = await db.execute(
        select(models.Projeto)
        .where(models.Projeto.ngo_id == ngo_id)
    )
    return result.scalars().all()