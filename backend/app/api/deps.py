from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import decode_access_token
from app.db.database import get_db
from app.models.user import User, UserRole
from app.models.project import Project
from app.models.issue import Issue

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user_id_str = decode_access_token(token)
    if user_id_str is None:
        raise credentials_exception
    
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account. Please contact an administrator."
        )
        
    return user


def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required"
        )
    return current_user


def get_current_pm_or_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role not in [UserRole.ADMIN, UserRole.PROJECT_MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Project Manager or Administrative privileges required"
        )
    return current_user


def check_project_access(user: User, project: Project) -> bool:
    if user.role == UserRole.ADMIN:
        return True
    if user.role == UserRole.PROJECT_MANAGER:
        if project.owner_id == user.id or any(m.id == user.id for m in project.members):
            return True
        return False
    # DEVELOPER
    return any(m.id == user.id for m in project.members)


def check_issue_access(user: User, issue: Issue) -> bool:
    if user.role == UserRole.ADMIN:
        return True
    if user.role == UserRole.PROJECT_MANAGER:
        # Accessible if project owner or project team member
        return issue.project.owner_id == user.id or any(m.id == user.id for m in issue.project.members)
    # DEVELOPER: ONLY assigned issues (or created by them)
    return issue.assigned_to == user.id or issue.created_by == user.id
