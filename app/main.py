# Código main

# Comandos CRUD da pasta crud/livros.py
from crud import criar_tabela, criar_livro, listar_livros, atualizar_livro, deletar_livro 

# Criar a tabela de livros
criar_tabela()

# variável para controle do loop
continuar = True

# Loop principal do menu
while continuar:

    # Exibir o menu
    print("\n--- Menu Principal ---")
    print("1. Criar Livro")
    print("2. Listar Livros")
    print("3. Atualizar Livro")
    print("4. Deletar Livro")
    print("0. Sair")
    opcao = input("Escolha uma opção: ")

    # Executar a opção escolhida
    if opcao == "1":
        # Criar um livro
        criar_livro()

    elif opcao == "2":
        # Listar os livros
        listar_livros()

    elif opcao == "3":
        # Atualizar um livro
        atualizar_livro()

    elif opcao == "4":
        # Deletar um livro
        deletar_livro()

    elif opcao == "0":
        # Terminar loop
        print("Saindo do programa...")
        continuar = False

    else:
        # Opção inválida
        print("Opção inválida. Tente novamente.")
        