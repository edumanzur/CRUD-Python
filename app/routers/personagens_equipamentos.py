from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import PersonagensModel, EquipamentosModel
from app.schemas import PersonagemSchema, EquipamentoSchema

router = APIRouter(tags=["Personagens - Equipamentos"])


# ============================================================
# ENDPOINTS PARA EQUIPAMENTOS
# ============================================================

@router.get("/personagens/{personagem_id}/equipamentos", response_model=List[EquipamentoSchema])
def listar_equipamentos_personagem(personagem_id: int, db: Session = Depends(get_db)):
    """Lista todos os equipamentos de um personagem"""
    personagem = db.query(PersonagensModel).filter(PersonagensModel.Id == personagem_id).first()
    if not personagem:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    return personagem.equipamentos


@router.post("/personagens/{personagem_id}/equipamentos/{equipamento_id}")
def adicionar_equipamento_personagem(
    personagem_id: int, 
    equipamento_id: int, 
    db: Session = Depends(get_db)
):
    """Adiciona um equipamento ao personagem"""
    personagem = db.query(PersonagensModel).filter(PersonagensModel.Id == personagem_id).first()
    if not personagem:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    equipamento = db.query(EquipamentosModel).filter(EquipamentosModel.Id == equipamento_id).first()
    if not equipamento:
        raise HTTPException(status_code=404, detail="Equipamento não encontrado")
    
    # Verificar se já possui o equipamento
    if equipamento in personagem.equipamentos:
        raise HTTPException(status_code=400, detail="Personagem já possui este equipamento")
    
    personagem.equipamentos.append(equipamento)
    db.commit()
    return {"detail": "Equipamento adicionado com sucesso"}


@router.delete("/personagens/{personagem_id}/equipamentos/{equipamento_id}")
def remover_equipamento_personagem(
    personagem_id: int, 
    equipamento_id: int, 
    db: Session = Depends(get_db)
):
    """Remove um equipamento do personagem"""
    personagem = db.query(PersonagensModel).filter(PersonagensModel.Id == personagem_id).first()
    if not personagem:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    equipamento = db.query(EquipamentosModel).filter(EquipamentosModel.Id == equipamento_id).first()
    if not equipamento:
        raise HTTPException(status_code=404, detail="Equipamento não encontrado")
    
    # Verificar se possui o equipamento
    if equipamento not in personagem.equipamentos:
        raise HTTPException(status_code=400, detail="Personagem não possui este equipamento")
    
    personagem.equipamentos.remove(equipamento)
    db.commit()
    return {"detail": "Equipamento removido com sucesso"}
