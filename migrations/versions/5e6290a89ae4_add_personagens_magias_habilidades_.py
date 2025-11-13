"""add personagens magias habilidades relationships

Revision ID: 5e6290a89ae4
Revises: ab3aecb4bb5a
Create Date: 2025-11-13 12:20:34.672717

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5e6290a89ae4'
down_revision: Union[str, Sequence[str], None] = 'ab3aecb4bb5a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Criar tabela de associação personagens_magias
    op.create_table(
        'personagens_magias',
        sa.Column('personagem_id', sa.Integer(), nullable=False),
        sa.Column('magia_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['personagem_id'], ['Personagens.Id'], ),
        sa.ForeignKeyConstraint(['magia_id'], ['Magias.Id'], ),
        sa.PrimaryKeyConstraint('personagem_id', 'magia_id')
    )
    
    # Criar tabela de associação personagens_habilidades
    op.create_table(
        'personagens_habilidades',
        sa.Column('personagem_id', sa.Integer(), nullable=False),
        sa.Column('habilidade_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['personagem_id'], ['Personagens.Id'], ),
        sa.ForeignKeyConstraint(['habilidade_id'], ['Habilidades.Id'], ),
        sa.PrimaryKeyConstraint('personagem_id', 'habilidade_id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('personagens_habilidades')
    op.drop_table('personagens_magias')
