from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..database import get_db
from ..models import ONG
from ..schemas import ONGRead, ONGCreate, ONGUpdate
from .auth import get_current_user

router = APIRouter(prefix="/ongs", tags=["ongs"])

@router.get("/", response_model=List[ONGRead])
async def read_ongs(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ONG).offset(skip).limit(limit))
    ongs = result.scalars().all()
    return ongs

@router.get("/{ong_id}", response_model=ONGRead)
async def read_ong(ong_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ONG).where(ONG.ngo_id == ong_id))
    ong = result.scalar_one_or_none()
    if ong is None:
        raise HTTPException(status_code=404, detail="ONG não encontrada")
    return ong

@router.post("/", response_model=ONGRead)
async def create_ong(
    ong: ONGCreate, 
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Only admin can create ONGs
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Apenas administradores podem criar ONGs")
    
    db_ong = ONG(**ong.dict())
    db.add(db_ong)
    await db.commit()
    await db.refresh(db_ong)
    return db_ong

@router.put("/{ong_id}", response_model=ONGRead)
async def update_ong(
    ong_id: int, 
    ong_update: ONGUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Only admin can update ONGs
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Apenas administradores podem atualizar ONGs")
    
    result = await db.execute(select(ONG).where(ONG.ngo_id == ong_id))
    ong = result.scalar_one_or_none()
    if ong is None:
        raise HTTPException(status_code=404, detail="ONG não encontrada")
    
    update_data = ong_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ong, field, value)
    
    await db.commit()
    await db.refresh(ong)
    return ong
