from typing import List
from fastapi import APIRouter, HTTPException, Depends, Query, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import RacasModel, MagiasModel, HabilidadesModel, ClasseModel, EquipamentosModel, AtributosModel
from app.schemas import RacaSchema, MagiaSchema, HabilidadeSchema, ClasseSchema, EquipamentoSchema, AtributoSchema


def criar_router_crud(model, schema, prefix: str, tag: str):
    """Factory function para criar routers CRUD genéricos"""
    router = APIRouter(prefix=f"/{prefix}", tags=[tag])

    @router.get("/", response_model=List[schema])
    def listar(db: Session = Depends(get_db)):
        return db.query(model).all()

    @router.get("/search", response_model=List[schema])
    def buscar(
        nome: str = Query(..., description=f"Buscar {tag.lower()} por nome"),
        db: Session = Depends(get_db)
    ):
        return db.query(model).filter(model.Nome.ilike(f"%{nome}%")).all()

    @router.get("/{item_id}", response_model=schema)
    def obter(item_id: int, db: Session = Depends(get_db)):
        item = db.query(model).filter(model.Id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail=f"{tag} não encontrado")
        return item

    @router.post("/", response_model=schema)
    def criar(item: schema = Body(...), db: Session = Depends(get_db)):
        db_item = model(**item.model_dump(exclude={"Id"}))
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    @router.put("/{item_id}", response_model=schema)
    def atualizar(
        item_id: int,
        item: schema = Body(...),
        db: Session = Depends(get_db)
    ):
        db_item = db.query(model).filter(model.Id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail=f"{tag} não encontrado")
        
        for key, value in item.model_dump(exclude={"Id"}).items():
            setattr(db_item, key, value)
        
        db.commit()
        db.refresh(db_item)
        return db_item

    @router.delete("/{item_id}")
    def deletar(item_id: int, db: Session = Depends(get_db)):
        db_item = db.query(model).filter(model.Id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail=f"{tag} não encontrado")
        db.delete(db_item)
        db.commit()
        return {"detail": f"{tag} deletado com sucesso"}

    return router


# Criar routers para cada recurso
racas_router = criar_router_crud(RacasModel, RacaSchema, "racas", "Raças")
magias_router = criar_router_crud(MagiasModel, MagiaSchema, "magias", "Magias")
habilidades_router = criar_router_crud(HabilidadesModel, HabilidadeSchema, "habilidades", "Habilidades")
classes_router = criar_router_crud(ClasseModel, ClasseSchema, "classes", "Classes")
equipamentos_router = criar_router_crud(EquipamentosModel, EquipamentoSchema, "equipamentos", "Equipamentos")
atributos_router = criar_router_crud(AtributosModel, AtributoSchema, "atributos", "Atributos")
