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
    Categoria = Column(String)
    Nivel = Column(Integer)
    Icone = Column(String)
    CustoMana = Column(Integer)
    Cooldown = Column(Integer)
    Efeito = Column(Text)


class HabilidadesModel(Base):
    __tablename__ = "Habilidades"
    Id = Column(Integer, primary_key=True, index=True)
    Nome = Column(String, nullable=False)
    Descricao = Column(Text)
    Tipo = Column(String)
    Cooldown = Column(Integer)
    Icone = Column(String)
    Efeito = Column(Text)
    Dano = Column(Integer)


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
    Level = Column(Integer, default=1)
    # Novos status
    Vida = Column(Integer, default=100)
    Forca = Column(Integer, default=10)
    Destreza = Column(Integer, default=10)
    Constituicao = Column(Integer, default=10)
    Inteligencia = Column(Integer, default=10)
    Sabedoria = Column(Integer, default=10)
    Mana = Column(Integer, default=100)
    Carisma = Column(Integer, default=10)
    Sorte = Column(Integer, default=10)
    Reputacao = Column(Integer, default=0)
    CA = Column(Integer, default=10)  # Classe de Armadura
    Deslocamento = Column(Integer, default=30)  # Velocidade de movimento
    Classe_Nome = Column(String, default="Guerreiro")  # Nome da classe do personagem
    Raca_Nome = Column(String, default="Humano")  # Nome da raça do personagem
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
    Tipo = Column(String)  # weapon, armor, accessory, consumable, tool
    Raridade = Column(String)  # common, uncommon, rare, epic, legendary
    Icone = Column(String)
    Ataque = Column(Integer)
    Defesa = Column(Integer)
    Bonus = Column(Integer)
    Peso = Column(Integer)

    personagens = relationship("PersonagensModel", back_populates="equipamento")


# ============================================================
# SCHEMAS PYDANTIC
# ============================================================
class MagiaSchema(BaseModel):
    Id: int
    Nome: str
    Descricao: Optional[str] = None
    Categoria: Optional[str] = None
    Nivel: Optional[int] = None
    Icone: Optional[str] = None
    CustoMana: Optional[int] = None
    Cooldown: Optional[int] = None
    Efeito: Optional[str] = None
    model_config = {"from_attributes": True}


class HabilidadeSchema(BaseModel):
    Id: int
    Nome: str
    Descricao: Optional[str] = None
    Tipo: Optional[str] = None
    Cooldown: Optional[int] = None
    Icone: Optional[str] = None
    Efeito: Optional[str] = None
    Dano: Optional[int] = None
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
    # Novos status
    Vida: Optional[int] = 100
    Forca: Optional[int] = 10
    Destreza: Optional[int] = 10
    Constituicao: Optional[int] = 10
    Inteligencia: Optional[int] = 10
    Sabedoria: Optional[int] = 10
    Mana: Optional[int] = 100
    Carisma: Optional[int] = 10
    Sorte: Optional[int] = 10
    Reputacao: Optional[int] = 0
    CA: Optional[int] = 10  # Classe de Armadura
    Deslocamento: Optional[int] = 30
    Classe_Nome: Optional[str] = "Guerreiro"  # Nome da classe do personagem
    Raca_Nome: Optional[str] = "Humano"  # Nome da raça do personagem
    raca: Optional[RacaSchema] = None
    classe: Optional[ClasseSchema] = None
    equipamento: Optional[EquipamentoSchema] = None
    atributos: Optional[List[AtributoSchema]] = None
    magias: Optional[List[MagiaSchema]] = None
    habilidades: Optional[List[HabilidadeSchema]] = None
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
        # Excluir Id e relationships ao criar um novo item
        item_data = item.model_dump(exclude={'Id', 'magias', 'habilidades', 'equipamentos', 'atributos', 'raca', 'classe', 'equipamento', 'personagens', 'personagens_equipados'})
        db_item = model(**item_data)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    @app.put(f"/{prefix}/{{item_id}}", response_model=schema)
    def atualizar(item_id: int, item: schema = Body(...), db: Session = Depends(get_db)):
        db_item = db.query(model).filter(model.Id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail=f"{prefix} não encontrado")
        # Excluir Id e só atualizar campos enviados
        for key, value in item.model_dump(exclude={'Id'}, exclude_unset=True).items():
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
# INCLUIR ROUTER DE MAGIAS E HABILIDADES DE PERSONAGENS
# ============================================================
try:
    from app.routers.personagens_magias_habilidades import router as personagens_magias_habilidades_router
    app.include_router(personagens_magias_habilidades_router)
    print("✅ Router de personagens_magias_habilidades carregado com sucesso!")
except ImportError as e:
    print(f"❌ Erro ao carregar router de personagens_magias_habilidades: {e}")
except Exception as e:
    print(f"❌ Erro inesperado ao carregar router: {e}")

# ============================================================
# INCLUIR ROUTER DE EQUIPAMENTOS DE PERSONAGENS
# ============================================================
try:
    from app.routers.personagens_equipamentos import router as personagens_equipamentos_router
    app.include_router(personagens_equipamentos_router)
    print("✅ Router de personagens_equipamentos carregado com sucesso!")
except ImportError as e:
    print(f"❌ Erro ao carregar router de personagens_equipamentos: {e}")
except Exception as e:
    print(f"❌ Erro inesperado ao carregar router de equipamentos: {e}")


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
