
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_professor(client: AsyncClient):
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    # First, create a user to associate with the professor
    user_response = await client.post("/users/", json={
        "username": f"testuser_prof_${unique_id}_{unique_id}", 
        "email": f"test_prof_{unique_id}@example.com", 
        "password": "password", 
        "role": "professor"
    })
    assert user_response.status_code == 201
    user_id = user_response.json()["user_id"]

    response = await client.post("/professores/", json={"user_id": user_id, "full_name": "Test Professor", "departamento": "Computer Science"})
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Test Professor"
    assert data["departamento"] == "Computer Science"
    assert "professor_id" in data

@pytest.mark.asyncio
async def test_read_professores(client: AsyncClient):
    import uuid
    unique_id1 = str(uuid.uuid4())[:8]
    unique_id2 = str(uuid.uuid4())[:8]
    
    user_response1 = await client.post("/users/", json={
        "username": f"testuser_prof1_{unique_id1}", 
        "email": f"test_prof1_{unique_id1}@example.com", 
        "password": "password", 
        "role": "professor"
    })
    user_id1 = user_response1.json()["user_id"]
    await client.post("/professores/", json={"user_id": user_id1, "full_name": "Test Professor 1", "departamento": "Computer Science"})

    user_response2 = await client.post("/users/", json={
        "username": f"testuser_prof2_{unique_id2}", 
        "email": f"test_prof2_{unique_id2}@example.com", 
        "password": "password", 
        "role": "professor"
    })
    user_id2 = user_response2.json()["user_id"]
    await client.post("/professores/", json={"user_id": user_id2, "full_name": "Test Professor 2", "departamento": "Data Science"})

    response = await client.get("/professores/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2  # Changed to >= to account for any existing data
    assert data[0]["full_name"] == "Test Professor 1"
    assert data[1]["full_name"] == "Test Professor 2"

@pytest.mark.asyncio
async def test_read_professor(client: AsyncClient):
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    user_response = await client.post("/users/", json={
        "username": f"testuser_prof_{unique_id}", 
        "email": f"test_prof_{unique_id}@example.com", 
        "password": "password", 
        "role": "professor"
    })
    user_id = user_response.json()["user_id"]
    response = await client.post("/professores/", json={"user_id": user_id, "full_name": "Test Professor", "departamento": "Computer Science"})
    professor_id = response.json()["professor_id"]

    response = await client.get(f"/professores/{professor_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Test Professor"
    assert data["departamento"] == "Computer Science"

@pytest.mark.asyncio
async def test_update_professor(client: AsyncClient):
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    user_response = await client.post("/users/", json={
        "username": f"testuser_prof_{unique_id}", 
        "email": f"test_prof_{unique_id}@example.com", 
        "password": "password", 
        "role": "professor"
    })
    user_id = user_response.json()["user_id"]
    response = await client.post("/professores/", json={"user_id": user_id, "full_name": "Test Professor", "departamento": "Computer Science"})
    professor_id = response.json()["professor_id"]

    response = await client.put(f"/professores/{professor_id}", json={"full_name": "Updated Test Professor"})
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Test Professor"
    assert data["departamento"] == "Computer Science"

@pytest.mark.asyncio
async def test_delete_professor(client: AsyncClient):
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    user_response = await client.post("/users/", json={
        "username": f"testuser_prof_{unique_id}", 
        "email": f"test_prof_{unique_id}@example.com", 
        "password": "password", 
        "role": "professor"
    })
    user_id = user_response.json()["user_id"]
    response = await client.post("/professores/", json={"user_id": user_id, "full_name": "Test Professor", "departamento": "Computer Science"})
    professor_id = response.json()["professor_id"]

    response = await client.delete(f"/professores/{professor_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Professor deleted successfully"

    response = await client.get(f"/professores/{professor_id}")
    assert response.status_code == 404
