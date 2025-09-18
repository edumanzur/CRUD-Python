import sqlite3 as con
import tkinter as tk
from tkinter import messagebox

# Função para criar as tabelas
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
    
    try:
        conexao = con.connect('Livraria.db')
        cursor = conexao.cursor()
        cursor.execute(sql_Livros)
        cursor.execute(sql_Estoque)
        conexao.commit()
    except con.DatabaseError as erro:
        print("Erro ao criar tabelas:", erro)
    finally:
        if conexao:
            conexao.close()

# Função para inserir livro no banco de dados
def inserir_livro(entry_nome_livro, entry_autor_livro, entry_preco_livro):
    nome = entry_nome_livro.get()
    autor = entry_autor_livro.get()
    preco = entry_preco_livro.get()

    if nome and autor and preco:
        try:
            preco = float(preco)  # Convertendo para tipo float
            conexao = con.connect('Livraria.db')
            cursor = conexao.cursor()

            cursor.execute("INSERT INTO Livros (Nome, Autor, Preco) VALUES (?, ?, ?)", (nome, autor, preco))
            conexao.commit()

            # Limpar os campos após a inserção
            entry_nome_livro.delete(0, tk.END)
            entry_autor_livro.delete(0, tk.END)
            entry_preco_livro.delete(0, tk.END)

            messagebox.showinfo("Sucesso", "Livro inserido com sucesso!")
        except con.DatabaseError as erro:
            messagebox.showerror("Erro", f"Erro ao inserir livro: {erro}")
        finally:
            if conexao:
                conexao.close()
    else:
        messagebox.showwarning("Aviso", "Por favor, preencha todos os campos!")

# Função para inserir estoque no banco de dados
def inserir_estoque(entry_nome_estoque, entry_autor_estoque, entry_quantidade_estoque):
    nome = entry_nome_estoque.get()
    autor = entry_autor_estoque.get()
    quantidade = entry_quantidade_estoque.get()

    if nome and autor and quantidade:
        try:
            quantidade = int(quantidade)  # Convertendo para tipo inteiro
            conexao = con.connect('Livraria.db')
            cursor = conexao.cursor()

            cursor.execute("INSERT INTO Estoque (Nome, Autor, Quantidade) VALUES (?, ?, ?)", (nome, autor, quantidade))
            conexao.commit()

            # Limpar os campos após a inserção
            entry_nome_estoque.delete(0, tk.END)
            entry_autor_estoque.delete(0, tk.END)
            entry_quantidade_estoque.delete(0, tk.END)

            messagebox.showinfo("Sucesso", "Estoque inserido com sucesso!")
        except con.DatabaseError as erro:
            messagebox.showerror("Erro", f"Erro ao inserir estoque: {erro}")
        finally:
            if conexao:
                conexao.close()
    else:
        messagebox.showwarning("Aviso", "Por favor, preencha todos os campos!")

# Função principal que cria a interface gráfica
def main():
    # Criar as tabelas no banco de dados
    criar_tabelas()

    # Criar a janela principal
    root = tk.Tk()
    root.title("Cadastro de Livros e Estoque")
    root.geometry("400x400")

    # Criar os widgets para inserir dados do livro
    label_nome_livro = tk.Label(root, text="Nome do Livro")
    label_nome_livro.pack()
    entry_nome_livro = tk.Entry(root)
    entry_nome_livro.pack()

    label_autor_livro = tk.Label(root, text="Autor do Livro")
    label_autor_livro.pack()
    entry_autor_livro = tk.Entry(root)
    entry_autor_livro.pack()

    label_preco_livro = tk.Label(root, text="Preço do Livro")
    label_preco_livro.pack()
    entry_preco_livro = tk.Entry(root)
    entry_preco_livro.pack()

    # Botão para inserir livro
    button_inserir_livro = tk.Button(
        root, 
        text="Inserir Livro", 
        command=lambda: inserir_livro(entry_nome_livro, entry_autor_livro, entry_preco_livro)
    )
    button_inserir_livro.pack()

    # Criar os widgets para inserir dados do estoque
    label_nome_estoque = tk.Label(root, text="Nome do Estoque")
    label_nome_estoque.pack()
    entry_nome_estoque = tk.Entry(root)
    entry_nome_estoque.pack()

    label_autor_estoque = tk.Label(root, text="Autor do Estoque")
    label_autor_estoque.pack()
    entry_autor_estoque = tk.Entry(root)
    entry_autor_estoque.pack()

    label_quantidade_estoque = tk.Label(root, text="Quantidade no Estoque")
    label_quantidade_estoque.pack()
    entry_quantidade_estoque = tk.Entry(root)
    entry_quantidade_estoque.pack()

    # Botão para inserir estoque
    button_inserir_estoque = tk.Button(
        root, 
        text="Inserir Estoque", 
        command=lambda: inserir_estoque(entry_nome_estoque, entry_autor_estoque, entry_quantidade_estoque)
    )
    button_inserir_estoque.pack()

    # Iniciar a interface gráfica
    root.mainloop()

if __name__ == "__main__":
    main()
