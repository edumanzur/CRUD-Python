# 🎮 RPG System - CRUD Completo

Sistema completo de gerenciamento de RPG com frontend React + TypeScript e backend FastAPI.

## 📋 Visão Geral

Este projeto é um sistema completo para gerenciar personagens, magias, equipamentos e outros elementos de RPG. Inclui:

- ⚔️ **Frontend Moderno**: React + TypeScript + Vite + TailwindCSS
- 🚀 **Backend Robusto**: FastAPI + SQLAlchemy + SQLite
- 🎨 **UI Temática**: Estilo pixel art RPG com Shadcn/ui
- 📦 **CRUD Completo**: Criar, Ler, Atualizar, Deletar

## 🏗️ Estrutura do Projeto

```
CRUD-Python/
├── app/                        # Backend (FastAPI)
│   ├── models/                 # Modelos SQLAlchemy
│   ├── schemas/                # Schemas Pydantic
│   ├── routers/                # Endpoints da API
│   ├── database.py             # Config do banco
│   ├── config.py               # Configurações
│   ├── main_new.py             # App principal (NOVO)
│   └── main.py                 # App antigo (compatibilidade)
├── frontend/                   # Frontend (React)
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── types/              # TypeScript types
│   │   ├── hooks/              # Custom hooks
│   │   └── lib/                # Utilitários
│   └── public/                 # Assets estáticos
├── run.py                      # Script de inicialização
└── requirements.txt            # Dependências Python
```

## 🚀 Começando

### Pré-requisitos

- Python 3.9+
- Node.js 18+ / Bun
- Git

### 🔧 Instalação

#### 1. Clone o repositório
```bash
git clone https://github.com/edumanzur/CRUD-Python.git
cd CRUD-Python
```

#### 2. Configure o Backend
```bash
# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor
python run.py

# OU manualmente:
python -m uvicorn app.main_new:app --reload --port 8000
```

O backend estará rodando em: http://localhost:8000
- Documentação: http://localhost:8000/docs
- API alternativa: http://localhost:8000/redoc

#### 3. Configure o Frontend
```bash
cd frontend

# Com npm
npm install
npm run dev

# OU com Bun (mais rápido)
bun install
bun run dev
```

O frontend estará rodando em: http://localhost:5173

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
2. **Spells** (`/spells`) - Gerenciar magias
3. **Equipment** (`/equipments`) - Gerenciar equipamentos

#### Funcionalidades:
- ✨ Criar itens personalizados
- ✏️ Editar itens existentes
- 🗑️ Deletar itens
- 🔍 Buscar e filtrar
- 💾 Persistência local (localStorage)
- 🎨 UI temática RPG

#### Tecnologias Frontend:
- ⚛️ React 18
- 📘 TypeScript
- ⚡ Vite
- 🎨 TailwindCSS
- 🎭 Shadcn/ui
- 🔄 React Router
- 📡 TanStack Query

## 🎨 Screenshots

> *Em breve*

## 🗂️ Banco de Dados

### Tabelas:
- **Personagens** - Heróis e aventureiros
- **Raças** - Humano, Elfo, Anão, etc.
- **Classes** - Guerreiro, Mago, Clérigo, etc.
- **Magias** - Feitiços e habilidades mágicas
- **Habilidades** - Técnicas especiais
- **Equipamentos** - Armas, armaduras, itens
- **Atributos** - Stats dos personagens

### Relacionamentos:
- Personagem → Raça (1:N)
- Personagem → Classe (1:N)
- Personagem → Equipamento (1:N)
- Personagem → Atributos (1:N)
- Classe → Magias (N:1)
- Classe → Habilidades (N:1)

## 📖 Documentação

- [Backend README](app/README.md) - Detalhes do backend
- [Migration Guide](MIGRATION_GUIDE.md) - Guia de migração
- [API Docs](http://localhost:8000/docs) - Documentação interativa

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto é de código aberto.

## 👤 Autor

**Eduardo Manzur**
- GitHub: [@edumanzur](https://github.com/edumanzur)

## 🙏 Agradecimentos

- FastAPI pela documentação excelente
- Shadcn/ui pelos componentes lindos
- Comunidade React por todo suporte

## 📞 Suporte

Se você tiver problemas ou dúvidas:
1. Verifique a [documentação](http://localhost:8000/docs)
2. Leia o [Migration Guide](MIGRATION_GUIDE.md)
3. Abra uma issue no GitHub

---

⭐ Se você gostou deste projeto, considere dar uma estrela!
