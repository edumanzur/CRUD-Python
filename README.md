<div align="center">

# ⚔️ RPG System ⚔️
### Sistema de Gerenciamento de Personagens de RPG

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ⚔️  🛡️  🎲  Sistema CRUD Full-Stack  🎲  🛡️  ⚔️      ║
║                                                           ║
║     FastAPI  •  React  •  TypeScript  •  SQLite         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

📄 **[Ver informações completas do projeto em formato TXT](INFORMACOES_PROJETO.txt)**

</div>

---

## 📋 Sobre o Projeto

**RPG System** é uma aplicação web full-stack desenvolvida para gerenciar personagens de RPG (Role-Playing Game), incluindo todos os seus atributos, estatísticas, magias, habilidades e equipamentos. O sistema oferece uma interface intuitiva e temática inspirada em jogos clássicos de RPG.

### ✨ Características Principais

- 🎭 **Gerenciamento Completo de Personagens**: 12 status diferentes, classes, raças e tendências
- ⚔️ **Sistema de Classes**: 12 classes jogáveis (Guerreiro, Mago, Ladino, etc.)
- 🧝 **Sistema de Raças**: 9 raças disponíveis (Humano, Elfo, Anão, etc.)
- 📊 **Estatísticas Detalhadas**: Vida, Força, Destreza, Constituição, Inteligência, Sabedoria, Mana, Carisma, Sorte, Reputação, CA, Deslocamento
- 🔮 **Magias e Habilidades**: Sistema completo de gerenciamento de magias e habilidades
- 🛡️ **Equipamentos**: Gestão de armas, armaduras e acessórios
- ⚖️ **Sistema de Tendências**: 9 alinhamentos baseados em D&D
- 🎨 **Interface Temática**: Design inspirado em RPGs clássicos com fonte medieval

## 🏗️ Estrutura do Projeto

```
CRUD-Python/
├── app/                        # Backend (FastAPI)
│   ├── models/                 # Modelos SQLAlchemy
│   ├── schemas/                # Schemas Pydantic
│   ├── routers/                # Endpoints da API
│   ├── database.py             # Config do banco
│   ├── config.py               # Configurações
│   └── main.py                 # App principal
├── frontend/                   # Frontend (React)
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── types/              # TypeScript types
│   │   ├── services/           # API services
│   │   └── lib/                # Utilitários
│   └── public/                 # Assets estáticos
├── sistema_rpg.db              # Banco de dados SQLite
├── run.py                      # Script de inicialização
└── requirements.txt            # Dependências Python
```

## 🚀 Instalação e Execução

### Pré-requisitos

- Python 3.9+
- Node.js 18+ / Bun
- Git

### � Instalação

#### 1. Clone o repositório
```bash
git clone https://github.com/edumanzur/CRUD-Python.git
cd CRUD-Python
```

#### 2. Instale as dependências do Backend
```bash
pip install -r requirements.txt
```

#### 3. Instale as dependências do Frontend
```bash
cd frontend
npm install
# OU com Bun (mais rápido)
bun install
```

### ▶️ Executando o Projeto

#### Opção 1: Usando o script run.py (Recomendado)
```bash
# Terminal 1 - Na raiz do projeto
python run.py
```
Este script irá iniciar o backend FastAPI em http://localhost:8000

```bash
# Terminal 2 - Inicie o frontend
cd frontend
npm run dev    # OU: bun run dev
```

#### Opção 2: Executar manualmente

```bash
# Terminal 1 - Backend
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev    # OU: bun run dev
```

### 🌐 Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Documentação Swagger**: http://localhost:8000/docs
- **Documentação ReDoc**: http://localhost:8000/redoc

## 📚 Recursos

### Backend (FastAPI)

#### Endpoints Disponíveis:

- **Personagens**: `/personagens/`
  - GET, POST, PUT, DELETE
  - Buscar por nome: `/personagens/search?nome=`
  
- **Raças**: `/racas/`
- **Magias**: `/magias/`
- **Habilidades**: `/habilidades/`
- **Classes**: `/classes/`
- **Equipamentos**: `/equipamentos/`
- **Atributos**: `/atributos/`

Todos os recursos têm CRUD completo e busca por nome.

#### Tecnologias Backend:
- ⚡ FastAPI - Framework web moderno
- 🗄️ SQLAlchemy - ORM
- ✅ Pydantic - Validação de dados
- 💾 SQLite - Banco de dados
- 🔄 Uvicorn - Servidor ASGI

### Frontend (React + TypeScript)

#### Páginas:
1. **Characters** (`/`) - Gerenciar personagens
2. **Spells** (`/spells`) - Gerenciar magias e habilidades
3. **Equipment** (`/equipments`) - Gerenciar equipamentos

#### Funcionalidades:
- ✨ Criar personagens personalizados
- ✏️ Editar personagens existentes
- 🗑️ Deletar personagens
- 🔍 Buscar e filtrar
- 📊 Visualização de estatísticas
- 🎨 UI temática RPG

#### Tecnologias Frontend:
- ⚛️ React 18
- 📘 TypeScript
- ⚡ Vite
- 🎨 TailwindCSS
- 🎭 Shadcn/ui
- 🔄 React Router
- 🎨 Lucide React (ícones)

## 🗂️ Banco de Dados

### Tabelas:
- **Personagens** - Heróis e aventureiros (22 colunas)
- **Raças** - Humano, Elfo, Anão, etc.
- **Classes** - Guerreiro, Mago, Clérigo, etc.
- **Magias** - Feitiços e habilidades mágicas
- **Habilidades** - Técnicas especiais
- **Equipamentos** - Armas, armaduras, itens
- **Atributos** - Stats dos personagens

### Relacionamentos:
- Personagem → Raça (N:1)
- Personagem → Classe (N:1)
- Personagem → Magias (N:N)
- Personagem → Habilidades (N:N)
- Personagem → Equipamentos (N:N)

##  Estatísticas do Personagem

O sistema implementa **12 atributos** completos para cada personagem:

| Atributo | Descrição | Ícone | Valor Padrão |
|----------|-----------|-------|--------------|
| 💚 Vida | Pontos de vida do personagem | ❤️ Heart | 100 |
| ⚔️ Força | Poder físico e dano corpo a corpo | 🗡️ Sword | 10 |
| 🎯 Destreza | Agilidade e precisão | 🎯 Target | 10 |
| 🛡️ Constituição | Resistência e durabilidade | 🛡️ Shield | 10 |
| 🧠 Inteligência | Capacidade mental e mágica | 🧠 Brain | 10 |
| ✨ Sabedoria | Percepção e intuição | ✨ Sparkles | 10 |
| 💧 Mana | Energia mágica | 💧 Droplets | 100 |
| 👥 Carisma | Influência social | 👥 Users | 10 |
| 🍀 Sorte | Chance de eventos favoráveis | 🍀 Clover | 10 |
| 🏆 Reputação | Fama e renome | 🏆 Trophy | 0 |
| 🛡️ CA | Classe de Armadura (defesa) | 🛡️ ShieldCheck | 10 |
| 💨 Deslocamento | Velocidade de movimento | 💨 Wind | 30 |

## 🎭 Classes Disponíveis

```
1. Guerreiro    - Especialista em combate corpo a corpo
2. Mago         - Mestre das artes arcanas
3. Ladino       - Furtivo e ágil
4. Ranger       - Explorador e arqueiro
5. Feiticeiro   - Magia inata e poderosa
6. Druida       - Guardião da natureza
7. Clérigo      - Sacerdote divino
8. Bardo        - Músico e contador de histórias
9. Paladino     - Guerreiro sagrado
10. Monge       - Mestre das artes marciais
11. Bárbaro     - Guerreiro selvagem
12. Bruxo       - Pactário com entidades poderosas
```

## 🧝 Raças Disponíveis

```
1. Humano       - Versátil e adaptável
2. Elfo         - Gracioso e sábio
3. Anão         - Resistente e trabalhador
4. Halfling     - Pequeno e ágil
5. Draconato    - Descendente de dragões
6. Gnomo        - Inventivo e curioso
7. Meio-Elfo    - Híbrido versátil
8. Meio-Orc     - Força bruta
9. Tiferino     - Sangue infernal
```

## ⚖️ Sistema de Tendências

Baseado no sistema de alinhamento de D&D:

| Tendência | Descrição |
|-----------|-----------|
| Leal Bom | Honrado e compassivo |
| Neutro Bom | Benevolente e flexível |
| Caótico Bom | Livre e bondoso |
| Leal Neutro | Disciplinado e justo |
| Neutro | Equilibrado e imparcial |
| Caótico Neutro | Imprevisível e livre |
| Leal Mal | Tirânico e organizado |
| Neutro Mal | Egoísta e cruel |
| Caótico Mal | Destrutivo e sádico |

## 📖 Documentação da API

Após iniciar o servidor backend, acesse a documentação interativa:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

Desenvolvido com 💜 por:
- **[Eduardo Manzur](https://github.com/edumanzur)** - [@edumanzur](https://github.com/edumanzur)
- **[Guilherme Viera](https://github.com/GUILHERME-LA)** - [@GUILHERME-LA](https://github.com/GUILHERME-LA)

Este projeto foi criado como parte de um trabalho acadêmico de desenvolvimento full-stack, demonstrando a integração completa entre backend FastAPI, frontend React/TypeScript e banco de dados SQLite.

---

<div align="center">

**⚔️ Que suas aventuras sejam épicas! 🎲**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/edumanzur/CRUD-Python)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>
