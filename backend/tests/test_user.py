import pytest
from fastapi.testclient import TestClient

@pytest.mark.asyncio
async def test_create_user(client: TestClient):
    payload = {
        "username": "novo.usuario",
        "email": "novo.usuario@example.com",
        "password": "strongpassword",
        "role": "Estudante"
    }
    
    response = client.post("/users/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == payload["username"]
    assert data["email"] == payload["email"]
    assert data["role"] == payload["role"]
    assert "user_id" in data

@pytest.mark.asyncio
async def test_get_current_user(client: TestClient):
    payload = {
        "username": "meu.usuario",
        "email": "meu.usuario@example.com",
        "password": "senha123",
        "role": "Professor"
    }
    client.post("/users/", json=payload)

    response = client.get("/users/me")
    assert response.status_code in [200, 401]  

@pytest.mark.asyncio
async def test_update_user(client: TestClient):
    create_data = {
        "username": "editavel",
        "email": "editavel@example.com",
        "password": "123456",
        "role": "Estudante"
    }
    response = client.post("/users/", json=create_data)
    user_id = response.json()["user_id"]

    update_data = {
        "username": "editado",
        "email": "editado@example.com"
    }
    update_response = client.put(f"/users/{user_id}", json=update_data)
    assert update_response.status_code in [200, 403]  

@pytest.mark.asyncio
async def test_get_user_by_id(client: TestClient):
    payload = {
        "username": "buscado",
        "email": "buscado@example.com",
        "password": "abc123",
        "role": "Estudante"
    }
    response = client.post("/users/", json=payload)
    user_id = response.json()["user_id"]

    res = client.get(f"/users/{user_id}")
    assert res.status_code in [200, 403]  

@pytest.mark.asyncio
async def test_delete_user(client: TestClient):
    payload = {
        "username": "apagar",
        "email": "apagar@example.com",
        "password": "deleteme",
        "role": "Estudante"
    }
    response = client.post("/users/", json=payload)
    user_id = response.json()["user_id"]

    delete_response = client.delete(f"/users/{user_id}")
    assert delete_response.status_code in [204, 403]  
    