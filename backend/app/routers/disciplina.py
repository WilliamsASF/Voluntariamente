from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..database import get_db
from ..models import Disciplina
from ..schemas import DisciplinaRead, DisciplinaCreate
from .auth import get_current_user

router = APIRouter(prefix="/disciplinas", tags=["disciplinas"])

@router.get("/", response_model=List[DisciplinaRead])
async def read_disciplinas(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Disciplina).offset(skip).limit(limit))
    disciplinas = result.scalars().all()
    return disciplinas

@router.get("/{disciplina_id}", response_model=DisciplinaRead)
async def read_disciplina(disciplina_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Disciplina).where(Disciplina.disciplina_id == disciplina_id))
    disciplina = result.scalar_one_or_none()
    if disciplina is None:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    return disciplina

@router.post("/", response_model=DisciplinaRead)
async def create_disciplina(
    disciplina: DisciplinaCreate, 
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_disciplina = Disciplina(**disciplina.dict())
    db.add(db_disciplina)
    await db.commit()
    await db.refresh(db_disciplina)
    return db_disciplina
