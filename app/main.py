from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, Query, Body, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship, Session
import os
import shutil
from pathlib import Path
from PIL import Image
import io

# Importar configurações
from app.config import settings

# ============================================================
# CONFIGURAÇÃO DO BANCO
# ============================================================
# Usar PostgreSQL (Supabase) via variável de ambiente
DATABASE_URL = settings.database_url

# Configuração do engine para PostgreSQL
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verifica conexões antes de usar
    pool_size=10,  # Tamanho do pool de conexões
    max_overflow=20,  # Conexões extras permitidas
    echo=settings.debug,  # Log de SQL em modo debug
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Debug: Mostrar informações da conexão (sem expor senha)
print(f"🗄️  Banco de dados: PostgreSQL (Supabase)")
print(f"🔍 Ambiente: {settings.app_env}")

app = FastAPI(title="RPG API Completa + CRUD + Busca")


# CORS - DEVE VIR ANTES DE MONTAR ARQUIVOS ESTÁTICOS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar caminho da pasta uploads relativo ao arquivo main.py
UPLOAD_BASE_DIR = Path(__file__).parent / "uploads"
UPLOAD_BASE_DIR.mkdir(parents=True, exist_ok=True)

# Montar pasta de uploads como estática
try:
    app.mount("/uploads", StaticFiles(directory=str(UPLOAD_BASE_DIR)), name="uploads")
    print(f"✅ Pasta uploads montada: {UPLOAD_BASE_DIR}")
except Exception as e:
    print(f"⚠️ Erro ao montar uploads: {e}")

# ============================================================
# MODELOS SQLALCHEMY
# ============================================================
class CampanhasModel(Base):
    __tablename__ = "Campanhas"
    Id = Column(Integer, primary_key=True, index=True)
    Nome = Column(String, nullable=False)
    Descricao = Column(Text)
    DataCriacao = Column(String)
    Ativa = Column(Integer, default=0)


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
    Dano = Column(String)  # Dano no formato XdY (ex: 2d6, 1d8+2)
    Classes = Column(String)  # Classes que podem usar (separadas por vírgula)
    Modificador = Column(String)  # Atributo do personagem usado como modificador (Força, Destreza, etc.)
    Campanha_id = Column(Integer, nullable=True)  # Campanha à qual pertence


class HabilidadesModel(Base):
    __tablename__ = "Habilidades"
    Id = Column(Integer, primary_key=True, index=True)
    Nome = Column(String, nullable=False)
    Descricao = Column(Text)
    Tipo = Column(String)
    Cooldown = Column(Integer)
    Icone = Column(String)
    Efeito = Column(Text)
    Dano = Column(String)  # Dano no formato XdY (ex: 2d6, 1d8+2)
    Classes = Column(String)  # Classes que podem usar (separadas por vírgula)
    Modificador = Column(String)  # Atributo do personagem usado como modificador (Força, Destreza, etc.)
    Campanha_id = Column(Integer, nullable=True)  # Campanha à qual pertence


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
    Tipo = Column(String, default="Jogador")  # Jogador, NPC, ou Monstro
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
    Campanha_id = Column(Integer, nullable=True)  # Campanha à qual pertence
    ImagemPath = Column(Text, nullable=True)  # Caminho da imagem do personagem

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
    Dano = Column(String)  # Formato: XdY (ex: 2d4, 1d8, 3d6)
    Proficiencia = Column(String)  # Ex: Armas Simples, Armas Marciais, Armaduras Leves
    Modificador = Column(String)  # Atributo do personagem usado como modificador (Força, Destreza, etc.)
    Campanha_id = Column(Integer, nullable=True)  # Campanha à qual pertence

    personagens = relationship("PersonagensModel", back_populates="equipamento")


# ============================================================
# SCHEMAS PYDANTIC
# ============================================================
class CampanhaSchema(BaseModel):
    Id: int
    Nome: str
    Descricao: Optional[str] = None
    DataCriacao: Optional[str] = None
    Ativa: Optional[int] = 0
    model_config = {"from_attributes": True}


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
    Dano: Optional[str] = None  # Dano no formato XdY (ex: 2d6, 1d8+2)
    Classes: Optional[str] = None  # Classes que podem usar (separadas por vírgula)
    Campanha_id: Optional[int] = None  # Campanha à qual pertence
    model_config = {"from_attributes": True}


class HabilidadeSchema(BaseModel):
    Id: int
    Nome: str
    Descricao: Optional[str] = None
    Tipo: Optional[str] = None
    Cooldown: Optional[int] = None
    Icone: Optional[str] = None
    Efeito: Optional[str] = None
    Dano: Optional[str] = None  # Dano no formato XdY (ex: 2d6, 1d8+2)
    Classes: Optional[str] = None  # Classes que podem usar (separadas por vírgula)
    Campanha_id: Optional[int] = None  # Campanha à qual pertence
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
    Dano: Optional[str] = None  # Formato: XdY (ex: 2d4, 1d8, 3d6)
    Proficiencia: Optional[str] = None  # Ex: Armas Simples, Armas Marciais
    Modificador: Optional[str] = None  # Atributo do personagem (Força, Destreza, etc.)
    Campanha_id: Optional[int] = None  # Campanha à qual pertence
    model_config = {"from_attributes": True}


class PersonagemSchema(BaseModel):
    Id: int
    Nome: str
    Historia: Optional[str] = None
    Tendencia: Optional[str] = None
    Level: Optional[int] = 1
    Tipo: Optional[str] = "Jogador"  # Jogador, NPC, ou Monstro
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
    Campanha_id: Optional[int] = None  # Campanha à qual pertence
    ImagemPath: Optional[str] = None  # Caminho da imagem do personagem
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
    def listar(campanha_id: Optional[int] = Query(None, description="Filtrar por campanha"), db: Session = Depends(get_db)):
        query = db.query(model)
        # Se o modelo tem Campanha_id e foi fornecido, filtrar
        if campanha_id is not None and hasattr(model, 'Campanha_id'):
            query = query.filter(model.Campanha_id == campanha_id)
        return query.all()

    @app.get(f"/{prefix}/search", response_model=List[schema])
    def buscar(
        nome: str = Query(..., description=f"Buscar {prefix} por nome"),
        campanha_id: Optional[int] = Query(None, description="Filtrar por campanha"),
        db: Session = Depends(get_db)
    ):
        query = db.query(model).filter(model.Nome.ilike(f"%{nome}%"))
        # Se o modelo tem Campanha_id e foi fornecido, filtrar
        if campanha_id is not None and hasattr(model, 'Campanha_id'):
            query = query.filter(model.Campanha_id == campanha_id)
        return query.all()

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
# ENDPOINTS ESPECÍFICOS PARA CAMPANHAS
# ============================================================
@app.get("/campanhas/", response_model=List[CampanhaSchema])
def listar_campanhas(db: Session = Depends(get_db)):
    """Lista todas as campanhas"""
    print("🔍 [GET /campanhas/] Listando todas as campanhas...")
    campanhas = db.query(CampanhasModel).all()
    print(f"✅ Encontradas {len(campanhas)} campanhas")
    for c in campanhas:
        print(f"  - {c.Nome} (ID: {c.Id}, Ativa: {c.Ativa})")
    return campanhas


@app.get("/campanhas/ativa", response_model=CampanhaSchema)
def obter_campanha_ativa(db: Session = Depends(get_db)):
    """Retorna a campanha ativa atual"""
    print("🔍 [GET /campanhas/ativa] Buscando campanha ativa...")
    
    campanha = db.query(CampanhasModel).filter(CampanhasModel.Ativa == 1).first()
    
    if not campanha:
        print("⚠️ Nenhuma campanha ativa encontrada, buscando primeira campanha...")
        # Se não houver campanha ativa, retorna a primeira (padrão)
        campanha = db.query(CampanhasModel).first()
        if not campanha:
            print("❌ Nenhuma campanha encontrada no banco!")
            raise HTTPException(status_code=404, detail="Nenhuma campanha encontrada")
        print(f"ℹ️ Usando primeira campanha: {campanha.Nome} (ID: {campanha.Id})")
    else:
        print(f"✅ Campanha ativa encontrada: {campanha.Nome} (ID: {campanha.Id})")
    
    return campanha


@app.get("/campanhas/{campanha_id}", response_model=CampanhaSchema)
def obter_campanha(campanha_id: int, db: Session = Depends(get_db)):
    """Retorna uma campanha específica por ID"""
    campanha = db.query(CampanhasModel).filter(CampanhasModel.Id == campanha_id).first()
    if not campanha:
        raise HTTPException(status_code=404, detail="Campanha não encontrada")
    return campanha


@app.post("/campanhas/", response_model=CampanhaSchema)
def criar_campanha(campanha: CampanhaSchema = Body(...), db: Session = Depends(get_db)):
    """Cria uma nova campanha"""
    from datetime import datetime
    campanha_data = campanha.model_dump(exclude={'Id'})
    if not campanha_data.get('DataCriacao'):
        campanha_data['DataCriacao'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_campanha = CampanhasModel(**campanha_data)
    db.add(db_campanha)
    db.commit()
    db.refresh(db_campanha)
    return db_campanha


@app.put("/campanhas/{campanha_id}/ativar")
def ativar_campanha(campanha_id: int, db: Session = Depends(get_db)):
    """Define uma campanha como ativa (desativa todas as outras)"""
    print(f"🎯 [PUT /campanhas/{campanha_id}/ativar] Tentando ativar campanha...")
    
    # Desativar todas as campanhas
    db.query(CampanhasModel).update({CampanhasModel.Ativa: 0})
    print("✅ Todas as campanhas desativadas")
    
    # Ativar a campanha específica
    campanha = db.query(CampanhasModel).filter(CampanhasModel.Id == campanha_id).first()
    if not campanha:
        print(f"❌ Campanha ID {campanha_id} não encontrada!")
        raise HTTPException(status_code=404, detail="Campanha não encontrada")
    
    campanha.Ativa = 1
    db.commit()
    print(f"✅ Campanha '{campanha.Nome}' (ID: {campanha.Id}) ativada com sucesso!")
    return {"detail": f"Campanha '{campanha.Nome}' ativada com sucesso"}


@app.put("/campanhas/{campanha_id}", response_model=CampanhaSchema)
def atualizar_campanha(campanha_id: int, campanha: CampanhaSchema = Body(...), db: Session = Depends(get_db)):
    """Atualiza uma campanha existente"""
    db_campanha = db.query(CampanhasModel).filter(CampanhasModel.Id == campanha_id).first()
    if not db_campanha:
        raise HTTPException(status_code=404, detail="Campanha não encontrada")
    
    for key, value in campanha.model_dump(exclude={'Id'}, exclude_unset=True).items():
        setattr(db_campanha, key, value)
    
    db.commit()
    db.refresh(db_campanha)
    return db_campanha


@app.delete("/campanhas/{campanha_id}")
def deletar_campanha(campanha_id: int, db: Session = Depends(get_db)):
    """Deleta uma campanha e TODOS os seus dados relacionados"""
    campanha = db.query(CampanhasModel).filter(CampanhasModel.Id == campanha_id).first()
    if not campanha:
        raise HTTPException(status_code=404, detail="Campanha não encontrada")
    
    # Deletar todos os dados relacionados à campanha
    db.query(PersonagensModel).filter(PersonagensModel.Campanha_id == campanha_id).delete()
    db.query(MagiasModel).filter(MagiasModel.Campanha_id == campanha_id).delete()
    db.query(HabilidadesModel).filter(HabilidadesModel.Campanha_id == campanha_id).delete()
    db.query(EquipamentosModel).filter(EquipamentosModel.Campanha_id == campanha_id).delete()
    
    # Deletar a campanha
    db.delete(campanha)
    db.commit()
    return {"detail": f"Campanha '{campanha.Nome}' e todos os seus dados foram deletados"}


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
# ENDPOINTS DE UPLOAD DE IMAGENS PARA PERSONAGENS
# ============================================================
# Usar caminho relativo ao arquivo main.py
UPLOAD_DIR = Path(__file__).parent / "uploads" / "personagens"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_IMAGE_SIZE = (800, 800)  # Redimensionar para no máximo 800x800px


@app.post("/personagens/{personagem_id}/upload-imagem")
async def upload_imagem_personagem(
    personagem_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload de imagem para um personagem"""
    # Verificar se personagem existe
    personagem = db.query(PersonagensModel).filter(PersonagensModel.Id == personagem_id).first()
    if not personagem:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    # Validar extensão do arquivo
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Tipo de arquivo não permitido. Use: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    try:
        # Ler e processar imagem
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Converter para RGB se necessário (para salvar como JPEG)
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        
        # Redimensionar mantendo proporção
        image.thumbnail(MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)
        
        # Deletar imagem antiga se existir
        if personagem.ImagemPath:
            old_file = Path(personagem.ImagemPath.lstrip("/"))
            if old_file.exists():
                old_file.unlink()
        
        # Salvar nova imagem
        filename = f"{personagem_id}{file_ext}"
        file_path = UPLOAD_DIR / filename
        image.save(file_path, quality=85, optimize=True)
        
        # Atualizar banco de dados
        personagem.ImagemPath = f"/uploads/personagens/{filename}"
        db.commit()
        
        return {
            "detail": "Imagem enviada com sucesso",
            "imagemPath": personagem.ImagemPath
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar imagem: {str(e)}")


@app.delete("/personagens/{personagem_id}/imagem")
def deletar_imagem_personagem(personagem_id: int, db: Session = Depends(get_db)):
    """Deletar imagem de um personagem"""
    personagem = db.query(PersonagensModel).filter(PersonagensModel.Id == personagem_id).first()
    if not personagem:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    if not personagem.ImagemPath:
        raise HTTPException(status_code=404, detail="Personagem não possui imagem")
    
    # Deletar arquivo físico
    file_path = Path(personagem.ImagemPath.lstrip("/"))
    if file_path.exists():
        file_path.unlink()
    
    # Remover caminho do banco
    personagem.ImagemPath = None
    db.commit()
    
    return {"detail": "Imagem deletada com sucesso"}


# ============================================================
# ROTA RAIZ
# ============================================================
@app.get("/")
def read_root():
    print("✅ [GET /] API Root acessada")
    return {
        "message": "RPG API está funcionando!",
        "status": "ok",
        "version": "2.0",
        "endpoints": {
            "campanhas": "/campanhas/",
            "campanha_ativa": "/campanhas/ativa",
            "personagens": "/personagens/",
            "magias": "/magias/",
            "habilidades": "/habilidades/",
            "equipamentos": "/equipamentos/"
        }
    }


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
