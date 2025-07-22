
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_ong(client: AsyncClient):
    response = await client.post("/ongs/", json={"ngo_name": "Test ONG", "description": "A test ONG"})
    assert response.status_code == 201
    data = response.json()
    assert data["ngo_name"] == "Test ONG"
    assert data["description"] == "A test ONG"
    assert "ngo_id" in data

@pytest.mark.asyncio
async def test_read_ongs(client: AsyncClient):
    await client.post("/ongs/", json={"ngo_name": "Test ONG 1", "description": "A test ONG 1"})
    await client.post("/ongs/", json={"ngo_name": "Test ONG 2", "description": "A test ONG 2"})
    
    response = await client.get("/ongs/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2  # Changed to >= to account for any existing data

@pytest.mark.asyncio
async def test_read_ong(client: AsyncClient):
    response = await client.post("/ongs/", json={"ngo_name": "Test ONG", "description": "A test ONG"})
    ong_id = response.json()["ngo_id"]
    response = await client.get(f"/ongs/{ong_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["ngo_name"] == "Test ONG"
    assert data["description"] == "A test ONG"

@pytest.mark.asyncio
async def test_update_ong(client: AsyncClient):
    response = await client.post("/ongs/", json={"ngo_name": "Test ONG", "description": "A test ONG"})
    ong_id = response.json()["ngo_id"]
    response = await client.put(f"/ongs/{ong_id}", json={"ngo_name": "Updated Test ONG"})
    assert response.status_code == 200
    data = response.json()
    assert data["ngo_name"] == "Updated Test ONG"
    assert data["description"] == "A test ONG"

@pytest.mark.asyncio
async def test_delete_ong(client: AsyncClient):
    response = await client.post("/ongs/", json={"ngo_name": "Test ONG", "description": "A test ONG"})
    ong_id = response.json()["ngo_id"]
    response = await client.delete(f"/ongs/{ong_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "ONG deleted successfully"
    response = await client.get(f"/ongs/{ong_id}")
    assert response.status_code == 404
