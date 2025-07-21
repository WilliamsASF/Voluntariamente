from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/estudantes",
    tags=["estudantes"],
)

@router.post("/", response_model=schemas.EstudanteRead)
async def create_estudante(estudante: schemas.EstudanteCreate, db: AsyncSession = Depends(get_db)):
    db_estudante = models.Estudante(**estudante.model_dump())
    db.add(db_estudante)
    await db.commit()
    await db.refresh(db_estudante)
    return db_estudante

@router.get("/", response_model=list[schemas.EstudanteRead])
async def read_estudantes(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Estudante).offset(skip).limit(limit))
    estudantes = result.scalars().all()
    return estudantes

@router.get("/{estudante_id}", response_model=schemas.EstudanteRead)
async def read_estudante(estudante_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Estudante).filter(models.Estudante.student_id == estudante_id))
    db_estudante = result.scalars().first()
    if db_estudante is None:
        raise HTTPException(status_code=404, detail="Estudante not found")
    return db_estudante

@router.put("/{estudante_id}", response_model=schemas.EstudanteRead)
async def update_estudante(estudante_id: int, estudante: schemas.EstudanteUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Estudante).filter(models.Estudante.student_id == estudante_id))
    db_estudante = result.scalars().first()
    if db_estudante is None:
        raise HTTPException(status_code=404, detail="Estudante not found")
    update_data = estudante.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_estudante, key, value)
    await db.commit()
    await db.refresh(db_estudante)
    return db_estudante

@router.delete("/{estudante_id}", response_model=schemas.EstudanteRead)
async def delete_estudante(estudante_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Estudante).filter(models.Estudante.student_id == estudante_id))
    db_estudante = result.scalars().first()
    if db_estudante is None:
        raise HTTPException(status_code=404, detail="Estudante not found")
    
    estudante_data = schemas.EstudanteRead.model_validate(db_estudante)
    
    await db.delete(db_estudante)
    await db.commit()
    return estudante_data