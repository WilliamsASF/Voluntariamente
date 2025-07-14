from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from ..database import get_db
from ..models import Estudante, User
from ..schemas import EstudanteRead, EstudanteCreate, EstudanteUpdate
from .auth import get_current_user

router = APIRouter(prefix="/estudantes", tags=["estudantes"])

@router.get("/", response_model=List[EstudanteRead])
async def read_estudantes(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Estudante)
        .options(selectinload(Estudante.user))
        .offset(skip)
        .limit(limit)
    )
    estudantes = result.scalars().all()
    return estudantes

@router.get("/{estudante_id}", response_model=EstudanteRead)
async def read_estudante(estudante_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Estudante)
        .options(selectinload(Estudante.user))
        .where(Estudante.student_id == estudante_id)
    )
    estudante = result.scalar_one_or_none()
    if estudante is None:
        raise HTTPException(status_code=404, detail="Estudante não encontrado")
    return estudante

@router.post("/", response_model=EstudanteRead)
async def create_estudante(
    estudante: EstudanteCreate, 
    db: AsyncSession = Depends(get_db)
):
    # Verificar se o user_id existe e não está associado a outro estudante
    result = await db.execute(select(User).where(User.user_id == estudante.user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Verificar se o usuário já possui um perfil de estudante
    existing_estudante = await db.execute(
        select(Estudante).where(Estudante.user_id == estudante.user_id)
    )
    if existing_estudante.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Usuário já possui um perfil de estudante")
    
    # Criar estudante
    db_estudante = Estudante(**estudante.dict())
    db.add(db_estudante)
    await db.commit()
    await db.refresh(db_estudante)
    
    # Carregar relacionamento com usuário
    result = await db.execute(
        select(Estudante)
        .options(selectinload(Estudante.user))
        .where(Estudante.student_id == db_estudante.student_id)
    )
    return result.scalar_one()

@router.put("/{estudante_id}", response_model=EstudanteRead)
async def update_estudante(
    estudante_id: int, 
    estudante_update: EstudanteUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get estudante
    result = await db.execute(
        select(Estudante)
        .options(selectinload(Estudante.user))
        .where(Estudante.student_id == estudante_id)
    )
    estudante = result.scalar_one_or_none()
    if estudante is None:
        raise HTTPException(status_code=404, detail="Estudante não encontrado")
    
    # Check permissions (owner or admin)
    if current_user.user_id != estudante.user_id and current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Permissões insuficientes")
    
    # Atualizar campos
    update_data = estudante_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(estudante, field, value)
    
    await db.commit()
    await db.refresh(estudante)
    return estudante

@router.delete("/{estudante_id}")
async def delete_estudante(
    estudante_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get estudante
    result = await db.execute(select(Estudante).where(Estudante.student_id == estudante_id))
    estudante = result.scalar_one_or_none()
    if estudante is None:
        raise HTTPException(status_code=404, detail="Estudante não encontrado")
    
    # Check permissions (owner or admin)
    if current_user.user_id != estudante.user_id and current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Permissões insuficientes")
    
    await db.delete(estudante)
    await db.commit()
    return {"message": "Estudante excluído com sucesso"}

@router.get("/me/projetos")
async def get_my_projetos(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Buscar projetos nos quais o usuário atual (estudante) está matriculado"""
    # Buscar o perfil de estudante do usuário atual
    result = await db.execute(
        select(Estudante)
        .options(selectinload(Estudante.matriculas))
        .where(Estudante.user_id == current_user.user_id)
    )
    estudante = result.scalar_one_or_none()
    if estudante is None:
        raise HTTPException(status_code=404, detail="Perfil de estudante não encontrado")
    
    return estudante.matriculas
