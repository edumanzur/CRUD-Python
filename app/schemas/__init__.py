from typing import List, Optional
from pydantic import BaseModel


class MagiaSchema(BaseModel):
    Id: int
    Nome: str
    Descricao: Optional[str] = None
    Categoria: Optional[str] = None  # attack, defense, support, buff, debuff
    Nivel: Optional[int] = None
    Icone: Optional[str] = None
    CustoMana: Optional[int] = None
    Cooldown: Optional[int] = None
    Efeito: Optional[str] = None
    
    model_config = {"from_attributes": True}


class MagiaCreateSchema(BaseModel):
    """Schema para criação de magia (sem Id)"""
    Nome: str
    Descricao: Optional[str] = None
    Categoria: Optional[str] = None
    Nivel: Optional[int] = None
    Icone: Optional[str] = None
    CustoMana: Optional[int] = None
    Cooldown: Optional[int] = None
    Efeito: Optional[str] = None


class MagiaUpdateSchema(BaseModel):
    """Schema para atualização de magia"""
    Nome: Optional[str] = None
    Descricao: Optional[str] = None
    Categoria: Optional[str] = None
    Nivel: Optional[int] = None
    Icone: Optional[str] = None
    CustoMana: Optional[int] = None
    Cooldown: Optional[int] = None
    Efeito: Optional[str] = None


class HabilidadeSchema(BaseModel):
    Id: int
    Nome: str
    Descricao: Optional[str] = None
    Tipo: Optional[str] = None  # passive, active, ultimate, special
    Cooldown: Optional[int] = None
    Icone: Optional[str] = None
    Efeito: Optional[str] = None
    Dano: Optional[int] = None
    
    model_config = {"from_attributes": True}


class HabilidadeCreateSchema(BaseModel):
    """Schema para criação de habilidade (sem Id)"""
    Nome: str
    Descricao: Optional[str] = None
    Tipo: Optional[str] = None
    Cooldown: Optional[int] = None
    Icone: Optional[str] = None
    Efeito: Optional[str] = None
    Dano: Optional[int] = None


class HabilidadeUpdateSchema(BaseModel):
    """Schema para atualização de habilidade"""
    Nome: Optional[str] = None
    Descricao: Optional[str] = None
    Tipo: Optional[str] = None
    Cooldown: Optional[int] = None
    Icone: Optional[str] = None
    Efeito: Optional[str] = None
    Dano: Optional[int] = None


class RacaSchema(BaseModel):
    Id: int
    Nome: str
    Passiva: Optional[str] = None
    Caracteristica: Optional[str] = None
    
    model_config = {"from_attributes": True}


class ClasseSchema(BaseModel):
    Id: int
    Nome: str
    Descricao: Optional[str] = None
    habilidades: Optional[HabilidadeSchema] = None
    magias: Optional[MagiaSchema] = None
    
    model_config = {"from_attributes": True}


class AtributoSchema(BaseModel):
    Id: int
    Nome: str
    Descricao: Optional[str] = None
    Quantidade: int
    
    model_config = {"from_attributes": True}


class EquipamentoSchema(BaseModel):
    Id: int
    Nome: str
    Descricao: Optional[str] = None
    Tipo: Optional[str] = None
    Raridade: Optional[str] = None
    Icone: Optional[str] = None
    Ataque: Optional[int] = None
    Defesa: Optional[int] = None
    Bonus: Optional[int] = None
    Peso: Optional[int] = None
    
    model_config = {"from_attributes": True}


class PersonagemSchema(BaseModel):
    Id: int
    Nome: str
    Historia: Optional[str] = None
    Tendencia: Optional[str] = None
    Level: Optional[int] = 1
    Strength: Optional[int] = 10
    Agility: Optional[int] = 10
    Intelligence: Optional[int] = 10
    Health: Optional[int] = 100
    raca: Optional[RacaSchema] = None
    classe: Optional[ClasseSchema] = None
    equipamento: Optional[EquipamentoSchema] = None
    atributos: Optional[List[AtributoSchema]] = None
    magias: Optional[List[MagiaSchema]] = None
    habilidades: Optional[List[HabilidadeSchema]] = None
    
    model_config = {"from_attributes": True}


class PersonagemCreateSchema(BaseModel):
    """Schema para criação de personagem (sem relacionamentos aninhados)"""
    Nome: str
    Historia: Optional[str] = None
    Tendencia: Optional[str] = None
    Level: Optional[int] = 1
    Strength: Optional[int] = 10
    Agility: Optional[int] = 10
    Intelligence: Optional[int] = 10
    Health: Optional[int] = 100
    Raca_id: Optional[int] = None
    Classe_id: Optional[int] = None
    Equipamento_id: Optional[int] = None


class PersonagemUpdateSchema(BaseModel):
    """Schema para atualização de personagem (sem relacionamentos aninhados)"""
    Nome: Optional[str] = None
    Historia: Optional[str] = None
    Tendencia: Optional[str] = None
    Level: Optional[int] = None
    Strength: Optional[int] = None
    Agility: Optional[int] = None
    Intelligence: Optional[int] = None
    Health: Optional[int] = None
    Raca_id: Optional[int] = None
    Classe_id: Optional[int] = None
    Equipamento_id: Optional[int] = None
