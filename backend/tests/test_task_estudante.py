import pytest
from httpx import AsyncClient

class TestTaskEstudanteEndpoints:
    
    @pytest.mark.asyncio
    async def test_create_task_estudante(self, client: AsyncClient, sample_estudante, sample_task):
        task_estudante_data = {
            "student_id": sample_estudante.student_id,
            "task_id": sample_task.task_id,
            "status": "Ativo"
        }
        response = await client.post("/task-estudantes/", json=task_estudante_data)
        assert response.status_code == 200
        data = response.json()
        assert data["student_id"] == sample_estudante.student_id
        assert data["task_id"] == sample_task.task_id
        assert data["status"] == "Ativo"

    @pytest.mark.asyncio
    async def test_create_task_estudante_invalid_student(self, client: AsyncClient, sample_task):
        task_estudante_data = {
            "student_id": 999,
            "task_id": sample_task.task_id,
            "status": "Ativo"
        }
        response = await client.post("/task-estudantes/", json=task_estudante_data)
        assert response.status_code == 404
        assert "Student not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_create_task_estudante_invalid_task(self, client: AsyncClient, sample_estudante):
        task_estudante_data = {
            "student_id": sample_estudante.student_id,
            "task_id": 999,
            "status": "Ativo"
        }
        response = await client.post("/task-estudantes/", json=task_estudante_data)
        assert response.status_code == 404
        assert "Task not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_create_duplicate_task_estudante(self, client: AsyncClient, sample_estudante, sample_task):
        task_estudante_data = {
            "student_id": sample_estudante.student_id,
            "task_id": sample_task.task_id,
            "status": "Ativo"
        }
        # First assignment
        response1 = await client.post("/task-estudantes/", json=task_estudante_data)
        assert response1.status_code == 200
        
        # Duplicate assignment
        response2 = await client.post("/task-estudantes/", json=task_estudante_data)
        assert response2.status_code == 400
        assert "already assigned" in response2.json()["detail"]

    @pytest.mark.asyncio
    async def test_read_task_estudantes(self, client: AsyncClient, db_session, sample_estudante, sample_task):
        # Create a task_estudante first
        from app.models import TaskEstudante
        task_estudante = TaskEstudante(
            student_id=sample_estudante.student_id,
            task_id=sample_task.task_id,
            status="Ativo"
        )
        db_session.add(task_estudante)
        await db_session.commit()
        
        response = await client.get("/task-estudantes/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    @pytest.mark.asyncio
    async def test_read_task_estudantes_with_pagination(self, client: AsyncClient, db_session, sample_estudante, sample_task):
        # Create a task_estudante first
        from app.models import TaskEstudante
        task_estudante = TaskEstudante(
            student_id=sample_estudante.student_id,
            task_id=sample_task.task_id,
            status="Ativo"
        )
        db_session.add(task_estudante)
        await db_session.commit()
        
        response = await client.get("/task-estudantes/?skip=0&limit=5")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 5

    @pytest.mark.asyncio
    async def test_read_task_estudante_by_id(self, client: AsyncClient, db_session, sample_estudante, sample_task):
        # Create a task_estudante first
        from app.models import TaskEstudante
        task_estudante = TaskEstudante(
            student_id=sample_estudante.student_id,
            task_id=sample_task.task_id,
            status="Ativo"
        )
        db_session.add(task_estudante)
        await db_session.commit()
        await db_session.refresh(task_estudante)
        
        response = await client.get(f"/task-estudantes/{task_estudante.estud_task_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["estud_task_id"] == task_estudante.estud_task_id
        assert data["student_id"] == sample_estudante.student_id

    @pytest.mark.asyncio
    async def test_read_task_estudante_not_found(self, client: AsyncClient):
        response = await client.get("/task-estudantes/999")
        assert response.status_code == 404
        assert "Task assignment not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_update_task_estudante(self, client: AsyncClient, db_session, sample_estudante, sample_task):
        # Create a task_estudante first
        from app.models import TaskEstudante
        task_estudante = TaskEstudante(
            student_id=sample_estudante.student_id,
            task_id=sample_task.task_id,
            status="Ativo"
        )
        db_session.add(task_estudante)
        await db_session.commit()
        await db_session.refresh(task_estudante)
        
        update_data = {
            "status": "Concluído"
        }
        response = await client.put(f"/task-estudantes/{task_estudante.estud_task_id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "Concluído"

    @pytest.mark.asyncio
    async def test_update_task_estudante_not_found(self, client: AsyncClient):
        update_data = {
            "status": "Concluído"
        }
        response = await client.put("/task-estudantes/999", json=update_data)
        assert response.status_code == 404
        assert "Task assignment not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_delete_task_estudante(self, client: AsyncClient, db_session, sample_estudante, sample_task):
        # Create a task_estudante first
        from app.models import TaskEstudante
        task_estudante = TaskEstudante(
            student_id=sample_estudante.student_id,
            task_id=sample_task.task_id,
            status="Ativo"
        )
        db_session.add(task_estudante)
        await db_session.commit()
        await db_session.refresh(task_estudante)
        
        response = await client.delete(f"/task-estudantes/{task_estudante.estud_task_id}")
        assert response.status_code == 200
        assert "deleted successfully" in response.json()["message"]

    @pytest.mark.asyncio
    async def test_delete_task_estudante_not_found(self, client: AsyncClient):
        response = await client.delete("/task-estudantes/999")
        assert response.status_code == 404
        assert "Task assignment not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_read_task_estudantes_by_student(self, client: AsyncClient, db_session, sample_estudante, sample_task):
        # Create a task_estudante first
        from app.models import TaskEstudante
        task_estudante = TaskEstudante(
            student_id=sample_estudante.student_id,
            task_id=sample_task.task_id,
            status="Ativo"
        )
        db_session.add(task_estudante)
        await db_session.commit()
        
        response = await client.get(f"/task-estudantes/student/{sample_estudante.student_id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert all(te["student_id"] == sample_estudante.student_id for te in data)

    @pytest.mark.asyncio
    async def test_read_task_estudantes_by_task(self, client: AsyncClient, db_session, sample_estudante, sample_task):
        # Create a task_estudante first
        from app.models import TaskEstudante
        task_estudante = TaskEstudante(
            student_id=sample_estudante.student_id,
            task_id=sample_task.task_id,
            status="Ativo"
        )
        db_session.add(task_estudante)
        await db_session.commit()
        
        response = await client.get(f"/task-estudantes/task/{sample_task.task_id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert all(te["task_id"] == sample_task.task_id for te in data)

    @pytest.mark.asyncio
    async def test_read_task_estudantes_by_status(self, client: AsyncClient, db_session, sample_estudante, sample_task):
        # Create a task_estudante first
        from app.models import TaskEstudante
        task_estudante = TaskEstudante(
            student_id=sample_estudante.student_id,
            task_id=sample_task.task_id,
            status="Ativo"
        )
        db_session.add(task_estudante)
        await db_session.commit()
        
        response = await client.get("/task-estudantes/status/Ativo")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert all(te["status"] == "Ativo" for te in data)

    @pytest.mark.asyncio
    async def test_read_task_estudantes_by_status_no_results(self, client: AsyncClient):
        response = await client.get("/task-estudantes/status/NonExistentStatus")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0
