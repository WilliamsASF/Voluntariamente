from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/ongs",
    tags=["ongs"],
)

@router.post("/", response_model=schemas.ONGRead)
def create_ong(ong: schemas.ONGCreate, db: Session = Depends(get_db)):
    db_ong = models.ONG(**ong.dict())
    db.add(db_ong)
    db.commit()
    db.refresh(db_ong)
    return db_ong

@router.get("/", response_model=list[schemas.ONGRead])
def read_ongs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ongs = db.query(models.ONG).offset(skip).limit(limit).all()
    return ongs

@router.get("/{ong_id}", response_model=schemas.ONGRead)
def read_ong(ong_id: int, db: Session = Depends(get_db)):
    db_ong = db.query(models.ONG).filter(models.ONG.ngo_id == ong_id).first()
    if db_ong is None:
        raise HTTPException(status_code=404, detail="ONG not found")
    return db_ong

@router.put("/{ong_id}", response_model=schemas.ONGRead)
def update_ong(ong_id: int, ong: schemas.ONGUpdate, db: Session = Depends(get_db)):
    db_ong = db.query(models.ONG).filter(models.ONG.ngo_id == ong_id).first()
    if db_ong is None:
        raise HTTPException(status_code=404, detail="ONG not found")
    update_data = ong.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_ong, key, value)
    db.commit()
    db.refresh(db_ong)
    return db_ong

@router.delete("/{ong_id}", response_model=schemas.ONGRead)
def delete_ong(ong_id: int, db: Session = Depends(get_db)):
    db_ong = db.query(models.ONG).filter(models.ONG.ngo_id == ong_id).first()
    if db_ong is None:
        raise HTTPException(status_code=404, detail="ONG not found")
    db.delete(db_ong)
    db.commit()
    return db_ong