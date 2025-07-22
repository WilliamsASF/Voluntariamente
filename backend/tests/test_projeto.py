import pytest
from httpx import AsyncClient

class TestProjetoEndpoints:
    
    @pytest.mark.asyncio
    async def test_create_projeto(self, client: AsyncClient, sample_disciplina, sample_ong):
        projeto_data = {
            "disciplina_id": sample_disciplina.disciplina_id,
            "ngo_id": sample_ong.ngo_id,
            "name": "New Test Project",
            "description": "A new test project",
            "status": "Em Andamento"
        }
        response = await client.post("/projetos/", json=projeto_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "New Test Project"
        assert data["disciplina_id"] == sample_disciplina.disciplina_id
        assert data["ngo_id"] == sample_ong.ngo_id

    @pytest.mark.asyncio
    async def test_create_projeto_minimal(self, client: AsyncClient):
        projeto_data = {
            "name": "Minimal Project"
        }
        response = await client.post("/projetos/", json=projeto_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Minimal Project"

    @pytest.mark.asyncio
    async def test_read_projetos(self, client: AsyncClient, sample_projeto):
        response = await client.get("/projetos/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    @pytest.mark.asyncio
    async def test_read_projetos_with_pagination(self, client: AsyncClient, sample_projeto):
        response = await client.get("/projetos/?skip=0&limit=5")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 5

    @pytest.mark.asyncio
    async def test_read_projeto_by_id(self, client: AsyncClient, sample_projeto):
        response = await client.get(f"/projetos/{sample_projeto.projeto_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["projeto_id"] == sample_projeto.projeto_id
        assert data["name"] == sample_projeto.name

    @pytest.mark.asyncio
    async def test_read_projeto_not_found(self, client: AsyncClient):
        response = await client.get("/projetos/999")
        assert response.status_code == 404
        assert "Projeto not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_update_projeto(self, client: AsyncClient, sample_projeto):
        update_data = {
            "name": "Updated Project Name",
            "description": "Updated description",
            "status": "Concluído"
        }
        response = await client.put(f"/projetos/{sample_projeto.projeto_id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Project Name"
        assert data["description"] == "Updated description"
        assert data["status"] == "Concluído"

    @pytest.mark.asyncio
    async def test_update_projeto_not_found(self, client: AsyncClient):
        update_data = {
            "name": "Updated Project Name"
        }
        response = await client.put("/projetos/999", json=update_data)
        assert response.status_code == 404
        assert "Projeto not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_delete_projeto(self, client: AsyncClient, sample_projeto):
        response = await client.delete(f"/projetos/{sample_projeto.projeto_id}")
        assert response.status_code == 200
        assert "deleted successfully" in response.json()["message"]

    @pytest.mark.asyncio
    async def test_delete_projeto_not_found(self, client: AsyncClient):
        response = await client.delete("/projetos/999")
        assert response.status_code == 404
        assert "Projeto not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_read_projetos_by_disciplina(self, client: AsyncClient, sample_projeto, sample_disciplina):
        response = await client.get(f"/projetos/disciplina/{sample_disciplina.disciplina_id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert all(p["disciplina_id"] == sample_disciplina.disciplina_id for p in data if p["disciplina_id"])

    @pytest.mark.asyncio
    async def test_read_projetos_by_ong(self, client: AsyncClient, sample_projeto, sample_ong):
        response = await client.get(f"/projetos/ong/{sample_ong.ngo_id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert all(p["ngo_id"] == sample_ong.ngo_id for p in data if p["ngo_id"])
