import sqlite3 as con
from Core.database import conectar_banco, fechar_conexao, criar_tabelas

def criar_tabela():
    try:
        criar_tabelas()
    except Exception as erro:
        print(f"Erro ao criar tabelas: {erro}")

def criar_livro():
    try:
        nome = input("Digite o nome do livro: ").strip()
        autor = input("Digite o autor do livro: ").strip()
        preco_str = input("Digite o preço do livro: ").strip()
        
        if not nome or not autor or not preco_str:
            print("Erro: Todos os campos são obrigatórios!")
            return
        
        try:
            preco = float(preco_str)
        except ValueError:
            print("Erro: Preço deve ser um número válido!")
            return
        
        conexao = conectar_banco()
        cursor = conexao.cursor()
        
        cursor.execute("INSERT INTO Livros (Nome, Autor, Preco) VALUES (?, ?, ?)", (nome, autor, preco))
        conexao.commit()
        
        print(f"Livro '{nome}' criado com sucesso!")
        
    except con.DatabaseError as erro:
        print(f"Erro ao criar livro: {erro}")
    finally:
        fechar_conexao(conexao)

def listar_livros():
    conexao = None
    try:
        conexao = conectar_banco()
        cursor = conexao.cursor()
        
        cursor.execute("SELECT ID_Livro, Nome, Autor, Preco FROM Livros")
        livros = cursor.fetchall()
        
        if not livros:
            print("Nenhum livro cadastrado.")
            return
        
        print("\n--- Lista de Livros ---")
        print(f"{'ID':<4} {'Nome':<25} {'Autor':<25} {'Preço':<10}")
        print("-" * 70)
        
        for livro in livros:
            id_livro, nome, autor, preco = livro
            print(f"{id_livro:<4} {nome:<25} {autor:<25} R$ {preco:<8.2f}")
            
    except con.DatabaseError as erro:
        print(f"Erro ao listar livros: {erro}")
    finally:
        fechar_conexao(conexao)

def atualizar_livro():
    try:
        # Primeiro, listar os livros para o usuário ver os IDs
        listar_livros()
        
        id_str = input("\nDigite o ID do livro que deseja atualizar: ").strip()
        
        try:
            id_livro = int(id_str)
        except ValueError:
            print("Erro: ID deve ser um número válido!")
            return
        
        conexao = conectar_banco()
        cursor = conexao.cursor()
        
        # Verificar se o livro existe
        cursor.execute("SELECT Nome, Autor, Preco FROM Livros WHERE ID_Livro = ?", (id_livro,))
        livro_atual = cursor.fetchone()
        
        if not livro_atual:
            print("Livro não encontrado!")
            return
        
        nome_atual, autor_atual, preco_atual = livro_atual
        print(f"\nDados atuais: Nome: {nome_atual}, Autor: {autor_atual}, Preço: R$ {preco_atual:.2f}")
        
        # Solicitar novos dados
        novo_nome = input(f"Novo nome (atual: {nome_atual}): ").strip()
        novo_autor = input(f"Novo autor (atual: {autor_atual}): ").strip()
        novo_preco_str = input(f"Novo preço (atual: R$ {preco_atual:.2f}): ").strip()
        
        # Manter dados atuais se não foi informado novo valor
        nome_final = novo_nome if novo_nome else nome_atual
        autor_final = novo_autor if novo_autor else autor_atual
        
        if novo_preco_str:
            try:
                preco_final = float(novo_preco_str)
            except ValueError:
                print("Erro: Preço deve ser um número válido!")
                return
        else:
            preco_final = preco_atual
        
        # Atualizar no banco
        cursor.execute("UPDATE Livros SET Nome = ?, Autor = ?, Preco = ? WHERE ID_Livro = ?", 
                      (nome_final, autor_final, preco_final, id_livro))
        conexao.commit()
        
        print("Livro atualizado com sucesso!")
        
    except con.DatabaseError as erro:
        print(f"Erro ao atualizar livro: {erro}")
    finally:
        fechar_conexao(conexao)

def deletar_livro():
    try:
        # Primeiro, listar os livros para o usuário ver os IDs
        listar_livros()
        
        id_str = input("\nDigite o ID do livro que deseja deletar: ").strip()
        
        try:
            id_livro = int(id_str)
        except ValueError:
            print("Erro: ID deve ser um número válido!")
            return
        
        conexao = conectar_banco()
        cursor = conexao.cursor()
        
        # Verificar se o livro existe
        cursor.execute("SELECT Nome FROM Livros WHERE ID_Livro = ?", (id_livro,))
        livro = cursor.fetchone()
        
        if not livro:
            print("Livro não encontrado!")
            return
        
        nome_livro = livro[0]
        
        # Confirmar exclusão
        confirmacao = input(f"Tem certeza que deseja deletar o livro '{nome_livro}'? (s/n): ").strip().lower()
        
        if confirmacao == 's' or confirmacao == 'sim':
            cursor.execute("DELETE FROM Livros WHERE ID_Livro = ?", (id_livro,))
            conexao.commit()
            print(f"Livro '{nome_livro}' deletado com sucesso!")
        else:
            print("Operação cancelada.")
        
    except con.DatabaseError as erro:
        print(f"Erro ao deletar livro: {erro}")
    finally:
        fechar_conexao(conexao)

        