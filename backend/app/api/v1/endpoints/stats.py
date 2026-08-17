from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.db.database import get_db
from app.models.issue import Issue, IssueStatus, IssuePriority
from app.models.project import Project
from app.models.user import User, UserRole
from app.schemas.stats import DashboardStats
from app.schemas.issue import IssueResponse

router = APIRouter()


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Determine issue & project query scope
    if current_user.role == UserRole.ADMIN:
        issue_query = db.query(Issue)
        project_query = db.query(Project)
    elif current_user.role == UserRole.PROJECT_MANAGER:
        pm_project_ids = [p.id for p in current_user.owned_projects] + [p.id for p in current_user.projects]
        if pm_project_ids:
            issue_query = db.query(Issue).filter(Issue.project_id.in_(pm_project_ids))
            project_query = db.query(Project).filter(Project.id.in_(pm_project_ids))
        else:
            issue_query = db.query(Issue).filter(Issue.id == -1)
            project_query = db.query(Project).filter(Project.id == -1)
    else:  # DEVELOPER
        issue_query = db.query(Issue).filter(
            (Issue.assigned_to == current_user.id) | (Issue.created_by == current_user.id)
        )
        dev_project_ids = [p.id for p in current_user.projects]
        project_query = db.query(Project).filter(Project.id.in_(dev_project_ids)) if dev_project_ids else db.query(Project).filter(Project.id == -1)

    all_issues = issue_query.all()
    total_projects = project_query.count()
    total_employees = db.query(User).count() if current_user.role == UserRole.ADMIN else 0

    total_issues = len(all_issues)
    open_issues = sum(1 for i in all_issues if i.status == IssueStatus.TODO)
    in_progress_issues = sum(1 for i in all_issues if i.status == IssueStatus.IN_PROGRESS)
    resolved_issues = sum(1 for i in all_issues if i.status == IssueStatus.RESOLVED)
    closed_issues = sum(1 for i in all_issues if i.status == IssueStatus.CLOSED)

    high_priority_issues = sum(1 for i in all_issues if i.priority == IssuePriority.HIGH)
    critical_priority_issues = sum(1 for i in all_issues if i.priority == IssuePriority.CRITICAL)

    status_counts = {
        "TODO": open_issues,
        "IN_PROGRESS": in_progress_issues,
        "RESOLVED": resolved_issues,
        "CLOSED": closed_issues
    }

    priority_counts = {
        "LOW": sum(1 for i in all_issues if i.priority == IssuePriority.LOW),
        "MEDIUM": sum(1 for i in all_issues if i.priority == IssuePriority.MEDIUM),
        "HIGH": high_priority_issues,
        "CRITICAL": critical_priority_issues
    }

    # Employee workload
    employee_workload = {}
    if current_user.role in [UserRole.ADMIN, UserRole.PROJECT_MANAGER]:
        for i in all_issues:
            if i.assignee:
                name = i.assignee.name
                employee_workload[name] = employee_workload.get(name, 0) + 1

    # Project issue counts
    project_issue_counts = {}
    for i in all_issues:
        if i.project:
            pname = i.project.name
            project_issue_counts[pname] = project_issue_counts.get(pname, 0) + 1

    # Recent 5 issues
    recent_issues = issue_query.order_by(Issue.created_at.desc()).limit(5).all()

    return DashboardStats(
        total_projects=total_projects,
        total_employees=total_employees,
        total_issues=total_issues,
        open_issues=open_issues,
        in_progress_issues=in_progress_issues,
        resolved_issues=resolved_issues,
        closed_issues=closed_issues,
        high_priority_issues=high_priority_issues,
        critical_priority_issues=critical_priority_issues,
        status_counts=status_counts,
        priority_counts=priority_counts,
        employee_workload=employee_workload,
        project_issue_counts=project_issue_counts,
        recent_issues=[IssueResponse.model_validate(i) for i in recent_issues]
    )
