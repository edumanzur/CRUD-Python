import os
import sys
from crud.livros import criar_tabela, criar_livro, listar_livros, atualizar_livro, deletar_livro

def limpar_tela():
    """Limpa a tela do terminal"""
    os.system('cls' if os.name == 'nt' else 'clear')

def exibir_menu():
    """Exibe o menu principal do sistema"""
    print("\n" + "="*50)
    print("        SISTEMA DE GERENCIAMENTO DE LIVROS")
    print("="*50)
    print("1. Criar novo livro")
    print("2. Listar todos os livros")
    print("3. Atualizar livro")
    print("4. Deletar livro")
    print("5. Sair")
    print("="*50)

def obter_opcao():
    """Obtém a opção do usuário com validação"""
    try:
        opcao = input("Digite sua opção (1-5): ").strip()
        return opcao
    except KeyboardInterrupt:
        print("\n\nPrograma interrompido pelo usuário.")
        sys.exit(0)

def pausar():
    """Pausa a execução até o usuário pressionar Enter"""
    try:
        input("\nPressione Enter para continuar...")
    except KeyboardInterrupt:
        print("\n\nPrograma interrompido pelo usuário.")
        sys.exit(0)

def main():
    """Função principal do programa"""
    # Inicializar o banco de dados
    print("Inicializando sistema...")
    try:
        criar_tabela()
        print("Sistema inicializado com sucesso!")
    except Exception as e:
        print(f"Erro ao inicializar sistema: {e}")
        sys.exit(1)
    
    # Loop principal do programa
    while True:
        try:
            limpar_tela()
            exibir_menu()
            opcao = obter_opcao()
            
            if opcao == '1':
                limpar_tela()
                print("--- CRIAR NOVO LIVRO ---")
                criar_livro()
                pausar()
                
            elif opcao == '2':
                limpar_tela()
                print("--- LISTAR TODOS OS LIVROS ---")
                listar_livros()
                pausar()
                
            elif opcao == '3':
                limpar_tela()
                print("--- ATUALIZAR LIVRO ---")
                atualizar_livro()
                pausar()
                
            elif opcao == '4':
                limpar_tela()
                print("--- DELETAR LIVRO ---")
                deletar_livro()
                pausar()
                
            elif opcao == '5':
                limpar_tela()
                print("Obrigado por usar o Sistema de Gerenciamento de Livros!")
                print("Até logo!")
                break
                
            else:
                print("Opção inválida! Por favor, escolha uma opção entre 1 e 5.")
                pausar()
                
        except KeyboardInterrupt:
            print("\n\nPrograma interrompido pelo usuário.")
            print("Até logo!")
            break
        except Exception as e:
            print(f"Erro inesperado: {e}")
            pausar()

if __name__ == "__main__":
    main()
    