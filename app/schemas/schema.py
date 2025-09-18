# Utilização de FastAPI para criar uma API RESTful
from pydantic import BaseModel

# Esquema Pydantic para itens (livros)
class ItemBase(BaseModel):
    title: str
    description: str | None = None
    price: float
    autor: str
    