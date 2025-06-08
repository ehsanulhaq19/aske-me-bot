"""Remove receiver id from message

Revision ID: 1d0740f2c3c8
Revises: 8eea5bcdc089
Create Date: 2025-06-08 19:38:29.202339
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '1d0740f2c3c8'
down_revision: Union[str, None] = '8eea5bcdc089'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # First drop the foreign key constraint
    op.drop_constraint('messages_ibfk_2', 'messages', type_='foreignkey')
    
    # Then drop the index
    op.drop_index(op.f('ix_messages_receiver_id'), table_name='messages')
    
    # Finally, drop the column
    op.drop_column('messages', 'receiver_id')


def downgrade() -> None:
    # Add the column back
    op.add_column('messages', sa.Column('receiver_id', mysql.INTEGER(), autoincrement=False, nullable=True))
    
    # Recreate the foreign key
    op.create_foreign_key('messages_ibfk_2', 'messages', 'users', ['receiver_id'], ['id'])
    
    # Recreate the index
    op.create_index(op.f('ix_messages_receiver_id'), 'messages', ['receiver_id'], unique=False)
