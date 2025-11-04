import os
import sqlite3

# ============================
# CONEXÃO COM O BANCO
# ============================

# Garante que o banco será criado NA MESMA PASTA do script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "sistema_rpg.db")

print("📁 Banco será criado em:", DB_PATH)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.execute("PRAGMA foreign_keys = ON;")

# ============================
# CRIAÇÃO DAS TABELAS
# ============================

cur.executescript("""
CREATE TABLE IF NOT EXISTS Racas (
    Id INTEGER PRIMARY KEY,
    Nome TEXT NOT NULL,
    Passiva TEXT,
    Caracteristica TEXT
);

CREATE TABLE IF NOT EXISTS Magias (
    Id INTEGER PRIMARY KEY,
    Nome TEXT NOT NULL,
    Descricao TEXT
);

CREATE TABLE IF NOT EXISTS Habilidades (
    Id INTEGER PRIMARY KEY,
    Nome TEXT NOT NULL,
    Descricao TEXT
);

CREATE TABLE IF NOT EXISTS Classe (
    Id INTEGER PRIMARY KEY,
    Nome TEXT NOT NULL,
    Descricao TEXT,
    Habilidades_id INTEGER,
    Magias_id INTEGER,
    FOREIGN KEY (Habilidades_id) REFERENCES Habilidades(Id),
    FOREIGN KEY (Magias_id) REFERENCES Magias(Id)
);

CREATE TABLE IF NOT EXISTS Atributos (
    Id INTEGER PRIMARY KEY,
    Personagem_id INTEGER,
    Nome TEXT NOT NULL,
    Descricao TEXT,
    Quantidade INTEGER,
    FOREIGN KEY (Personagem_id) REFERENCES Personagens(Id)
);

CREATE TABLE IF NOT EXISTS Equipamentos (
    Id INTEGER PRIMARY KEY,
    Nome TEXT NOT NULL,
    Descricao TEXT,
    Atributos_id INTEGER,
    Bonus INTEGER,
    FOREIGN KEY (Atributos_id) REFERENCES Atributos(Id)
);

CREATE TABLE IF NOT EXISTS Personagens (
    Id INTEGER PRIMARY KEY,
    Nome TEXT NOT NULL,
    Historia TEXT,
    Tendencia TEXT,
    Raca_id INTEGER,
    Classe_id INTEGER,
    Equipamento_id INTEGER,
    Atributos_id INTEGER,
    FOREIGN KEY (Raca_id) REFERENCES Racas(Id),
    FOREIGN KEY (Classe_id) REFERENCES Classe(Id),
    FOREIGN KEY (Equipamento_id) REFERENCES Equipamentos(Id),
    FOREIGN KEY (Atributos_id) REFERENCES Atributos(Id)
);
""")

print("✅ Tabelas criadas com sucesso!")

# ============================
# INSERÇÃO DE DADOS
# ============================

# ---------- Raças ----------
racas = [
    ("Humano", "Versatilidade", "Adaptável a qualquer função"),
    ("Elfo", "Visão aguçada", "Graça e afinidade mágica"),
    ("Anão", "Resistência", "Força e resistência excepcionais")
]
cur.executemany("INSERT INTO Racas (Nome, Passiva, Caracteristica) VALUES (?, ?, ?)", racas)

# ---------- Magias ----------
magias = [
    ("Bola de Fogo", "Lança uma esfera flamejante"),
    ("Cura", "Restaura pontos de vida"),
    ("Rajada Arcana", "Explosão de energia mágica")
]
cur.executemany("INSERT INTO Magias (Nome, Descricao) VALUES (?, ?)", magias)

# ---------- Habilidades ----------
habilidades = [
    ("Ataque Poderoso", "Um golpe forte que causa dano extra"),
    ("Furtividade", "Permite se esconder facilmente"),
    ("Fúria", "Aumenta o dano temporariamente")
]
cur.executemany("INSERT INTO Habilidades (Nome, Descricao) VALUES (?, ?)", habilidades)

# IDs para relacionamentos
cur.execute("SELECT Id FROM Habilidades LIMIT 1")
habilidade_id = cur.fetchone()[0]

cur.execute("SELECT Id FROM Magias LIMIT 1")
magia_id = cur.fetchone()[0]

# ---------- Classes ----------
classes = [
    ("Guerreiro", "Especialista em combate corpo a corpo", habilidade_id, None),
    ("Mago", "Usuário de magias arcanas", None, magia_id),
    ("Ladino", "Mestre em furtividade e precisão", habilidade_id, None)
]
cur.executemany("INSERT INTO Classe (Nome, Descricao, Habilidades_id, Magias_id) VALUES (?, ?, ?, ?)", classes)

# ---------- Atributos ----------
atributos = [
    ("Força", "Capacidade física", 15),
    ("Inteligência", "Raciocínio e magia", 18),
    ("Destreza", "Agilidade e reflexos", 14)
]
cur.executemany(
    "INSERT INTO Atributos (Nome, Descricao, Quantidade) VALUES (?, ?, ?)",
    atributos
)

# pega um atributo para vincular ao personagem
cur.execute("SELECT Id FROM Atributos LIMIT 1")
atributo_id = cur.fetchone()[0]

# ---------- Equipamentos ----------
equipamentos = [
    ("Espada Longa", "Uma espada afiada", atributo_id, 3),
    ("Cajado Arcano", "Canaliza energia mística", atributo_id, 5),
    ("Adaga", "Arma leve e rápida", atributo_id, 2)
]
cur.executemany(
    "INSERT INTO Equipamentos (Nome, Descricao, Atributos_id, Bonus) VALUES (?, ?, ?, ?)",
    equipamentos
)

# ---------- Criar Personagem ----------
cur.execute("SELECT Id FROM Racas LIMIT 1")
raca_id = cur.fetchone()[0]

cur.execute("SELECT Id FROM Classe LIMIT 1")
classe_id = cur.fetchone()[0]

cur.execute("SELECT Id FROM Equipamentos LIMIT 1")
equip_id = cur.fetchone()[0]

cur.execute("SELECT Id FROM Atributos LIMIT 1")
atrib_id = cur.fetchone()[0]

cur.execute("""
INSERT INTO Personagens (Nome, Historia, Tendencia, Raca_id, Classe_id, Equipamento_id, Atributos_id)
VALUES (?, ?, ?, ?, ?, ?, ?)
""", ("Arthos", "Um guerreiro lendário", "Leal e Bom", raca_id, classe_id, equip_id, atrib_id))

# Atualiza relação circular
cur.execute("UPDATE Atributos SET Personagem_id = 1 WHERE Id = ?", (atrib_id,))

# Salvar alterações
conn.commit()
conn.close()

print("✅ Banco criado e preenchido com sucesso!")
