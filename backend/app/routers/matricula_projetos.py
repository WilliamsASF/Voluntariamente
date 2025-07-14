from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..database import get_db
from ..models import MatriculaProjetos
from ..schemas import MatriculaProjetosRead, MatriculaProjetosCreate, MatriculaProjetosUpdate
from .auth import get_current_user

router = APIRouter(prefix="/matriculas", tags=["matrículas"])

@router.get("/", response_model=List[MatriculaProjetosRead])
async def read_matriculas(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MatriculaProjetos).offset(skip).limit(limit))
    matriculas = result.scalars().all()
    return matriculas

@router.post("/", response_model=MatriculaProjetosRead)
async def create_matricula(
    matricula: MatriculaProjetosCreate, 
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_matricula = MatriculaProjetos(**matricula.dict())
    db.add(db_matricula)
    await db.commit()
    await db.refresh(db_matricula)
    return db_matricula
