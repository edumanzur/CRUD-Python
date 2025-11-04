from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship, Session

# ============================================================
# CONFIGURAÇÃO DO BANCO
# ============================================================
DATABASE_URL = "sqlite:///./sistema_rpg.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI(title="RPG API Completa + CRUD + Busca")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# MODELOS SQLALCHEMY
# ============================================================
class RacasModel(Base):
    __tablename__ = "Racas"
    Id = Column(Integer, primary_key=True, index=True)
    Nome = Column(String, nullable=False)
    Passiva = Column(Text)
    Caracteristica = Column(Text)
    personagens = relationship("PersonagensModel", back_populates="raca")


class MagiasModel(Base):
    __tablename__ = "Magias"
    Id = Column(Integer, primary_key=True, index=True)
    Nome = Column(String, nullable=False)
    Descricao = Column(Text)


class HabilidadesModel(Base):
    __tablename__ = "Habilidades"
    Id = Column(Integer, primary_key=True, index=True)
    Nome = Column(String, nullable=False)
    Descricao = Column(Text)


class ClasseModel(Base):
    __tablename__ = "Classe"
    Id = Column(Integer, primary_key=True, index=True)
    Nome = Column(String, nullable=False)
    Descricao = Column(Text)
    Habilidades_id = Column(Integer, ForeignKey("Habilidades.Id"), nullable=True)
    Magias_id = Column(Integer, ForeignKey("Magias.Id"), nullable=True)

    habilidades = relationship("HabilidadesModel")
    magias = relationship("MagiasModel")
    personagens = relationship("PersonagensModel", back_populates="classe")


class PersonagensModel(Base):
    __tablename__ = "Personagens"
    Id = Column(Integer, primary_key=True, index=True)
    Nome = Column(String, nullable=False)
    Historia = Column(Text)
    Tendencia = Column(String)
    Raca_id = Column(Integer, ForeignKey("Racas.Id"), nullable=True)
    Classe_id = Column(Integer, ForeignKey("Classe.Id"), nullable=True)
    Equipamento_id = Column(Integer, ForeignKey("Equipamentos.Id"), nullable=True)

    raca = relationship("RacasModel", back_populates="personagens")
    classe = relationship("ClasseModel", back_populates="personagens")
    equipamento = relationship("EquipamentosModel", back_populates="personagens")
    atributos = relationship(
        "AtributosModel",
        back_populates="personagem",
        cascade="all, delete-orphan",
        uselist=True
    )


class AtributosModel(Base):
    __tablename__ = "Atributos"
    Id = Column(Integer, primary_key=True, index=True)
    Personagem_id = Column(Integer, ForeignKey("Personagens.Id"), nullable=False)
    Nome = Column(String, nullable=False)
    Descricao = Column(Text)
    Quantidade = Column(Integer)

    personagem = relationship(
        "PersonagensModel",
        back_populates="atributos",
        uselist=False
    )


class EquipamentosModel(Base):
    __tablename__ = "Equipamentos"
    Id = Column(Integer, primary_key=True, index=True)
    Nome = Column(String, nullable=False)
    Descricao = Column(Text)
    Bonus = Column(Integer)

    personagens = relationship("PersonagensModel", back_populates="equipamento")


# ============================================================
# SCHEMAS PYDANTIC
# ============================================================
class MagiaSchema(BaseModel):
    Id: int
    Nome: str
    Descricao: Optional[str] = None
    model_config = {"from_attributes": True}


class HabilidadeSchema(BaseModel):
    Id: int
    Nome: str
    Descricao: Optional[str] = None
    model_config = {"from_attributes": True}


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
    Bonus: int
    model_config = {"from_attributes": True}


class PersonagemSchema(BaseModel):
    Id: int
    Nome: str
    Historia: Optional[str] = None
    Tendencia: Optional[str] = None
    raca: Optional[RacaSchema] = None
    classe: Optional[ClasseSchema] = None
    equipamento: Optional[EquipamentoSchema] = None
    atributos: Optional[List[AtributoSchema]] = None
    model_config = {"from_attributes": True}


# ============================================================
# DEPENDÊNCIA DE BANCO
# ============================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================
# CRIAR TABELAS
# ============================================================
Base.metadata.create_all(bind=engine)


# ============================================================
# FUNÇÃO GENÉRICA CRUD + BUSCA
# ============================================================
def criar_rotas_crud(model, schema, prefix: str):
    @app.get(f"/{prefix}/", response_model=List[schema])
    def listar(db: Session = Depends(get_db)):
        return db.query(model).all()

    @app.get(f"/{prefix}/search", response_model=List[schema])
    def buscar(nome: str = Query(..., description=f"Buscar {prefix} por nome"), db: Session = Depends(get_db)):
        return db.query(model).filter(model.Nome.ilike(f"%{nome}%")).all()

    @app.post(f"/{prefix}/", response_model=schema)
    def criar(item: schema = Body(...), db: Session = Depends(get_db)):
        db_item = model(**item.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    @app.put(f"/{prefix}/{{item_id}}", response_model=schema)
    def atualizar(item_id: int, item: schema = Body(...), db: Session = Depends(get_db)):
        db_item = db.query(model).filter(model.Id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail=f"{prefix} não encontrado")
        for key, value in item.model_dump().items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
        return db_item

    @app.delete(f"/{prefix}/{{item_id}}")
    def deletar(item_id: int, db: Session = Depends(get_db)):
        db_item = db.query(model).filter(model.Id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail=f"{prefix} não encontrado")
        db.delete(db_item)
        db.commit()
        return {"detail": f"{prefix} deletado"}


# ============================================================
# CRIAR ROTAS CRUD AUTOMÁTICAS
# ============================================================
criar_rotas_crud(RacasModel, RacaSchema, "racas")
criar_rotas_crud(MagiasModel, MagiaSchema, "magias")
criar_rotas_crud(HabilidadesModel, HabilidadeSchema, "habilidades")
criar_rotas_crud(ClasseModel, ClasseSchema, "classes")
criar_rotas_crud(AtributosModel, AtributoSchema, "atributos")
criar_rotas_crud(EquipamentosModel, EquipamentoSchema, "equipamentos")
criar_rotas_crud(PersonagensModel, PersonagemSchema, "personagens")


# ============================================================
# ROTA RAIZ
# ============================================================
@app.get("/")
def read_root():
    return {"message": "RPG API está funcionando!"}


# ============================================================
# POPULAR DADOS AUTOMATICAMENTE
# ============================================================
@app.on_event("startup")
def popular_dados():
    db = SessionLocal()
    try:
        if db.query(RacasModel).first():
            return  # evita duplicar dados

        # Raças
        r1 = RacasModel(Nome="Humano", Passiva="Adaptação rápida", Caracteristica="Versátil")
        r2 = RacasModel(Nome="Elfo", Passiva="Visão aguçada", Caracteristica="Alta destreza")
        db.add_all([r1, r2])
        db.commit()

        # Magias
        m1 = MagiasModel(Nome="Bola de Fogo", Descricao="Dano em área")
        m2 = MagiasModel(Nome="Cura", Descricao="Restaura PV")
        db.add_all([m1, m2])
        db.commit()

        # Habilidades
        h1 = HabilidadesModel(Nome="Ataque Poderoso", Descricao="Golpe físico")
        h2 = HabilidadesModel(Nome="Furtividade", Descricao="Movimento silencioso")
        db.add_all([h1, h2])
        db.commit()

        # Classes
        c1 = ClasseModel(Nome="Guerreiro", Descricao="Combate corpo a corpo", Habilidades_id=h1.Id)
        c2 = ClasseModel(Nome="Mago", Descricao="Especialista em magia", Habilidades_id=h2.Id, Magias_id=m1.Id)
        db.add_all([c1, c2])
        db.commit()

        # Atributos
        a1 = AtributosModel(Nome="Força", Descricao="Poder físico", Quantidade=15, Personagem_id=1)
        a2 = AtributosModel(Nome="Inteligência", Descricao="Poder mágico", Quantidade=18, Personagem_id=2)

        # Equipamentos
        e1 = EquipamentosModel(Nome="Espada Longa", Descricao="Corte afiado", Bonus=3)
        e2 = EquipamentosModel(Nome="Cajado", Descricao="Conduz magia", Bonus=2)
        db.add_all([e1, e2])
        db.commit()

        # Personagens
        p1 = PersonagensModel(Nome="Arthas", Historia="Herói do reino", Tendencia="Leal Bom", Raca_id=r1.Id, Classe_id=c1.Id, Equipamento_id=e1.Id, atributos=[a1])
        p2 = PersonagensModel(Nome="Elrond", Historia="Elfo sábio", Tendencia="Neutro Bom", Raca_id=r2.Id, Classe_id=c2.Id, Equipamento_id=e2.Id, atributos=[a2])
        db.add_all([p1, p2])
        db.commit()
    finally:
        db.close()
