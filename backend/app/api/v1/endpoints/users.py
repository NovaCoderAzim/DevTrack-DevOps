import math
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.api import deps
from app.core.security import get_password_hash
from app.db.database import get_db
from app.models.user import User, UserRole
from app.models.project import Project, project_members
from app.schemas.user import UserCreate, UserUpdate, UserStatusUpdate, UserResponse
from app.schemas.common import PaginatedResponse

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[UserResponse])
def list_users(
    search: Optional[str] = Query(None, description="Search by name or email"),
    role: Optional[UserRole] = Query(None, description="Filter by role"),
    project_id: Optional[int] = Query(None, description="Filter by assigned project ID"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    query = db.query(User)

    # Scoping
    if current_user.role == UserRole.ADMIN:
        pass  # Admin sees all users
    elif current_user.role == UserRole.PROJECT_MANAGER:
        # PM sees users in their owned/assigned projects
        pm_project_ids = [p.id for p in current_user.owned_projects] + [p.id for p in current_user.projects]
        if pm_project_ids:
            query = query.join(User.projects).filter(Project.id.in_(pm_project_ids)).distinct()
        else:
            query = query.filter(User.id == current_user.id)
    else:  # DEVELOPER
        dev_project_ids = [p.id for p in current_user.projects]
        if dev_project_ids:
            query = query.join(User.projects).filter(Project.id.in_(dev_project_ids)).distinct()
        else:
            query = query.filter(User.id == current_user.id)

    # Filters
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(or_(User.name.ilike(search_fmt), User.email.ilike(search_fmt)))
    if role:
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    if project_id:
        query = query.join(User.projects).filter(Project.id == project_id)

    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 1
    offset = (page - 1) * limit

    users = query.order_by(User.id.asc()).offset(offset).limit(limit).all()

    # Populate project_count
    items = []
    for u in users:
        ur = UserResponse.model_validate(u)
        ur.project_count = len(u.projects) + len(u.owned_projects)
        items.append(ur)

    return PaginatedResponse[UserResponse](
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user)
):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email address already exists."
        )

    new_user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role,
        is_active=user_in.is_active
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if user_in.project_ids:
        projects = db.query(Project).filter(Project.id.in_(user_in.project_ids)).all()
        new_user.projects = projects
        db.commit()
        db.refresh(new_user)

    resp = UserResponse.model_validate(new_user)
    resp.project_count = len(new_user.projects) + len(new_user.owned_projects)
    return resp


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user)
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user_in.name is not None:
        target_user.name = user_in.name
    if user_in.email is not None and user_in.email != target_user.email:
        existing = db.query(User).filter(User.email == user_in.email).first()
        if existing:
            raise HTTPException(status_code=409, detail="Email already in use")
        target_user.email = user_in.email
    if user_in.password is not None and user_in.password.strip():
        target_user.password_hash = get_password_hash(user_in.password)
    if user_in.role is not None:
        target_user.role = user_in.role
    if user_in.is_active is not None:
        target_user.is_active = user_in.is_active
    if user_in.project_ids is not None:
        projects = db.query(Project).filter(Project.id.in_(user_in.project_ids)).all()
        target_user.projects = projects

    db.commit()
    db.refresh(target_user)

    resp = UserResponse.model_validate(target_user)
    resp.project_count = len(target_user.projects) + len(target_user.owned_projects)
    return resp


@router.put("/{user_id}/status", response_model=UserResponse)
def toggle_user_status(
    user_id: int,
    status_in: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user)
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    target_user.is_active = status_in.is_active
    db.commit()
    db.refresh(target_user)

    resp = UserResponse.model_validate(target_user)
    resp.project_count = len(target_user.projects) + len(target_user.owned_projects)
    return resp
