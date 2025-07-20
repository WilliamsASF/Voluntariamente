from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/professores",
    tags=["professores"],
)

@router.post("/", response_model=schemas.ProfessorRead)
def create_professor(professor: schemas.ProfessorCreate, db: Session = Depends(get_db)):
    db_professor = models.Professor(**professor.dict())
    db.add(db_professor)
    db.commit()
    db.refresh(db_professor)
    return db_professor

@router.get("/", response_model=list[schemas.ProfessorRead])
def read_professores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    professores = db.query(models.Professor).offset(skip).limit(limit).all()
    return professores

@router.get("/{professor_id}", response_model=schemas.ProfessorRead)
def read_professor(professor_id: int, db: Session = Depends(get_db)):
    db_professor = db.query(models.Professor).filter(models.Professor.professor_id == professor_id).first()
    if db_professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    return db_professor

@router.put("/{professor_id}", response_model=schemas.ProfessorRead)
def update_professor(professor_id: int, professor: schemas.ProfessorUpdate, db: Session = Depends(get_db)):
    db_professor = db.query(models.Professor).filter(models.Professor.professor_id == professor_id).first()
    if db_professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    update_data = professor.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_professor, key, value)
    db.commit()
    db.refresh(db_professor)
    return db_professor

@router.delete("/{professor_id}", response_model=schemas.ProfessorRead)
def delete_professor(professor_id: int, db: Session = Depends(get_db)):
    db_professor = db.query(models.Professor).filter(models.Professor.professor_id == professor_id).first()
    if db_professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    db.delete(db_professor)
    db.commit()
    return db_professor