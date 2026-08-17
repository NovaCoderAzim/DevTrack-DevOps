from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db.database import get_db
from app.models.project import Project
from app.models.issue import Issue
from app.models.user import User, UserRole
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectMemberAdd
from app.schemas.user import UserResponse

router = APIRouter()


@router.get("/", response_model=List[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if current_user.role == UserRole.ADMIN:
        projects = db.query(Project).order_by(Project.created_at.desc()).all()
    elif current_user.role == UserRole.PROJECT_MANAGER:
        projects = db.query(Project).filter(
            (Project.owner_id == current_user.id) | (Project.members.any(User.id == current_user.id))
        ).distinct().order_by(Project.created_at.desc()).all()
    else:  # DEVELOPER
        projects = db.query(Project).filter(
            Project.members.any(User.id == current_user.id)
        ).distinct().order_by(Project.created_at.desc()).all()

    res = []
    for p in projects:
        pr = ProjectResponse.model_validate(p)
        pr.issue_count = db.query(Issue).filter(Issue.project_id == p.id).count()
        pr.members = [UserResponse.model_validate(m) for m in p.members]
        res.append(pr)
    return res


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_pm_or_admin_user)
):
    key_upper = project_in.key.strip().upper()
    existing = db.query(Project).filter(Project.key == key_upper).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Project key '{key_upper}' is already in use."
        )

    new_project = Project(
        name=project_in.name,
        key=key_upper,
        description=project_in.description,
        owner_id=current_user.id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    if project_in.member_ids:
        members = db.query(User).filter(User.id.in_(project_in.member_ids)).all()
        new_project.members = members
        db.commit()
        db.refresh(new_project)

    res = ProjectResponse.model_validate(new_project)
    res.issue_count = 0
    res.members = [UserResponse.model_validate(m) for m in new_project.members]
    return res


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if not deps.check_project_access(current_user, project):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this project"
        )

    res = ProjectResponse.model_validate(project)
    res.issue_count = db.query(Issue).filter(Issue.project_id == project.id).count()
    res.members = [UserResponse.model_validate(m) for m in project.members]
    return res


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if current_user.role != UserRole.ADMIN and project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this project"
        )

    if project_in.name is not None:
        project.name = project_in.name
    if project_in.description is not None:
        project.description = project_in.description
    if project_in.owner_id is not None and current_user.role == UserRole.ADMIN:
        project.owner_id = project_in.owner_id
    if project_in.key is not None:
        key_upper = project_in.key.strip().upper()
        if key_upper != project.key:
            existing = db.query(Project).filter(Project.key == key_upper).first()
            if existing:
                raise HTTPException(status_code=409, detail=f"Key '{key_upper}' is already in use.")
            project.key = key_upper

    if project_in.member_ids is not None:
        members = db.query(User).filter(User.id.in_(project_in.member_ids)).all()
        project.members = members

    db.commit()
    db.refresh(project)

    res = ProjectResponse.model_validate(project)
    res.issue_count = db.query(Issue).filter(Issue.project_id == project.id).count()
    res.members = [UserResponse.model_validate(m) for m in project.members]
    return res


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if current_user.role != UserRole.ADMIN and project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this project"
        )

    db.delete(project)
    db.commit()
    return None


# --- Project Team Members Endpoints ---

@router.get("/{project_id}/members", response_model=List[UserResponse])
def list_project_members(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if not deps.check_project_access(current_user, project):
        raise HTTPException(status_code=403, detail="Access denied")

    return [UserResponse.model_validate(m) for m in project.members]


@router.post("/{project_id}/members", response_model=List[UserResponse])
def add_project_member(
    project_id: int,
    member_in: ProjectMemberAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_pm_or_admin_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.role != UserRole.ADMIN and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied")

    target_user = db.query(User).filter(User.id == member_in.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    if target_user not in project.members:
        project.members.append(target_user)
        db.commit()
        db.refresh(project)

    return [UserResponse.model_validate(m) for m in project.members]


@router.delete("/{project_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_project_member(
    project_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_pm_or_admin_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.role != UserRole.ADMIN and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied")

    target_user = db.query(User).filter(User.id == user_id).first()
    if target_user and target_user in project.members:
        project.members.remove(target_user)
        db.commit()

    return None
