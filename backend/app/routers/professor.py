from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from ..database import get_db
from ..models import Professor, User
from ..schemas import ProfessorRead, ProfessorCreate, ProfessorUpdate
from .auth import get_current_user

router = APIRouter(prefix="/professores", tags=["professores"])

@router.get("/", response_model=List[ProfessorRead])
async def read_professores(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Professor)
        .options(selectinload(Professor.user))
        .offset(skip)
        .limit(limit)
    )
    professores = result.scalars().all()
    return professores

@router.get("/{professor_id}", response_model=ProfessorRead)
async def read_professor(professor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Professor)
        .options(selectinload(Professor.user))
        .where(Professor.professor_id == professor_id)
    )
    professor = result.scalar_one_or_none()
    if professor is None:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    return professor

@router.post("/", response_model=ProfessorRead)
async def create_professor(
    professor: ProfessorCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if user_id exists
    result = await db.execute(select(User).where(User.user_id == professor.user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Check if user already has a professor profile
    existing_professor = await db.execute(
        select(Professor).where(Professor.user_id == professor.user_id)
    )
    if existing_professor.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Usuário já possui um perfil de professor")
    
    # Create professor
    db_professor = Professor(**professor.dict())
    db.add(db_professor)
    await db.commit()
    await db.refresh(db_professor)
    
    # Load user relationship
    result = await db.execute(
        select(Professor)
        .options(selectinload(Professor.user))
        .where(Professor.professor_id == db_professor.professor_id)
    )
    return result.scalar_one()

@router.put("/{professor_id}", response_model=ProfessorRead)
async def update_professor(
    professor_id: int, 
    professor_update: ProfessorUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get professor
    result = await db.execute(
        select(Professor)
        .options(selectinload(Professor.user))
        .where(Professor.professor_id == professor_id)
    )
    professor = result.scalar_one_or_none()
    if professor is None:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    # Check permissions (owner or admin)
    if current_user.user_id != professor.user_id and current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Permissões insuficientes")
    
    # Update fields
    update_data = professor_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(professor, field, value)
    
    await db.commit()
    await db.refresh(professor)
    return professor
