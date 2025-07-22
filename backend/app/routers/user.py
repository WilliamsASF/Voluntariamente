from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from typing import List

from ..database import get_db
from ..models import User
from ..schemas import UserRead, UserCreate, UserUpdate, UserInDB
from ..routers.auth import get_current_user, get_password_hash  # importa funções corretas

router = APIRouter(prefix="/users", tags=["users"])

# Helper para verificar unicidade
async def _check_unique_user(
    db: AsyncSession, 
    username: str = None, 
    email: str = None, 
    exclude_id: int = None
):
    query = select(User)
    conditions = []
    if username:
        conditions.append(User.username == username)
    if email:
        conditions.append(User.email == email)
    
    if conditions:
        query = query.where(*conditions)
    if exclude_id:
        query = query.where(User.user_id != exclude_id)
    
    result = await db.execute(query)
    return result.scalars().first()


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: UserCreate, 
    db: AsyncSession = Depends(get_db)
):
    if await _check_unique_user(db, user.username, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    hashed_password = get_password_hash(user.password)

    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


@router.get("/me", response_model=UserRead)
async def read_current_user(
    current_user: UserInDB = Depends(get_current_user)
):
    return current_user


@router.get("/", response_model=List[UserRead])
async def read_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can list users"
        )
    
    result = await db.execute(select(User).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/{user_id}", response_model=UserRead)
async def read_user(
    user_id: int,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.user_id != user_id and current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this user"
        )
    
    user = (await db.execute(select(User).where(User.user_id == user_id))).scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.user_id != user_id and current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user"
        )
    
    update_data = user_update.model_dump(exclude_unset=True)

    if 'username' in update_data or 'email' in update_data:
        existing = await _check_unique_user(
            db,
            username=update_data.get('username'),
            email=update_data.get('email'),
            exclude_id=user_id
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already in use"
            )
    
    if 'password' in update_data:
        update_data['password'] = get_password_hash(update_data['password'])

    if 'role' in update_data and current_user.role != "Admin":
        del update_data['role']
    
    await db.execute(
        update(User)
        .where(User.user_id == user_id)
        .values(**update_data)
    )
    await db.commit()

    # Recarrega direto do banco (evita dependência do endpoint que pode dar erro de permissão)
    updated_user = (await db.execute(select(User).where(User.user_id == user_id))).scalars().first()
    return updated_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete users"
        )
    
    user = (await db.execute(select(User).where(User.user_id == user_id))).scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await db.delete(user)
    await db.commit()