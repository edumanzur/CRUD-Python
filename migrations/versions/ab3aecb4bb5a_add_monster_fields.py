"""add_monster_fields

Revision ID: ab3aecb4bb5a
Revises: add_modificador
Create Date: 2025-11-11 16:47:12.615651

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ab3aecb4bb5a'
down_revision: Union[str, Sequence[str], None] = 'add_modificador'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Adicionar campos específicos para monstros
    op.add_column('Personagens', sa.Column('Exp', sa.Integer(), nullable=True))
    op.add_column('Personagens', sa.Column('Imunidade', sa.Text(), nullable=True))
    op.add_column('Personagens', sa.Column('Resistencia', sa.Text(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remover campos específicos para monstros
    op.drop_column('Personagens', 'Resistencia')
    op.drop_column('Personagens', 'Imunidade')
    op.drop_column('Personagens', 'Exp')
