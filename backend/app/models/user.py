import enum
from datetime import datetime
from typing import List, TYPE_CHECKING
from sqlalchemy import String, DateTime, Enum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.issue import Issue
    from app.models.comment import Comment


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    PROJECT_MANAGER = "PROJECT_MANAGER"
    DEVELOPER = "DEVELOPER"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, native_enum=True, values_callable=lambda obj: [e.value for e in obj]),
        default=UserRole.DEVELOPER,
        nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    owned_projects: Mapped[List["Project"]] = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    projects: Mapped[List["Project"]] = relationship("Project", secondary="project_members", back_populates="members")
    created_issues: Mapped[List["Issue"]] = relationship("Issue", foreign_keys="[Issue.created_by]", back_populates="creator", cascade="all, delete-orphan")
    assigned_issues: Mapped[List["Issue"]] = relationship("Issue", foreign_keys="[Issue.assigned_to]", back_populates="assignee")
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
