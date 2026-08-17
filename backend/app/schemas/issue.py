from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.models.issue import IssueStatus, IssuePriority
from app.schemas.user import UserResponse


class IssueBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[IssueStatus] = IssueStatus.TODO
    priority: Optional[IssuePriority] = IssuePriority.MEDIUM
    project_id: int
    assigned_to: Optional[int] = None


class IssueCreate(IssueBase):
    pass


class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[IssueStatus] = None
    priority: Optional[IssuePriority] = None
    project_id: Optional[int] = None
    assigned_to: Optional[int] = None


class ProjectMinimal(BaseModel):
    id: int
    name: str
    key: str

    model_config = ConfigDict(from_attributes=True)


class IssueResponse(BaseModel):
    id: int
    issue_key: str
    title: str
    description: Optional[str] = None
    status: IssueStatus
    priority: IssuePriority
    project_id: int
    assigned_to: Optional[int] = None
    created_by: int
    created_at: datetime
    updated_at: datetime
    
    creator: UserResponse
    assignee: Optional[UserResponse] = None
    project: Optional[ProjectMinimal] = None

    model_config = ConfigDict(from_attributes=True)
