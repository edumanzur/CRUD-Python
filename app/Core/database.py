import sqlite3 as con

# Configuração do banco de dados
DATABASE_NAME = 'Livraria.db'

def conectar_banco():
    try:
        conexao = con.connect(DATABASE_NAME)
        return conexao
    except con.DatabaseError as erro:
        print(f"Erro ao conectar com o banco de dados: {erro}")
        raise

def criar_tabelas():
    sql_Livros = '''
        CREATE TABLE IF NOT EXISTS Livros(
        ID_Livro INTEGER PRIMARY KEY,
        Nome VARCHAR(30) NOT NULL,
        Autor VARCHAR(30),
        Preco REAL);
    '''

    sql_Estoque = '''
        CREATE TABLE IF NOT EXISTS Estoque(
        ID_Estoque INTEGER PRIMARY KEY,
        Nome VARCHAR(30) NOT NULL,
        Autor VARCHAR(30),
        Quantidade INTEGER);
    '''
    
    conexao = None
    try:
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute(sql_Livros)
        cursor.execute(sql_Estoque)
        conexao.commit()
        print("Tabelas criadas com sucesso!")
    except con.DatabaseError as erro:
        print(f"Erro ao criar tabelas: {erro}")
        raise
    finally:
        if conexao:
            conexao.close()

def fechar_conexao(conexao):
    if conexao:
        conexao.close()