# 📚 Sistema de Gerenciamento de Livros - CRUD Python

Um sistema completo de gerenciamento de livros desenvolvido em Python, utilizando SQLite como banco de dados. O projeto implementa operações CRUD (Create, Read, Update, Delete) através de uma interface de linha de comando intuitiva.

## 🚀 Funcionalidades

- ✅ **Criar livros**: Adicione novos livros com nome, autor e preço
- 📋 **Listar livros**: Visualize todos os livros cadastrados em formato tabular
- ✏️ **Atualizar livros**: Modifique informações de livros existentes
- 🗑️ **Deletar livros**: Remova livros do sistema com confirmação de segurança
- 💾 **Persistência de dados**: Dados armazenados em banco SQLite
- 🛡️ **Tratamento de erros**: Sistema robusto com validação de dados

## 🏗️ Estrutura do Projeto

```
CRUD-Python/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Arquivo principal da aplicação
│   ├── Core/
│   │   ├── __init__.py
│   │   └── database.py         # Configuração e conexão com banco
│   ├── crud/
│   │   ├── __init__.py
│   │   └── livros.py          # Operações CRUD para livros
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py          # Modelos de dados
│   ├── routers/
│   │   ├── __init__.py
│   │   └── biblioteca.py      # Rotas organizadas (preparado para API)
│   └── schemas/
│       ├── __init__.py
│       └── schema.py          # Schemas para validação (preparado para API)
├── requirements.txt           # Dependências do projeto
├── README.md                 # Documentação do projeto
└── Livraria.db              # Banco de dados SQLite (criado automaticamente)
```

## 🔧 Tecnologias Utilizadas

- **Python 3.x**: Linguagem principal
- **SQLite3**: Banco de dados local
- **Arquitetura Modular**: Separação de responsabilidades

## 📋 Pré-requisitos

- Python 3.6 ou superior
- Sistema operacional: Windows, Linux ou macOS

## ⚡ Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/edumanzur/CRUD-Python.git
cd CRUD-Python
```

### 2. Execute a aplicação
```bash
cd app
python main.py
```

> **Nota**: O banco de dados SQLite será criado automaticamente na primeira execução.

## 🎯 Como Usar

### Menu Principal
Ao executar a aplicação, você verá o seguinte menu:

```
==================================================
        SISTEMA DE GERENCIAMENTO DE LIVROS
==================================================
1. Criar novo livro
2. Listar todos os livros
3. Atualizar livro
4. Deletar livro
5. Sair
==================================================
```

### Operações Disponíveis

#### 1. Criar Novo Livro
- Informe o nome do livro
- Informe o autor
- Informe o preço (formato decimal)
- Todos os campos são obrigatórios

#### 2. Listar Livros
- Exibe todos os livros cadastrados
- Mostra ID, Nome, Autor e Preço em formato tabular

#### 3. Atualizar Livro
- Lista os livros existentes
- Solicita o ID do livro a ser atualizado
- Permite modificar qualquer campo (deixe vazio para manter o valor atual)

#### 4. Deletar Livro
- Lista os livros existentes
- Solicita o ID do livro a ser deletado
- Requer confirmação antes da exclusão

## 📊 Banco de Dados

O sistema utiliza SQLite com a seguinte estrutura:

### Tabela: Livros
| Campo     | Tipo    | Descrição                |
|-----------|---------|--------------------------|
| ID_Livro  | INTEGER | Chave primária (auto-incremento) |
| Nome      | VARCHAR(30) | Nome do livro (obrigatório) |
| Autor     | VARCHAR(30) | Autor do livro |
| Preco     | REAL    | Preço do livro |

## 🛠️ Funcionalidades Técnicas

- **Conexão segura com banco**: Tratamento de exceções em operações de banco
- **Validação de entrada**: Verificação de tipos de dados e campos obrigatórios
- **Interface limpa**: Limpeza de tela entre operações
- **Confirmação de ações**: Confirmação antes de operações destrutivas
- **Tratamento de interrupções**: Captura de Ctrl+C para saída elegante

## 🔮 Roadmap Futuro

O projeto está preparado para evolução, com estrutura para:

- 🌐 **API RESTful**: Usando FastAPI (estrutura já preparada)
- 📱 **Interface Web**: Frontend para o sistema
- 🔐 **Autenticação**: Sistema de usuários
- 📈 **Relatórios**: Geração de relatórios e estatísticas
- 🔍 **Busca Avançada**: Filtros e pesquisa por campos

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Eduardo Manzur**
- GitHub: [@edumanzur](https://github.com/edumanzur)

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, por favor:
- Abra uma [issue](https://github.com/edumanzur/CRUD-Python/issues)
- Entre em contato através do GitHub

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!