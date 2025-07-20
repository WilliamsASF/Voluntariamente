
import pytest
from fastapi.testclient import TestClient

@pytest.mark.asyncio
async def test_create_ong(client: TestClient):
    response = client.post("/ongs/", json={"ngo_name": "Test ONG", "description": "A test ONG"})
    assert response.status_code == 200
    data = response.json()
    assert data["ngo_name"] == "Test ONG"
    assert data["description"] == "A test ONG"
    assert "ngo_id" in data

@pytest.mark.asyncio
async def test_read_ongs(client: TestClient):
    client.post("/ongs/", json={"ngo_name": "Test ONG 1", "description": "A test ONG 1"})
    client.post("/ongs/", json={"ngo_name": "Test ONG 2", "description": "A test ONG 2"})
    response = client.get("/ongs/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["ngo_name"] == "Test ONG 1"
    assert data[1]["ngo_name"] == "Test ONG 2"

@pytest.mark.asyncio
async def test_read_ong(client: TestClient):
    response = client.post("/ongs/", json={"ngo_name": "Test ONG", "description": "A test ONG"})
    ong_id = response.json()["ngo_id"]
    response = client.get(f"/ongs/{ong_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["ngo_name"] == "Test ONG"
    assert data["description"] == "A test ONG"

@pytest.mark.asyncio
async def test_update_ong(client: TestClient):
    response = client.post("/ongs/", json={"ngo_name": "Test ONG", "description": "A test ONG"})
    ong_id = response.json()["ngo_id"]
    response = client.put(f"/ongs/{ong_id}", json={"ngo_name": "Updated Test ONG"})
    assert response.status_code == 200
    data = response.json()
    assert data["ngo_name"] == "Updated Test ONG"
    assert data["description"] == "A test ONG"

@pytest.mark.asyncio
async def test_delete_ong(client: TestClient):
    response = client.post("/ongs/", json={"ngo_name": "Test ONG", "description": "A test ONG"})
    ong_id = response.json()["ngo_id"]
    response = client.delete(f"/ongs/{ong_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["ngo_name"] == "Test ONG"
    response = client.get(f"/ongs/{ong_id}")
    assert response.status_code == 404
