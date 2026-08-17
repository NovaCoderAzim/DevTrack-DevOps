from typing import List, Dict, Optional
from pydantic import BaseModel
from app.schemas.issue import IssueResponse


class DashboardStats(BaseModel):
    total_projects: int
    total_employees: Optional[int] = 0
    total_issues: int
    open_issues: int
    in_progress_issues: int
    resolved_issues: int
    closed_issues: int
    high_priority_issues: int
    critical_priority_issues: int
    status_counts: Dict[str, int]
    priority_counts: Dict[str, int]
    employee_workload: Optional[Dict[str, int]] = {}
    project_issue_counts: Optional[Dict[str, int]] = {}
    recent_issues: List[IssueResponse]
