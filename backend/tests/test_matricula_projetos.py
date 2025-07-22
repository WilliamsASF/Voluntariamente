import pytest
from httpx import AsyncClient


    
    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_create_matricula(client: AsyncClient, sample_estudante, sample_projeto):
    matricula_data = {
        "student_id": sample_estudante.student_id,
        "projeto_id": sample_projeto.projeto_id,
        "status": "Ativo"
    }
    response = await client.post("/matriculas/", json=matricula_data)
    assert response.status_code == 200
    data = response.json()
    assert data["student_id"] == sample_estudante.student_id
    assert data["projeto_id"] == sample_projeto.projeto_id
    assert data["status"] == "Ativo"

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_create_matricula_invalid_student(client: AsyncClient, sample_projeto):
    matricula_data = {
        "student_id": 999,
        "projeto_id": sample_projeto.projeto_id,
        "status": "Ativo"
    }
    response = await client.post("/matriculas/", json=matricula_data)
    assert response.status_code == 404
    assert "Student not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_create_matricula_invalid_project(client: AsyncClient, sample_estudante):
    matricula_data = {
        "student_id": sample_estudante.student_id,
        "projeto_id": 999,
        "status": "Ativo"
    }
    response = await client.post("/matriculas/", json=matricula_data)
    assert response.status_code == 404
    assert "Project not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_create_duplicate_matricula(client: AsyncClient, sample_estudante, sample_projeto):
    matricula_data = {
        "student_id": sample_estudante.student_id,
        "projeto_id": sample_projeto.projeto_id,
        "status": "Ativo"
    }
    # First enrollment
    response1 = await client.post("/matriculas/", json=matricula_data)
    assert response1.status_code == 200
    
    # Duplicate enrollment
    response2 = await client.post("/matriculas/", json=matricula_data)
    assert response2.status_code == 400
    assert "already enrolled" in response2.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_matriculas(client: AsyncClient, db_session, sample_estudante, sample_projeto):
    # Create a matricula first
    from app.models import MatriculaProjetos
    matricula = MatriculaProjetos(
        student_id=sample_estudante.student_id,
        projeto_id=sample_projeto.projeto_id,
        status="Ativo"
    )
    db_session.add(matricula)
    await db_session.commit()
    
    response = await client.get("/matriculas/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_matriculas_with_pagination(client: AsyncClient, db_session, sample_estudante, sample_projeto):
    # Create a matricula first
    from app.models import MatriculaProjetos
    matricula = MatriculaProjetos(
        student_id=sample_estudante.student_id,
        projeto_id=sample_projeto.projeto_id,
        status="Ativo"
    )
    db_session.add(matricula)
    await db_session.commit()
    
    response = await client.get("/matriculas/?skip=0&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) <= 5

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_matricula_by_id(client: AsyncClient, db_session, sample_estudante, sample_projeto):
    # Create a matricula first
    from app.models import MatriculaProjetos
    matricula = MatriculaProjetos(
        student_id=sample_estudante.student_id,
        projeto_id=sample_projeto.projeto_id,
        status="Ativo"
    )
    db_session.add(matricula)
    await db_session.commit()
    await db_session.refresh(matricula)
    
    response = await client.get(f"/matriculas/{matricula.matricula_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["matricula_id"] == matricula.matricula_id
    assert data["student_id"] == sample_estudante.student_id

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_matricula_not_found(client: AsyncClient):
    response = await client.get("/matriculas/999")
    assert response.status_code == 404
    assert "Matricula not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_update_matricula(client: AsyncClient, db_session, sample_estudante, sample_projeto):
    # Create a matricula first
    from app.models import MatriculaProjetos
    matricula = MatriculaProjetos(
        student_id=sample_estudante.student_id,
        projeto_id=sample_projeto.projeto_id,
        status="Ativo"
    )
    db_session.add(matricula)
    await db_session.commit()
    await db_session.refresh(matricula)
    
    update_data = {
        "status": "Concluído"
    }
    response = await client.put(f"/matriculas/{matricula.matricula_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Concluído"

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_update_matricula_not_found(client: AsyncClient):
    update_data = {
        "status": "Concluído"
    }
    response = await client.put("/matriculas/999", json=update_data)
    assert response.status_code == 404
    assert "Matricula not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_delete_matricula(client: AsyncClient, db_session, sample_estudante, sample_projeto):
    # Create a matricula first
    from app.models import MatriculaProjetos
    matricula = MatriculaProjetos(
        student_id=sample_estudante.student_id,
        projeto_id=sample_projeto.projeto_id,
        status="Ativo"
    )
    db_session.add(matricula)
    await db_session.commit()
    await db_session.refresh(matricula)
    
    response = await client.delete(f"/matriculas/{matricula.matricula_id}")
    assert response.status_code == 200
    assert "deleted successfully" in response.json()["message"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_delete_matricula_not_found(client: AsyncClient):
    response = await client.delete("/matriculas/999")
    assert response.status_code == 404
    assert "Matricula not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_matriculas_by_student(client: AsyncClient, db_session, sample_estudante, sample_projeto):
    # Create a matricula first
    from app.models import MatriculaProjetos
    matricula = MatriculaProjetos(
        student_id=sample_estudante.student_id,
        projeto_id=sample_projeto.projeto_id,
        status="Ativo"
    )
    db_session.add(matricula)
    await db_session.commit()
    
    response = await client.get(f"/matriculas/student/{sample_estudante.student_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert all(m["student_id"] == sample_estudante.student_id for m in data)

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_matriculas_by_project(client: AsyncClient, db_session, sample_estudante, sample_projeto):
    # Create a matricula first
    from app.models import MatriculaProjetos
    matricula = MatriculaProjetos(
        student_id=sample_estudante.student_id,
        projeto_id=sample_projeto.projeto_id,
        status="Ativo"
    )
    db_session.add(matricula)
    await db_session.commit()
    
    response = await client.get(f"/matriculas/project/{sample_projeto.projeto_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert all(m["projeto_id"] == sample_projeto.projeto_id for m in data)
