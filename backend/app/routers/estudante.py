from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/estudantes",
    tags=["estudantes"],
)

@router.post("/", response_model=schemas.EstudanteRead)
def create_estudante(estudante: schemas.EstudanteCreate, db: Session = Depends(get_db)):
    db_estudante = models.Estudante(**estudante.dict())
    db.add(db_estudante)
    db.commit()
    db.refresh(db_estudante)
    return db_estudante

@router.get("/", response_model=list[schemas.EstudanteRead])
def read_estudantes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    estudantes = db.query(models.Estudante).offset(skip).limit(limit).all()
    return estudantes

@router.get("/{estudante_id}", response_model=schemas.EstudanteRead)
def read_estudante(estudante_id: int, db: Session = Depends(get_db)):
    db_estudante = db.query(models.Estudante).filter(models.Estudante.student_id == estudante_id).first()
    if db_estudante is None:
        raise HTTPException(status_code=404, detail="Estudante not found")
    return db_estudante

@router.put("/{estudante_id}", response_model=schemas.EstudanteRead)
def update_estudante(estudante_id: int, estudante: schemas.EstudanteUpdate, db: Session = Depends(get_db)):
    db_estudante = db.query(models.Estudante).filter(models.Estudante.student_id == estudante_id).first()
    if db_estudante is None:
        raise HTTPException(status_code=404, detail="Estudante not found")
    update_data = estudante.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_estudante, key, value)
    db.commit()
    db.refresh(db_estudante)
    return db_estudante

@router.delete("/{estudante_id}", response_model=schemas.EstudanteRead)
def delete_estudante(estudante_id: int, db: Session = Depends(get_db)):
    db_estudante = db.query(models.Estudante).filter(models.Estudante.student_id == estudante_id).first()
    if db_estudante is None:
        raise HTTPException(status_code=404, detail="Estudante not found")
    db.delete(db_estudante)
    db.commit()
    return db_estudante