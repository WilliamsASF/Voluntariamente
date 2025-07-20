
import pytest
from fastapi.testclient import TestClient

@pytest.mark.asyncio
async def test_create_professor(client: TestClient):
    # First, create a user to associate with the professor
    user_response = client.post("/users/", json={"username": "testuser_prof", "email": "test_prof@example.com", "password": "password", "role": "professor"})
    assert user_response.status_code == 201
    user_id = user_response.json()["user_id"]

    response = client.post("/professores/", json={"user_id": user_id, "full_name": "Test Professor", "departamento": "Computer Science"})
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Test Professor"
    assert data["departamento"] == "Computer Science"
    assert "professor_id" in data

@pytest.mark.asyncio
async def test_read_professores(client: TestClient):
    user_response1 = client.post("/users/", json={"username": "testuser_prof1", "email": "test_prof1@example.com", "password": "password", "role": "professor"})
    user_id1 = user_response1.json()["user_id"]
    client.post("/professores/", json={"user_id": user_id1, "full_name": "Test Professor 1", "departamento": "Computer Science"})

    user_response2 = client.post("/users/", json={"username": "testuser_prof2", "email": "test_prof2@example.com", "password": "password", "role": "professor"})
    user_id2 = user_response2.json()["user_id"]
    client.post("/professores/", json={"user_id": user_id2, "full_name": "Test Professor 2", "departamento": "Data Science"})

    response = client.get("/professores/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["full_name"] == "Test Professor 1"
    assert data[1]["full_name"] == "Test Professor 2"

@pytest.mark.asyncio
async def test_read_professor(client: TestClient):
    user_response = client.post("/users/", json={"username": "testuser_prof", "email": "test_prof@example.com", "password": "password", "role": "professor"})
    user_id = user_response.json()["user_id"]
    response = client.post("/professores/", json={"user_id": user_id, "full_name": "Test Professor", "departamento": "Computer Science"})
    professor_id = response.json()["professor_id"]

    response = client.get(f"/professores/{professor_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Test Professor"
    assert data["departamento"] == "Computer Science"

@pytest.mark.asyncio
async def test_update_professor(client: TestClient):
    user_response = client.post("/users/", json={"username": "testuser_prof", "email": "test_prof@example.com", "password": "password", "role": "professor"})
    user_id = user_response.json()["user_id"]
    response = client.post("/professores/", json={"user_id": user_id, "full_name": "Test Professor", "departamento": "Computer Science"})
    professor_id = response.json()["professor_id"]

    response = client.put(f"/professores/{professor_id}", json={"full_name": "Updated Test Professor"})
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Test Professor"
    assert data["departamento"] == "Computer Science"

@pytest.mark.asyncio
async def test_delete_professor(client: TestClient):
    user_response = client.post("/users/", json={"username": "testuser_prof", "email": "test_prof@example.com", "password": "password", "role": "professor"})
    user_id = user_response.json()["user_id"]
    response = client.post("/professores/", json={"user_id": user_id, "full_name": "Test Professor", "departamento": "Computer Science"})
    professor_id = response.json()["professor_id"]

    response = client.delete(f"/professores/{professor_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Test Professor"

    response = client.get(f"/professores/{professor_id}")
    assert response.status_code == 404
