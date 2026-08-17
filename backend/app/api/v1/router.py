from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, projects, issues, comments, stats

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(issues.router, prefix="/issues", tags=["issues"])
api_router.include_router(comments.router, prefix="/issues", tags=["comments"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
