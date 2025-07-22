from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/ongs",
    tags=["ongs"],
)

@router.post("/", response_model=schemas.ONGRead)
async def create_ong(ong: schemas.ONGCreate, db: AsyncSession = Depends(get_db)):
    db_ong = models.ONG(**ong.model_dump())
    db.add(db_ong)
    await db.commit()
    await db.refresh(db_ong)
    return db_ong

@router.get("/", response_model=list[schemas.ONGRead])
async def read_ongs(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.ONG).offset(skip).limit(limit))
    ongs = result.scalars().all()
    return ongs

@router.get("/{ong_id}", response_model=schemas.ONGRead)
async def read_ong(ong_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.ONG).filter(models.ONG.ngo_id == ong_id))
    db_ong = result.scalars().first()
    if db_ong is None:
        raise HTTPException(status_code=404, detail="ONG not found")
    return db_ong

@router.put("/{ong_id}", response_model=schemas.ONGRead)
async def update_ong(ong_id: int, ong: schemas.ONGUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.ONG).filter(models.ONG.ngo_id == ong_id))
    db_ong = result.scalars().first()
    if db_ong is None:
        raise HTTPException(status_code=404, detail="ONG not found")
    update_data = ong.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_ong, key, value)
    await db.commit()
    await db.refresh(db_ong)
    return db_ong

@router.delete("/{ong_id}", response_model=schemas.ONGRead)
async def delete_ong(ong_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.ONG).filter(models.ONG.ngo_id == ong_id))
    db_ong = result.scalars().first()
    if db_ong is None:
        raise HTTPException(status_code=404, detail="ONG not found")
    
    ong_data = schemas.ONGRead.model_validate(db_ong)
    
    await db.delete(db_ong)
    await db.commit()
    return ong_data