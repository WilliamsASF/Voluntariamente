from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app import models, schemas
from app.database import get_db
from . import auth

router = APIRouter(
    prefix="/professores",
    tags=["professores"],
)

@router.post("/", response_model=schemas.ProfessorRead, status_code=status.HTTP_201_CREATED)
async def create_professor(
    professor: schemas.ProfessorCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_professor = models.Professor(**professor.model_dump())
    db.add(db_professor)
    await db.commit()
    await db.refresh(db_professor)
    return db_professor

@router.get("/", response_model=list[schemas.ProfessorRead])
async def read_professores(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Professor).offset(skip).limit(limit))
    professores = result.scalars().all()
    return professores

@router.get("/{professor_id}", response_model=schemas.ProfessorRead)
async def read_professor(professor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Professor).filter(models.Professor.professor_id == professor_id))
    db_professor = result.scalars().first()
    if db_professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    return db_professor

@router.put("/{professor_id}", response_model=schemas.ProfessorRead)
async def update_professor(
    professor_id: int, 
    professor: schemas.ProfessorUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Professor).filter(models.Professor.professor_id == professor_id))
    db_professor = result.scalars().first()
    if db_professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    update_data = professor.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_professor, key, value)
    await db.commit()
    await db.refresh(db_professor)
    return db_professor

@router.delete("/{professor_id}")
async def delete_professor(
    professor_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(select(models.Professor).filter(models.Professor.professor_id == professor_id))
    db_professor = result.scalars().first()
    if db_professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    
    await db.delete(db_professor)
    await db.commit()
    return {"message": "Professor deleted successfully"}
    
    professor_data = schemas.ProfessorRead.model_validate(db_professor)
    
    await db.delete(db_professor)
    await db.commit()
    return professor_data