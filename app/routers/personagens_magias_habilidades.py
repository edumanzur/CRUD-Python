from typing import List
from fastapi import APIRouter, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import PersonagensModel, MagiasModel, HabilidadesModel
from app.schemas import PersonagemSchema, MagiaSchema, HabilidadeSchema

router = APIRouter(tags=["Personagens - Magias e Habilidades"])


# ============================================================
# ENDPOINTS PARA MAGIAS
# ============================================================

@router.get("/personagens/{personagem_id}/magias", response_model=List[MagiaSchema])
def listar_magias_personagem(personagem_id: int, db: Session = Depends(get_db)):
    """Lista todas as magias de um personagem"""
    personagem = db.query(PersonagensModel).filter(PersonagensModel.Id == personagem_id).first()
    if not personagem:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    return personagem.magias


@router.post("/personagens/{personagem_id}/magias/{magia_id}")
def adicionar_magia_personagem(
    personagem_id: int, 
    magia_id: int, 
    db: Session = Depends(get_db)
):
    """Adiciona uma magia ao personagem"""
    personagem = db.query(PersonagensModel).filter(PersonagensModel.Id == personagem_id).first()
    if not personagem:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    magia = db.query(MagiasModel).filter(MagiasModel.Id == magia_id).first()
    if not magia:
        raise HTTPException(status_code=404, detail="Magia não encontrada")
    
    # Verificar se já possui a magia
    if magia in personagem.magias:
        raise HTTPException(status_code=400, detail="Personagem já possui esta magia")
    
    personagem.magias.append(magia)
    db.commit()
    return {"detail": "Magia adicionada com sucesso"}


@router.delete("/personagens/{personagem_id}/magias/{magia_id}")
def remover_magia_personagem(
    personagem_id: int, 
    magia_id: int, 
    db: Session = Depends(get_db)
):
    """Remove uma magia do personagem"""
    personagem = db.query(PersonagensModel).filter(PersonagensModel.Id == personagem_id).first()
    if not personagem:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    magia = db.query(MagiasModel).filter(MagiasModel.Id == magia_id).first()
    if not magia:
        raise HTTPException(status_code=404, detail="Magia não encontrada")
    
    # Verificar se possui a magia
    if magia not in personagem.magias:
        raise HTTPException(status_code=400, detail="Personagem não possui esta magia")
    
    personagem.magias.remove(magia)
    db.commit()
    return {"detail": "Magia removida com sucesso"}


# ============================================================
# ENDPOINTS PARA HABILIDADES
# ============================================================

@router.get("/personagens/{personagem_id}/habilidades", response_model=List[HabilidadeSchema])
def listar_habilidades_personagem(personagem_id: int, db: Session = Depends(get_db)):
    """Lista todas as habilidades de um personagem"""
    personagem = db.query(PersonagensModel).filter(PersonagensModel.Id == personagem_id).first()
    if not personagem:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    return personagem.habilidades


@router.post("/personagens/{personagem_id}/habilidades/{habilidade_id}")
def adicionar_habilidade_personagem(
    personagem_id: int, 
    habilidade_id: int, 
    db: Session = Depends(get_db)
):
    """Adiciona uma habilidade ao personagem"""
    personagem = db.query(PersonagensModel).filter(PersonagensModel.Id == personagem_id).first()
    if not personagem:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    habilidade = db.query(HabilidadesModel).filter(HabilidadesModel.Id == habilidade_id).first()
    if not habilidade:
        raise HTTPException(status_code=404, detail="Habilidade não encontrada")
    
    # Verificar se já possui a habilidade
    if habilidade in personagem.habilidades:
        raise HTTPException(status_code=400, detail="Personagem já possui esta habilidade")
    
    personagem.habilidades.append(habilidade)
    db.commit()
    return {"detail": "Habilidade adicionada com sucesso"}


@router.delete("/personagens/{personagem_id}/habilidades/{habilidade_id}")
def remover_habilidade_personagem(
    personagem_id: int, 
    habilidade_id: int, 
    db: Session = Depends(get_db)
):
    """Remove uma habilidade do personagem"""
    personagem = db.query(PersonagensModel).filter(PersonagensModel.Id == personagem_id).first()
    if not personagem:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    habilidade = db.query(HabilidadesModel).filter(HabilidadesModel.Id == habilidade_id).first()
    if not habilidade:
        raise HTTPException(status_code=404, detail="Habilidade não encontrada")
    
    # Verificar se possui a habilidade
    if habilidade not in personagem.habilidades:
        raise HTTPException(status_code=400, detail="Personagem não possui esta habilidade")
    
    personagem.habilidades.remove(habilidade)
    db.commit()
    return {"detail": "Habilidade removida com sucesso"}
