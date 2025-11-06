from sqlalchemy import Column, Integer, String, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base


# Tabela de associação Many-to-Many: Personagens <-> Magias
personagem_magias = Table(
    'Personagem_Magias',
    Base.metadata,
    Column('Personagem_id', Integer, ForeignKey('Personagens.Id'), primary_key=True),
    Column('Magia_id', Integer, ForeignKey('Magias.Id'), primary_key=True)
)

# Tabela de associação Many-to-Many: Personagens <-> Habilidades
personagem_habilidades = Table(
    'Personagem_Habilidades',
    Base.metadata,
    Column('Personagem_id', Integer, ForeignKey('Personagens.Id'), primary_key=True),
    Column('Habilidade_id', Integer, ForeignKey('Habilidades.Id'), primary_key=True)
)

# Tabela de associação Many-to-Many: Personagens <-> Equipamentos
personagem_equipamentos = Table(
    'Personagem_Equipamentos',
    Base.metadata,
    Column('Personagem_id', Integer, ForeignKey('Personagens.Id'), primary_key=True),
    Column('Equipamento_id', Integer, ForeignKey('Equipamentos.Id'), primary_key=True)
)


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
    Categoria = Column(String)  # attack, defense, support, buff, debuff
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
    Tipo = Column(String)  # passive, active, ultimate, special
    Cooldown = Column(Integer)
    Icone = Column(String)
    Efeito = Column(Text)
    Dano = Column(Integer)  # Dano base da habilidade


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
    magias = relationship(
        "MagiasModel",
        secondary=personagem_magias,
        backref="personagens"
    )
    habilidades = relationship(
        "HabilidadesModel",
        secondary=personagem_habilidades,
        backref="personagens"
    )
    equipamentos = relationship(
        "EquipamentosModel",
        secondary=personagem_equipamentos,
        backref="personagens_equipados"
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

    personagens = relationship("PersonagensModel", back_populates="equipamento")
