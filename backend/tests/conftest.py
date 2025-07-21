import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.database import get_db, Base
from app.auth import get_current_user
from app import models
from main import app
import os

# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

def override_get_current_user():
    return models.User(
        user_id=1,
        username="testuser",
        email="test@example.com",
        role="Admin"
    )

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def setup_database():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    if os.path.exists("./test.db"):
        os.remove("./test.db")

@pytest.fixture
async def client(setup_database):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def db_session():
    async with TestingSessionLocal() as session:
        yield session

@pytest.fixture
async def sample_user(db_session):
    user = models.User(
        username="testuser",
        email="test@example.com",
        password="hashedpassword",
        role="Admin"
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user

@pytest.fixture
async def sample_professor(db_session, sample_user):
    professor = models.Professor(
        user_id=sample_user.user_id,
        full_name="Test Professor",
        vinculo="Efetivo",
        departamento="Computer Science"
    )
    db_session.add(professor)
    await db_session.commit()
    await db_session.refresh(professor)
    return professor

@pytest.fixture
async def sample_estudante(db_session):
    user = models.User(
        username="teststudent",
        email="student@example.com",
        password="hashedpassword",
        role="Estudante"
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    estudante = models.Estudante(
        user_id=user.user_id,
        full_name="Test Student",
        vinculo="Matriculado",
        curso="Computer Science"
    )
    db_session.add(estudante)
    await db_session.commit()
    await db_session.refresh(estudante)
    return estudante

@pytest.fixture
async def sample_ong(db_session):
    ong = models.ONG(
        ngo_name="Test NGO",
        description="A test NGO",
        email="ngo@example.com",
        phone="123-456-7890"
    )
    db_session.add(ong)
    await db_session.commit()
    await db_session.refresh(ong)
    return ong

@pytest.fixture
async def sample_disciplina(db_session, sample_professor):
    disciplina = models.Disciplina(
        professor_id=sample_professor.professor_id,
        nome_disciplina="Test Subject",
        description="A test subject"
    )
    db_session.add(disciplina)
    await db_session.commit()
    await db_session.refresh(disciplina)
    return disciplina

@pytest.fixture
async def sample_projeto(db_session, sample_disciplina, sample_ong):
    projeto = models.Projeto(
        disciplina_id=sample_disciplina.disciplina_id,
        ngo_id=sample_ong.ngo_id,
        name="Test Project",
        description="A test project",
        status="Em Andamento"
    )
    db_session.add(projeto)
    await db_session.commit()
    await db_session.refresh(projeto)
    return projeto

@pytest.fixture
async def sample_task(db_session, sample_projeto):
    task = models.Task(
        projeto_id=sample_projeto.projeto_id,
        name="Test Task",
        description="A test task",
        type="Consultoria",
        status="Pendente"
    )
    db_session.add(task)
    await db_session.commit()
    await db_session.refresh(task)
    return task
