"""
Script para criar as tabelas iniciais no PostgreSQL (Supabase)
"""
import sys
import os

# Adicionar o diretório pai ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.main import Base, engine
from app.config import settings

def create_tables():
    """Cria todas as tabelas no banco de dados"""
    print("🗄️  Conectando ao banco PostgreSQL (Supabase)...")
    print(f"📍 Host: {settings.database_url.split('@')[1].split(':')[0] if '@' in settings.database_url else 'localhost'}")
    
    try:
        print("\n🔨 Criando tabelas...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas criadas com sucesso!")
        
        # Listar tabelas criadas
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print(f"\n📋 Total de tabelas: {len(tables)}")
        for table in sorted(tables):
            print(f"  ✓ {table}")
            
    except Exception as e:
        print(f"\n❌ Erro ao criar tabelas: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("="*70)
    print(" MIGRAÇÃO INICIAL - PostgreSQL (Supabase)")
    print("="*70)
    
    success = create_tables()
    
    print("\n" + "="*70)
    if success:
        print("✅ Migração concluída com sucesso!")
        print("\n💡 Próximos passos:")
        print("   1. Inicie o servidor: cd app && python -m uvicorn main:app --reload")
        print("   2. Acesse: http://localhost:8000/docs")
    else:
        print("❌ Migração falhou!")
        print("\n💡 Verifique:")
        print("   1. Credenciais do Supabase no arquivo .env")
        print("   2. Conexão com a internet")
        print("   3. Se o banco está acessível")
    print("="*70)
