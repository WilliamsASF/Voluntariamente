from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth as auth_router
from app.routers import user as user_router
from app.routers import professor as professor_router
from app.routers import estudante as estudante_router
from app.routers import ong as ong_router
from app.routers import disciplina as disciplina_router
from app.routers import projeto as projeto_router
from app.routers import task as task_router
from app.routers import matricula_projetos as matricula_projetos_router
from app.routers import task_estudante as task_estudante_router

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
]


# CORS settings (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(professor_router.router)
app.include_router(estudante_router.router)
app.include_router(ong_router.router)
app.include_router(disciplina_router.router)
app.include_router(projeto_router.router)
app.include_router(task_router.router)
app.include_router(matricula_projetos_router.router)
app.include_router(task_estudante_router.router)

@app.get("/")
def root():
    return {"message": "Voluntariamente API is running"}