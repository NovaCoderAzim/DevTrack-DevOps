from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.user import UserResponse


class ProjectBase(BaseModel):
    name: str = Field(..., max_length=100)
    key: str = Field(..., min_length=2, max_length=10, description="Short project prefix e.g. DT, API")
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    member_ids: Optional[List[int]] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    key: Optional[str] = None
    description: Optional[str] = None
    owner_id: Optional[int] = None
    member_ids: Optional[List[int]] = None


class ProjectMemberAdd(BaseModel):
    user_id: int


class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    owner: UserResponse
    created_at: datetime
    updated_at: datetime
    issue_count: Optional[int] = 0
    members: Optional[List[UserResponse]] = []

    model_config = ConfigDict(from_attributes=True)
