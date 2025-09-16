# Ponto de entrada da aplicação

# Importa FastAPI e middleware CORS (Conexão com frontend)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importa os routers
from app.routers import biblioteca

app = FastAPI(
    title="Biblioteca API",
    description="Uma API CRUD simples usando FastAPI + SQLite",
    version="1.0.0"
)

# Configuração do CORS (permite que frontend acesse sua API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # permite todos (especificar o domínio do frontend)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota inicial (teste)
@app.get("/")
def read_root():
    return {"message": "Bem-vindo à Biblioteca API!"}

# Inclui as rotas do módulo biblioteca
# app.include_router(biblioteca.router, prefix="/biblioteca", tags=["Biblioteca"])
