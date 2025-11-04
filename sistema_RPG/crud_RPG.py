import sqlite3
import os

# ============================================================
# CONFIGURAÇÃO DO BANCO
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "sistema_rpg.db")

def conectar():
    return sqlite3.connect(DB_PATH)


# ============================================================
# FUNÇÕES GENÉRICAS DE CRUD
# ============================================================

def listar_tabela(nome_tabela):
    conn = conectar()
    cur = conn.cursor()

    print(f"\n--- LISTANDO {nome_tabela.upper()} ---")

    try:
        cur.execute(f"SELECT * FROM {nome_tabela}")
        linhas = cur.fetchall()
        colunas = [d[0] for d in cur.description]

        if not linhas:
            print("Nenhum registro encontrado.\n")
        else:
            for linha in linhas:
                registro = {colunas[i]: linha[i] for i in range(len(colunas))}
                print(registro)

    except Exception as e:
        print("Erro:", e)

    conn.close()


def criar_registro(nome_tabela):
    conn = conectar()
    cur = conn.cursor()

    # Obter colunas
    cur.execute(f"PRAGMA table_info({nome_tabela})")
    colunas_info = cur.fetchall()

    campos = []
    valores = []

    print(f"\n--- INSERIR EM {nome_tabela.upper()} ---")

    for col in colunas_info:
        nome_col = col[1]
        pk = col[5]  # coluna PK AUTOINCREMENT

        if pk == 1:
            continue  # ignora PK

        valor = input(f"{nome_col}: ")
        campos.append(nome_col)
        valores.append(valor)

    sql = f"INSERT INTO {nome_tabela} ({','.join(campos)}) VALUES ({','.join(['?']*len(valores))})"
    cur.execute(sql, valores)

    conn.commit()
    conn.close()
    print("✅ Registro criado com sucesso!\n")


def atualizar_registro(nome_tabela):
    listar_tabela(nome_tabela)

    conn = conectar()
    cur = conn.cursor()

    id_alvo = input(f"ID do registro em {nome_tabela} para atualizar: ")

    # Obter colunas
    cur.execute(f"PRAGMA table_info({nome_tabela})")
    colunas_info = cur.fetchall()

    campos = []
    valores = []

    print(f"\n--- ATUALIZAR {nome_tabela.upper()} ---")

    for col in colunas_info:
        nome_col = col[1]
        pk = col[5]

        if pk == 1:
            continue  # ignora PK

        novo_valor = input(f"Novo valor para {nome_col} (enter para manter): ")
        if novo_valor.strip() != "":
            campos.append(f"{nome_col} = ?")
            valores.append(novo_valor)

    if campos:
        sql = f"UPDATE {nome_tabela} SET {', '.join(campos)} WHERE Id = ?"
        valores.append(id_alvo)
        cur.execute(sql, valores)
        conn.commit()
        print("✅ Registro atualizado!\n")
    else:
        print("Nenhuma alteração feita.")

    conn.close()


def deletar_registro(nome_tabela):
    listar_tabela(nome_tabela)

    conn = conectar()
    cur = conn.cursor()

    id_alvo = input(f"ID do registro em {nome_tabela} para deletar: ")

    try:
        cur.execute(f"DELETE FROM {nome_tabela} WHERE Id = ?", (id_alvo,))
        conn.commit()
        print("✅ Registro deletado!\n")
    except sqlite3.IntegrityError:
        print("❌ ERRO: esse registro é usado em outra tabela.")

    conn.close()


# ============================================================
# CRUD ESPECIAL PARA PERSONAGENS (RELACIONAMENTOS)
# ============================================================

def criar_personagem():
    conn = conectar()
    cur = conn.cursor()

    print("\n--- CRIANDO PERSONAGEM ---")

    nome = input("Nome: ")
    historia = input("História: ")
    tendencia = input("Tendência: ")

    def escolher(tabela):
        print(f"\n--- Escolha {tabela} ---")
        cur.execute(f"SELECT Id, Nome FROM {tabela}")
        for row in cur.fetchall():
            print(f"{row[0]} - {row[1]}")
        return int(input("ID: "))

    raca_id = escolher("Racas")
    classe_id = escolher("Classe")
    equipamento_id = escolher("Equipamentos")
    atributos_id = escolher("Atributos")

    cur.execute("""
        INSERT INTO Personagens (Nome, Historia, Tendencia,
                                 Raca_id, Classe_id, Equipamento_id, Atributos_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (nome, historia, tendencia, raca_id, classe_id, equipamento_id, atributos_id))

    conn.commit()
    conn.close()

    print("\n✅ Personagem criado com sucesso!\n")


# ============================================================
# MENU PARA TABELAS GENÉRICAS
# ============================================================

def menu_tabela(nome_tabela):
    while True:
        print(f"\n===== CRUD {nome_tabela.upper()} =====")
        print("1 - Listar")
        print("2 - Criar")
        print("3 - Atualizar")
        print("4 - Deletar")
        print("0 - Voltar")

        op = input("Escolha: ")

        if op == "1":
            listar_tabela(nome_tabela)
        elif op == "2":
            criar_registro(nome_tabela)
        elif op == "3":
            atualizar_registro(nome_tabela)
        elif op == "4":
            deletar_registro(nome_tabela)
        elif op == "0":
            break
        else:
            print("Opção inválida!")


# ============================================================
# MENU PRINCIPAL
# ============================================================

def menu_principal():
    while True:
        print("\n===== MENU PRINCIPAL RPG =====")
        print("1 - CRUD Raças")
        print("2 - CRUD Magias")
        print("3 - CRUD Habilidades")
        print("4 - CRUD Classe")
        print("5 - CRUD Atributos")
        print("6 - CRUD Equipamentos")
        print("7 - CRUD Personagens (com relacionamentos)")
        print("0 - Sair")

        opcao = input("Escolha: ")

        if opcao == "1":
            menu_tabela("Racas")
        elif opcao == "2":
            menu_tabela("Magias")
        elif opcao == "3":
            menu_tabela("Habilidades")
        elif opcao == "4":
            menu_tabela("Classe")
        elif opcao == "5":
            menu_tabela("Atributos")
        elif opcao == "6":
            menu_tabela("Equipamentos")
        elif opcao == "7":
            submenu_personagens()
        elif opcao == "0":
            print("Saindo...")
            break
        else:
            print("Opção inválida!")


def submenu_personagens():
    while True:
        print("\n===== CRUD PERSONAGENS =====")
        print("1 - Listar")
        print("2 - Criar (com relacionamentos!)")
        print("3 - Atualizar")
        print("4 - Deletar")
        print("0 - Voltar")

        op = input("Escolha: ")

        if op == "1":
            listar_tabela("Personagens")
        elif op == "2":
            criar_personagem()
        elif op == "3":
            atualizar_registro("Personagens")
        elif op == "4":
            deletar_registro("Personagens")
        elif op == "0":
            break
        else:
            print("Opção inválida!")



# Executa menu principal
if __name__ == "__main__":
    menu_principal()
