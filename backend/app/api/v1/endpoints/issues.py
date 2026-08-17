import math
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.api import deps
from app.db.database import get_db
from app.models.issue import Issue, IssueStatus, IssuePriority
from app.models.project import Project
from app.models.user import User, UserRole
from app.schemas.issue import IssueCreate, IssueUpdate, IssueResponse
from app.schemas.common import PaginatedResponse

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[IssueResponse])
def list_issues(
    project_id: Optional[int] = Query(None, description="Filter by project ID"),
    status: Optional[IssueStatus] = Query(None, description="Filter by issue status"),
    priority: Optional[IssuePriority] = Query(None, description="Filter by issue priority"),
    assignee_id: Optional[int] = Query(None, alias="assigned_to", description="Filter by assigned user ID"),
    search: Optional[str] = Query(None, description="Search term for title/description/issue_key"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    query = db.query(Issue)

    # Scoping
    if current_user.role == UserRole.ADMIN:
        pass  # Admin sees all issues
    elif current_user.role == UserRole.PROJECT_MANAGER:
        # PM sees issues belonging to projects they own or are members of
        pm_project_ids = [p.id for p in current_user.owned_projects] + [p.id for p in current_user.projects]
        if pm_project_ids:
            query = query.filter(Issue.project_id.in_(pm_project_ids))
        else:
            query = query.filter(Issue.id == -1)  # Empty query
    else:  # DEVELOPER: ONLY personal assigned issues or created by them
        query = query.filter(
            or_(Issue.assigned_to == current_user.id, Issue.created_by == current_user.id)
        )

    # Filters
    if project_id:
        query = query.filter(Issue.project_id == project_id)
    if status:
        query = query.filter(Issue.status == status)
    if priority:
        query = query.filter(Issue.priority == priority)
    if assignee_id:
        query = query.filter(Issue.assigned_to == assignee_id)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Issue.title.ilike(search_fmt),
                Issue.description.ilike(search_fmt),
                Issue.issue_key.ilike(search_fmt)
            )
        )

    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 1
    offset = (page - 1) * limit

    issues = query.order_by(Issue.created_at.desc()).offset(offset).limit(limit).all()

    return PaginatedResponse[IssueResponse](
        items=[IssueResponse.model_validate(i) for i in issues],
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )


@router.post("/", response_model=IssueResponse, status_code=status.HTTP_201_CREATED)
def create_issue(
    issue_in: IssueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    project = db.query(Project).filter(Project.id == issue_in.project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target project not found")

    if not deps.check_project_access(current_user, project):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this project")

    if issue_in.assigned_to:
        assignee = db.query(User).filter(User.id == issue_in.assigned_to).first()
        if not assignee:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assigned user not found")

    # Generate issue key e.g. DT-101
    total_project_issues = db.query(Issue).filter(Issue.project_id == project.id).count()
    issue_num = 101 + total_project_issues
    gen_issue_key = f"{project.key}-{issue_num}"

    while db.query(Issue).filter(Issue.issue_key == gen_issue_key).first():
        issue_num += 1
        gen_issue_key = f"{project.key}-{issue_num}"

    new_issue = Issue(
        issue_key=gen_issue_key,
        title=issue_in.title,
        description=issue_in.description,
        status=issue_in.status or IssueStatus.TODO,
        priority=issue_in.priority or IssuePriority.MEDIUM,
        project_id=issue_in.project_id,
        assigned_to=issue_in.assigned_to,
        created_by=current_user.id
    )
    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)
    return new_issue


@router.get("/{issue_id}", response_model=IssueResponse)
def get_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")

    if not deps.check_issue_access(current_user, issue):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this issue")

    return issue


@router.put("/{issue_id}", response_model=IssueResponse)
def update_issue(
    issue_id: int,
    issue_in: IssueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")

    if not deps.check_issue_access(current_user, issue):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to modify this issue")

    if issue_in.title is not None:
        issue.title = issue_in.title
    if issue_in.description is not None:
        issue.description = issue_in.description
    if issue_in.status is not None:
        issue.status = issue_in.status
    if issue_in.priority is not None:
        if current_user.role == UserRole.DEVELOPER and issue.assigned_to != current_user.id:
            raise HTTPException(status_code=403, detail="Developers can only edit priority on assigned issues")
        issue.priority = issue_in.priority
    if issue_in.assigned_to is not None:
        if current_user.role == UserRole.DEVELOPER:
            raise HTTPException(status_code=403, detail="Developers cannot reassign issues")
        if issue_in.assigned_to == 0:
            issue.assigned_to = None
        else:
            assignee = db.query(User).filter(User.id == issue_in.assigned_to).first()
            if not assignee:
                raise HTTPException(status_code=404, detail="Assigned user not found")
            issue.assigned_to = issue_in.assigned_to

    db.commit()
    db.refresh(issue)
    return issue


@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")

    is_author = issue.created_by == current_user.id
    is_proj_owner = issue.project.owner_id == current_user.id
    if current_user.role != UserRole.ADMIN and not is_proj_owner and not is_author:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied to delete this issue"
        )

    db.delete(issue)
    db.commit()
    return None
