
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_estudante(client: AsyncClient):
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    # First, create a user to associate with the estudante
    user_response = await client.post("/users/", json={
        "username": f"testuser_{unique_id}", 
        "email": f"test_{unique_id}@example.com", 
        "password": "password", 
        "role": "estudante"
    })
    assert user_response.status_code == 201
    user_id = user_response.json()["user_id"]

    response = await client.post("/estudantes/", json={"user_id": user_id, "full_name": "Test Estudante", "curso": "Computer Science"})
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Test Estudante"
    assert data["curso"] == "Computer Science"
    assert "student_id" in data

@pytest.mark.asyncio
async def test_read_estudantes(client: AsyncClient):
    user_response1 = await client.post("/users/", json={"username": "testuser1", "email": "test1@example.com", "password": "password", "role": "estudante"})
    user_id1 = user_response1.json()["user_id"]
    await client.post("/estudantes/", json={"user_id": user_id1, "full_name": "Test Estudante 1", "curso": "Computer Science"})

    user_response2 = await client.post("/users/", json={"username": "testuser2", "email": "test2@example.com", "password": "password", "role": "estudante"})
    user_id2 = user_response2.json()["user_id"]
    await client.post("/estudantes/", json={"user_id": user_id2, "full_name": "Test Estudante 2", "curso": "Data Science"})

    response = await client.get("/estudantes/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["full_name"] == "Test Estudante 1"
    assert data[1]["full_name"] == "Test Estudante 2"

@pytest.mark.asyncio
async def test_read_estudante(client: AsyncClient):
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    user_response = await client.post("/users/", json={
        "username": f"testuser_{unique_id}", 
        "email": f"test_{unique_id}@example.com", 
        "password": "password", 
        "role": "estudante"
    })
    user_id = user_response.json()["user_id"]
    response = await client.post("/estudantes/", json={"user_id": user_id, "full_name": "Test Estudante", "curso": "Computer Science"})
    student_id = response.json()["student_id"]

    response = await client.get(f"/estudantes/{student_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Test Estudante"
    assert data["curso"] == "Computer Science"

@pytest.mark.asyncio
async def test_update_estudante(client: AsyncClient):
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    user_response = await client.post("/users/", json={
        "username": f"testuser_{unique_id}", 
        "email": f"test_{unique_id}@example.com", 
        "password": "password", 
        "role": "estudante"
    })
    user_id = user_response.json()["user_id"]
    response = await client.post("/estudantes/", json={"user_id": user_id, "full_name": "Test Estudante", "curso": "Computer Science"})
    student_id = response.json()["student_id"]

    response = await client.put(f"/estudantes/{student_id}", json={"full_name": "Updated Test Estudante"})
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Test Estudante"
    assert data["curso"] == "Computer Science"

@pytest.mark.asyncio
async def test_delete_estudante(client: AsyncClient):
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    user_response = await client.post("/users/", json={
        "username": f"testuser_{unique_id}", 
        "email": f"test_{unique_id}@example.com", 
        "password": "password", 
        "role": "estudante"
    })
    user_id = user_response.json()["user_id"]
    response = await client.post("/estudantes/", json={"user_id": user_id, "full_name": "Test Estudante", "curso": "Computer Science"})
    student_id = response.json()["student_id"]

    response = await client.delete(f"/estudantes/{student_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Estudante deleted successfully"

    response = await client.get(f"/estudantes/{student_id}")
    assert response.status_code == 404
