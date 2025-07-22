import pytest
from httpx import AsyncClient


    
    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_create_disciplina(client: AsyncClient, sample_professor):
    disciplina_data = {
        "professor_id": sample_professor.professor_id,
        "nome_disciplina": "New Test Subject",
        "description": "A new test subject"
    }
    response = await client.post("/disciplinas/", json=disciplina_data)
    assert response.status_code == 200
    data = response.json()
    assert data["nome_disciplina"] == "New Test Subject"
    assert data["professor_id"] == sample_professor.professor_id

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_create_disciplina_without_professor(client: AsyncClient):
    disciplina_data = {
        "nome_disciplina": "Subject Without Professor",
        "description": "A subject without professor"
    }
    response = await client.post("/disciplinas/", json=disciplina_data)
    assert response.status_code == 200
    data = response.json()
    assert data["nome_disciplina"] == "Subject Without Professor"
    assert data["professor_id"] is None

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_create_disciplina_invalid_professor(client: AsyncClient):
    disciplina_data = {
        "professor_id": 999,
        "nome_disciplina": "Invalid Professor Subject",
        "description": "A subject with invalid professor"
    }
    response = await client.post("/disciplinas/", json=disciplina_data)
    assert response.status_code == 404
    assert "Professor not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_disciplinas(client: AsyncClient, sample_disciplina):
    response = await client.get("/disciplinas/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_disciplinas_with_pagination(client: AsyncClient, sample_disciplina):
    response = await client.get("/disciplinas/?skip=0&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) <= 5

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_disciplina_by_id(client: AsyncClient, sample_disciplina):
    response = await client.get(f"/disciplinas/{sample_disciplina.disciplina_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["disciplina_id"] == sample_disciplina.disciplina_id
    assert data["nome_disciplina"] == sample_disciplina.nome_disciplina

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_disciplina_not_found(client: AsyncClient):
    response = await client.get("/disciplinas/999")
    assert response.status_code == 404
    assert "Disciplina not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_update_disciplina(client: AsyncClient, sample_disciplina):
    update_data = {
        "nome_disciplina": "Updated Subject Name",
        "description": "Updated description"
    }
    response = await client.put(f"/disciplinas/{sample_disciplina.disciplina_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["nome_disciplina"] == "Updated Subject Name"
    assert data["description"] == "Updated description"

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_update_disciplina_not_found(client: AsyncClient):
    update_data = {
        "nome_disciplina": "Updated Subject Name"
    }
    response = await client.put("/disciplinas/999", json=update_data)
    assert response.status_code == 404
    assert "Disciplina not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_delete_disciplina(client: AsyncClient, sample_disciplina):
    response = await client.delete(f"/disciplinas/{sample_disciplina.disciplina_id}")
    assert response.status_code == 200
    assert "deleted successfully" in response.json()["message"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_delete_disciplina_not_found(client: AsyncClient):
    response = await client.delete("/disciplinas/999")
    assert response.status_code == 404
    assert "Disciplina not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_disciplinas_by_professor(client: AsyncClient, sample_disciplina, sample_professor):
    response = await client.get(f"/disciplinas/professor/{sample_professor.professor_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert all(d["professor_id"] == sample_professor.professor_id for d in data)

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_search_disciplinas_by_name(client: AsyncClient, sample_disciplina):
    response = await client.get("/disciplinas/search/Test")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert all("Test" in d["nome_disciplina"] for d in data)

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_search_disciplinas_no_results(client: AsyncClient):
    response = await client.get("/disciplinas/search/NonExistent")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0
