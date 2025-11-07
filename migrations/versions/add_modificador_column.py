"""add modificador column to equipamentos, magias, habilidades

Revision ID: add_modificador
Revises: 4ea1e5e38ab1
Create Date: 2025-11-07

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_modificador'
down_revision = '4ea1e5e38ab1'
branch_labels = None
depends_on = None


def upgrade():
    # Adicionar coluna Modificador em Equipamentos
    op.add_column('Equipamentos', sa.Column('Modificador', sa.String(), nullable=True))
    
    # Adicionar coluna Modificador em Magias
    op.add_column('Magias', sa.Column('Modificador', sa.String(), nullable=True))
    
    # Adicionar coluna Modificador em Habilidades
    op.add_column('Habilidades', sa.Column('Modificador', sa.String(), nullable=True))


def downgrade():
    # Remover colunas caso precise reverter
    op.drop_column('Habilidades', 'Modificador')
    op.drop_column('Magias', 'Modificador')
    op.drop_column('Equipamentos', 'Modificador')
