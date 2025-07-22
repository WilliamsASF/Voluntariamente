import pytest
from httpx import AsyncClient


    
    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_create_task(client: AsyncClient, sample_projeto):
    task_data = {
        "projeto_id": sample_projeto.projeto_id,
        "name": "New Test Task",
        "description": "A new test task",
        "type": "Consultoria",
        "status": "Pendente"
    }
    response = await client.post("/tasks/", json=task_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Test Task"
    assert data["projeto_id"] == sample_projeto.projeto_id
    assert data["type"] == "Consultoria"
    assert data["status"] == "Pendente"

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_create_task_invalid_project(client: AsyncClient):
    task_data = {
        "projeto_id": 999,
        "name": "Invalid Project Task",
        "description": "A task with invalid project",
        "type": "Consultoria",
        "status": "Pendente"
    }
    response = await client.post("/tasks/", json=task_data)
    assert response.status_code == 404
    assert "Project not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_tasks(client: AsyncClient, sample_task):
    response = await client.get("/tasks/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_tasks_with_pagination(client: AsyncClient, sample_task):
    response = await client.get("/tasks/?skip=0&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) <= 5

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_task_by_id(client: AsyncClient, sample_task):
    response = await client.get(f"/tasks/{sample_task.task_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["task_id"] == sample_task.task_id
    assert data["name"] == sample_task.name

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_task_not_found(client: AsyncClient):
    response = await client.get("/tasks/999")
    assert response.status_code == 404
    assert "Task not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_update_task(client: AsyncClient, sample_task):
    update_data = {
        "name": "Updated Task Name",
        "description": "Updated description",
        "status": "Em Progresso"
    }
    response = await client.put(f"/tasks/{sample_task.task_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Task Name"
    assert data["description"] == "Updated description"
    assert data["status"] == "Em Progresso"

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_update_task_not_found(client: AsyncClient):
    update_data = {
        "name": "Updated Task Name"
    }
    response = await client.put("/tasks/999", json=update_data)
    assert response.status_code == 404
    assert "Task not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_delete_task(client: AsyncClient, sample_task):
    response = await client.delete(f"/tasks/{sample_task.task_id}")
    assert response.status_code == 200
    assert "deleted successfully" in response.json()["message"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_delete_task_not_found(client: AsyncClient):
    response = await client.delete("/tasks/999")
    assert response.status_code == 404
    assert "Task not found" in response.json()["detail"]

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_tasks_by_projeto(client: AsyncClient, sample_task, sample_projeto):
    response = await client.get(f"/tasks/projeto/{sample_projeto.projeto_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert all(t["projeto_id"] == sample_projeto.projeto_id for t in data)

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_tasks_by_status(client: AsyncClient, sample_task):
    response = await client.get(f"/tasks/status/{sample_task.status}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert all(t["status"] == sample_task.status for t in data)

    
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_read_tasks_by_status_no_results(client: AsyncClient):
    response = await client.get("/tasks/status/NonExistentStatus")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0
