# 🚀 GUIA DE MIGRAÇÃO - SQLite para PostgreSQL (Supabase)

## 📋 Pré-requisitos

1. **Conta no Supabase** (https://supabase.com)
2. **Projeto criado no Supabase**
3. **Credenciais de conexão do banco**

---

## 🔧 PASSO 1: Instalar Dependências

```bash
pip install -r requirements_new.txt
```

Ou manualmente:
```bash
pip install psycopg2-binary==2.9.9
pip install alembic==1.13.1
```

---

## 🔐 PASSO 2: Configurar Credenciais

### Opção A: Arquivo `.env` (Recomendado)

O arquivo `.env` já foi criado com suas credenciais! Verifique se está correto:

```bash
DATABASE_URL=postgresql://postgres:%23Edu1221rpg@db.syaydpfjducbyqyhnbjv.supabase.co:5432/postgres
```

**⚠️ IMPORTANTE:** O caractere `#` na senha foi codificado como `%23`

### Opção B: Variáveis de Ambiente

Ou defina via terminal (Windows PowerShell):
```powershell
$env:DATABASE_URL="postgresql://postgres:%23Edu1221rpg@db.syaydpfjducbyqyhnbjv.supabase.co:5432/postgres"
```

---

## 🗄️ PASSO 3: Criar Tabelas no PostgreSQL

Execute o script de migração:

```bash
python migrate_to_postgres.py
```

**O que esse script faz:**
- ✅ Conecta ao Supabase
- ✅ Cria todas as tabelas (Campanhas, Personagens, Magias, Habilidades, etc.)
- ✅ Lista as tabelas criadas

**Saída esperada:**
```
======================================================================
 MIGRAÇÃO INICIAL - PostgreSQL (Supabase)
======================================================================
🗄️  Conectando ao banco PostgreSQL (Supabase)...
📍 Host: db.syaydpfjducbyqyhnbjv.supabase.co

🔨 Criando tabelas...
✅ Tabelas criadas com sucesso!

📋 Total de tabelas: 12
  ✓ Atributos
  ✓ Campanhas
  ✓ Classe
  ✓ Equipamentos
  ✓ Habilidades
  ✓ Magias
  ✓ Personagem_Equipamentos
  ✓ Personagem_Habilidades
  ✓ Personagem_Magias
  ✓ Personagens
  ✓ Racas
  ✓ alembic_version

======================================================================
✅ Migração concluída com sucesso!
======================================================================
```

---

## 📊 PASSO 4: Migrar Dados (Opcional)

Se você quiser migrar os dados do SQLite existente para o PostgreSQL:

### Opção A: Export/Import Manual

1. **Exportar do SQLite:**
```bash
python export_sqlite_data.py
```

2. **Importar para PostgreSQL:**
```bash
python import_to_postgres.py
```

### Opção B: Recriar dados manualmente via API

Use o frontend ou Postman para recriar:
- Campanhas
- Personagens
- Magias
- Habilidades
- Equipamentos

---

## ✅ PASSO 5: Testar Conexão

### 5.1 Iniciar o Backend

```bash
cd app
python -m uvicorn main:app --reload
```

**Saída esperada:**
```
🗄️  Banco de dados: PostgreSQL (Supabase)
🔍 Ambiente: development
✅ Pasta uploads montada: ...
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 5.2 Testar API

Abra: http://localhost:8000/docs

Teste os endpoints:
- `GET /campanhas/` - Deve retornar array vazio (ou suas campanhas)
- `GET /personagens/` - Deve retornar array vazio (ou seus personagens)
- `POST /campanhas/` - Crie uma campanha de teste

---

## 🎯 PASSO 6: Iniciar Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

Acesse: http://localhost:5173

---

## 🔍 VERIFICAÇÃO

### Banco de Dados

No Supabase Dashboard:
1. Vá em **Table Editor**
2. Verifique se as tabelas foram criadas
3. Veja os dados inseridos

### Logs

O backend agora mostra:
```
🗄️  Banco de dados: PostgreSQL (Supabase)
🔍 Ambiente: development
```

Em vez de:
```
🗄️  Caminho do banco de dados: C:\...\sistema_rpg.db
```

---

## 🐛 PROBLEMAS COMUNS

### Erro: "connection refused"
- ✅ Verifique se as credenciais estão corretas
- ✅ Verifique sua conexão com internet
- ✅ Verifique se o projeto Supabase está ativo

### Erro: "authentication failed"
- ✅ Verifique a senha (deve estar codificada: `#` → `%23`)
- ✅ Verifique o usuário (`postgres` é o padrão)

### Erro: "relation does not exist"
- ✅ Execute novamente: `python migrate_to_postgres.py`
- ✅ Verifique se as tabelas foram criadas no Supabase

### Erro: "no module named 'app'"
- ✅ Execute os comandos da pasta raiz do projeto
- ✅ Não execute de dentro da pasta `app/`

---

## 📝 DIFERENÇAS SQLite vs PostgreSQL

| Aspecto | SQLite | PostgreSQL |
|---------|--------|------------|
| **Conexão** | Arquivo local | Servidor remoto |
| **Concorrência** | Limitada | Excelente |
| **Escalabilidade** | Pequenas apps | Produção |
| **Pool de Conexões** | Não | Sim (configurado) |
| **Tipos de dados** | Dinâmicos | Rígidos |

---

## ✨ VANTAGENS DO POSTGRESQL

- ✅ **Acesso remoto** - Acesse de qualquer lugar
- ✅ **Backup automático** - Supabase faz backup
- ✅ **Escalabilidade** - Suporta mais usuários simultâneos
- ✅ **Recursos avançados** - Full-text search, JSON, etc.
- ✅ **Dashboard visual** - Supabase Table Editor
- ✅ **API automática** - Supabase gera APIs REST/GraphQL

---

## 🎓 PRÓXIMOS PASSOS

1. ✅ Migrar dados do SQLite (se necessário)
2. ✅ Configurar backup automático no Supabase
3. ✅ Adicionar autenticação (Supabase Auth)
4. ✅ Usar Alembic para migrações futuras:
   ```bash
   alembic revision --autogenerate -m "descrição"
   alembic upgrade head
   ```

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verifique os logs do backend
2. Verifique os logs do Supabase (Dashboard → Logs)
3. Teste a conexão com `python migrate_to_postgres.py`

---

**🎉 Parabéns! Sua aplicação agora usa PostgreSQL! 🎉**
