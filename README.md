# ⚔️ RPG System - Sistema de Gerenciamento de Personagens

<div align="center">

![RPG System Banner](https://img.icons8.com/color/256/crossed-swords.png)

**Sistema completo de gerenciamento de personagens de RPG com CRUD full-stack**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Sobre o Projeto

**RPG System** é uma aplicação web full-stack desenvolvida para gerenciar personagens de RPG (Role-Playing Game), incluindo todos os seus atributos, estatísticas, magias, habilidades e equipamentos. O sistema oferece uma interface intuitiva e temática inspirada em jogos clássicos de RPG.

### ✨ Características Principais

- 🎭 **Gerenciamento Completo de Personagens**: 12 status diferentes, classes, raças e tendências
- ⚔️ **Sistema de Classes**: 12 classes jogáveis (Guerreiro, Mago, Ladino, etc.)
- 🧝 **Sistema de Raças**: 9 raças disponíveis (Humano, Elfo, Anão, etc.)
- � **Estatísticas Detalhadas**: Vida, Força, Destreza, Constituição, Inteligência, Sabedoria, Mana, Carisma, Sorte, Reputação, CA, Deslocamento
- 🔮 **Magias e Habilidades**: Sistema completo de gerenciamento de magias e habilidades
- �️ **Equipamentos**: Gestão de armas, armaduras e acessórios
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

## �️ Stack Tecnológica

### Backend
```
FastAPI 0.104+       # Framework web assíncrono
SQLAlchemy 2.0+      # ORM para banco de dados
Pydantic 2.0+        # Validação de dados
Uvicorn              # Servidor ASGI
SQLite               # Banco de dados relacional
```

### Frontend
```
React 18.3+          # Biblioteca UI
TypeScript 5.5+      # Superset JavaScript tipado
Vite 5.4+            # Build tool e dev server
TailwindCSS 3.4+     # Framework CSS utility-first
Shadcn/ui            # Componentes UI reutilizáveis
Lucide React         # Ícones SVG
React Router 6+      # Roteamento
TanStack Query       # Gerenciamento de estado servidor
```

## 📊 Estatísticas do Personagem

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

## 🎯 Roadmap Futuro

- [ ] Sistema de combate
- [ ] Rolagem de dados (d20, d6, etc.)
- [ ] Gestão de campanhas
- [ ] Múltiplos jogadores/mestres
- [ ] Exportação de fichas em PDF
- [ ] Sistema de inventário expandido
- [ ] Cálculo automático de bônus por raça/classe
- [ ] Sistema de progressão e experiência
- [ ] Árvore de habilidades
- [ ] Modo escuro/claro
- [ ] Temas customizáveis

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## � Desenvolvedores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/edumanzur">
        <img src="https://github.com/edumanzur.png" width="100px;" alt="Eduardo Manzur"/><br />
        <sub><b>Eduardo Manzur</b></sub>
      </a><br />
      <sub>💻 Desenvolvedor Full-Stack</sub>
    </td>
    <td align="center">
      <a href="https://github.com/guilherme">
        <img src="https://github.com/guilherme.png" width="100px;" alt="Guilherme"/><br />
        <sub><b>Guilherme</b></sub>
      </a><br />
      <sub>💻 Desenvolvedor Full-Stack</sub>
    </td>
  </tr>
</table>

### 🙏 Agradecimentos

Desenvolvido com 💜 por **Eduardo Manzur** e **Guilherme**

Este projeto foi criado como parte de um trabalho acadêmico/estudo de desenvolvimento full-stack, demonstrando a integração completa entre:
- Backend robusto com FastAPI e SQLAlchemy
- Frontend moderno com React e TypeScript
- Banco de dados relacional com SQLite
- Design system componentizado com Shadcn/ui
- Arquitetura RESTful escalável

---

<div align="center">

**⚔️ Que suas aventuras sejam épicas! 🎲**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/edumanzur/CRUD-Python)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>
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
