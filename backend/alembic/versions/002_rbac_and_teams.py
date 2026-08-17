"""002_rbac_and_teams

Revision ID: 002_rbac_and_teams
Revises: 001_initial_schema
Create Date: 2026-08-17 20:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '002_rbac_and_teams'
down_revision: Union[str, None] = '001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add is_active column
    op.add_column('users', sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')))

    # 2. Create project_members table
    op.create_table(
        'project_members',
        sa.Column('project_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('project_id', 'user_id')
    )

    # 3. Add Enum values for Postgres
    bind = op.get_bind()
    if bind.dialect.name == 'postgresql':
        bind.execute(sa.text("COMMIT"))
        bind.execute(sa.text("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'PROJECT_MANAGER'"))
        bind.execute(sa.text("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'DEVELOPER'"))
        bind.execute(sa.text("UPDATE users SET role = 'DEVELOPER' WHERE role = 'USER'"))


def downgrade() -> None:
    op.drop_table('project_members')
    op.drop_column('users', 'is_active')
