from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..database import get_db
from ..models import Projeto
from ..schemas import ProjetoRead, ProjetoCreate, ProjetoUpdate
from .auth import get_current_user

router = APIRouter(prefix="/projetos", tags=["projetos"])

@router.get("/", response_model=List[ProjetoRead])
async def read_projetos(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Projeto).offset(skip).limit(limit))
    projetos = result.scalars().all()
    return projetos

@router.get("/{projeto_id}", response_model=ProjetoRead)
async def read_projeto(projeto_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Projeto).where(Projeto.projeto_id == projeto_id))
    projeto = result.scalar_one_or_none()
    if projeto is None:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return projeto

@router.post("/", response_model=ProjetoRead)
async def create_projeto(
    projeto: ProjetoCreate, 
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_projeto = Projeto(**projeto.dict())
    db.add(db_projeto)
    await db.commit()
    await db.refresh(db_projeto)
    return db_projeto
