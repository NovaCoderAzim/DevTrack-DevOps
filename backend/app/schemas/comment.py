from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse


class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    pass


class CommentResponse(CommentBase):
    id: int
    issue_id: int
    user_id: int
    created_at: datetime
    user: UserResponse

    model_config = ConfigDict(from_attributes=True)
