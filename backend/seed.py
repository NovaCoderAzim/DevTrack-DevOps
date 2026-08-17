import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal, engine
from app.db.base import Base
from app.models.user import User, UserRole
from app.models.project import Project
from app.models.issue import Issue, IssueStatus, IssuePriority
from app.models.comment import Comment
from app.core.security import get_password_hash


def seed_database():
    db = SessionLocal()
    try:
        print("[+] Seeding DevTrack database with 10 employees and realistic projects...")

        # 1. Define 10 Employees
        employees_data = [
            {"name": "System Admin", "email": "admin@devtrack.io", "password": "admin123", "role": UserRole.ADMIN, "is_active": True},
            {"name": "Alex Johnson", "email": "pm.alex@devtrack.io", "password": "pm123", "role": UserRole.PROJECT_MANAGER, "is_active": True},
            {"name": "Maria Garcia", "email": "pm.maria@devtrack.io", "password": "pm123", "role": UserRole.PROJECT_MANAGER, "is_active": True},
            {"name": "Sarah Connor", "email": "dev.sarah@devtrack.io", "password": "dev123", "role": UserRole.DEVELOPER, "is_active": True},
            {"name": "Rahul Kumar", "email": "dev.rahul@devtrack.io", "password": "dev123", "role": UserRole.DEVELOPER, "is_active": True},
            {"name": "David Chen", "email": "dev.chen@devtrack.io", "password": "dev123", "role": UserRole.DEVELOPER, "is_active": True},
            {"name": "Emily Watson", "email": "dev.emily@devtrack.io", "password": "dev123", "role": UserRole.DEVELOPER, "is_active": True},
            {"name": "Vikram Patel", "email": "dev.vikram@devtrack.io", "password": "dev123", "role": UserRole.DEVELOPER, "is_active": True},
            {"name": "Lisa Simpson", "email": "dev.lisa@devtrack.io", "password": "dev123", "role": UserRole.DEVELOPER, "is_active": True},
            {"name": "Kevin Vance", "email": "dev.kevin@devtrack.io", "password": "dev123", "role": UserRole.DEVELOPER, "is_active": False},
        ]

        users_map = {}
        for ed in employees_data:
            user = db.query(User).filter(User.email == ed["email"]).first()
            if not user:
                user = User(
                    name=ed["name"],
                    email=ed["email"],
                    password_hash=get_password_hash(ed["password"]),
                    role=ed["role"],
                    is_active=ed["is_active"]
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                print(f"  [OK] Created User: {user.name} ({user.email}) - {user.role.value}")
            else:
                user.role = ed["role"]
                user.is_active = ed["is_active"]
                db.commit()
                db.refresh(user)
                print(f"  [INFO] Updated User: {user.name} ({user.email})")
            users_map[ed["email"]] = user

        admin = users_map["admin@devtrack.io"]
        pm_alex = users_map["pm.alex@devtrack.io"]
        pm_maria = users_map["pm.maria@devtrack.io"]
        dev_sarah = users_map["dev.sarah@devtrack.io"]
        dev_rahul = users_map["dev.rahul@devtrack.io"]
        dev_chen = users_map["dev.chen@devtrack.io"]
        dev_emily = users_map["dev.emily@devtrack.io"]
        dev_vikram = users_map["dev.vikram@devtrack.io"]
        dev_lisa = users_map["dev.lisa@devtrack.io"]
        dev_kevin = users_map["dev.kevin@devtrack.io"]

        # 2. Projects & Team Assignments
        projects_data = [
            {
                "key": "DT",
                "name": "DevTrack SaaS Platform",
                "description": "Core web application and task management platform.",
                "owner": pm_alex,
                "members": [pm_alex, dev_sarah, dev_rahul, dev_chen, dev_kevin]
            },
            {
                "key": "INFRA",
                "name": "Cloud Infrastructure",
                "description": "Database indexing, backend performance, and containerization.",
                "owner": pm_maria,
                "members": [pm_maria, dev_emily, dev_vikram, dev_sarah]
            },
            {
                "key": "MOB",
                "name": "Mobile Companion App",
                "description": "Cross-platform mobile application for DevTrack notifications and quick task updates.",
                "owner": pm_alex,
                "members": [pm_alex, dev_lisa, dev_rahul, dev_chen]
            }
        ]

        proj_map = {}
        for pd in projects_data:
            proj = db.query(Project).filter(Project.key == pd["key"]).first()
            if not proj:
                proj = Project(
                    name=pd["name"],
                    key=pd["key"],
                    description=pd["description"],
                    owner_id=pd["owner"].id
                )
                db.add(proj)
                db.commit()
                db.refresh(proj)
                print(f"  [OK] Created Project: {proj.name} [{proj.key}]")
            proj.members = pd["members"]
            db.commit()
            db.refresh(proj)
            proj_map[pd["key"]] = proj

        dt_proj = proj_map["DT"]
        infra_proj = proj_map["INFRA"]
        mob_proj = proj_map["MOB"]

        # 3. 20+ Realistic Issues across all Developers & Projects
        demo_issues = [
            # DT Project
            {"key": "DT-101", "title": "Implement JWT Bearer Authentication & Role Middleware", "desc": "Secure endpoints with JWT tokens and 3-tier role authorization.", "status": IssueStatus.RESOLVED, "priority": IssuePriority.CRITICAL, "project": dt_proj, "creator": pm_alex, "assignee": dev_sarah},
            {"key": "DT-102", "title": "Build Dual List and Kanban Board Workspace", "desc": "Interactive React UI with status filter tabs and drag-and-drop workflow.", "status": IssueStatus.IN_PROGRESS, "priority": IssuePriority.HIGH, "project": dt_proj, "creator": pm_alex, "assignee": dev_sarah},
            {"key": "DT-103", "title": "Server-side Issue Search and Multi-parameter Filters", "desc": "Add backend query params for search, project, status, priority, and assignee.", "status": IssueStatus.RESOLVED, "priority": IssuePriority.HIGH, "project": dt_proj, "creator": pm_alex, "assignee": dev_rahul},
            {"key": "DT-104", "title": "Design Role-aware Sidebar and Navigation Bar", "desc": "Dynamic sidebar options based on ADMIN, PROJECT_MANAGER, and DEVELOPER roles.", "status": IssueStatus.IN_PROGRESS, "priority": IssuePriority.MEDIUM, "project": dt_proj, "creator": pm_alex, "assignee": dev_chen},
            {"key": "DT-105", "title": "Employee Management Interface for Administrators", "desc": "Employee listing table, status toggling, and project assignments modal.", "status": IssueStatus.TODO, "priority": IssuePriority.HIGH, "project": dt_proj, "creator": pm_alex, "assignee": dev_sarah},
            {"key": "DT-106", "title": "Legacy Authentication Bug Fix", "desc": "Fix password verification fallback for historical user accounts.", "status": IssueStatus.CLOSED, "priority": IssuePriority.LOW, "project": dt_proj, "creator": admin, "assignee": dev_kevin},

            # INFRA Project
            {"key": "INFRA-101", "title": "PostgreSQL Connection Pooling and Indexing", "desc": "Optimize SQLAlchemy pool size and add index on project_id and assigned_to.", "status": IssueStatus.RESOLVED, "priority": IssuePriority.CRITICAL, "project": infra_proj, "creator": pm_maria, "assignee": dev_emily},
            {"key": "INFRA-102", "title": "Alembic Versioned Migration Scripts", "desc": "Create 002_rbac_and_teams.py migration script for database schema update.", "status": IssueStatus.RESOLVED, "priority": IssuePriority.HIGH, "project": infra_proj, "creator": pm_maria, "assignee": dev_vikram},
            {"key": "INFRA-103", "title": "FastAPI Async Route Performance Benchmarking", "desc": "Run httpx benchmark tests against backend endpoints.", "status": IssueStatus.IN_PROGRESS, "priority": IssuePriority.MEDIUM, "project": infra_proj, "creator": pm_maria, "assignee": dev_emily},
            {"key": "INFRA-104", "title": "Automated Pytest Integration Test Suite", "desc": "Write test cases for authentication, RBAC, and issue scoping.", "status": IssueStatus.TODO, "priority": IssuePriority.HIGH, "project": infra_proj, "creator": pm_maria, "assignee": dev_vikram},

            # MOB Project
            {"key": "MOB-101", "title": "React Native Dashboard KPI Cards", "desc": "Create responsive metric cards for task counts and high priority alerts.", "status": IssueStatus.IN_PROGRESS, "priority": IssuePriority.HIGH, "project": mob_proj, "creator": pm_alex, "assignee": dev_lisa},
            {"key": "MOB-102", "title": "Push Notification Service Integration", "desc": "Send real-time alerts when an issue status changes or user is mentioned in a comment.", "status": IssueStatus.TODO, "priority": IssuePriority.MEDIUM, "project": mob_proj, "creator": pm_alex, "assignee": dev_lisa},
            {"key": "MOB-103", "title": "Offline Task Sync Engine", "desc": "Cache offline issue edits and sync when connection is restored.", "status": IssueStatus.TODO, "priority": IssuePriority.LOW, "project": mob_proj, "creator": pm_alex, "assignee": dev_rahul},
            {"key": "MOB-104", "title": "Mobile Authentication Flow & Secure Storage", "desc": "Store JWT bearer tokens securely in EncryptedStorage.", "status": IssueStatus.RESOLVED, "priority": IssuePriority.HIGH, "project": mob_proj, "creator": pm_alex, "assignee": dev_chen},
        ]

        for idata in demo_issues:
            iss = db.query(Issue).filter(Issue.issue_key == idata["key"]).first()
            if not iss:
                iss = Issue(
                    issue_key=idata["key"],
                    title=idata["title"],
                    description=idata["desc"],
                    status=idata["status"],
                    priority=idata["priority"],
                    project_id=idata["project"].id,
                    created_by=idata["creator"].id,
                    assigned_to=idata["assignee"].id
                )
                db.add(iss)
                db.commit()
                db.refresh(iss)
                print(f"  [OK] Created Issue: {iss.issue_key} - {iss.title} ({iss.assignee.name})")

        # 4. Comments
        dt102 = db.query(Issue).filter(Issue.issue_key == "DT-102").first()
        if dt102 and not db.query(Comment).filter(Comment.issue_id == dt102.id).first():
            c1 = Comment(issue_id=dt102.id, user_id=pm_alex.id, content="Sarah, please test the Kanban drag-and-drop status transitions.")
            c2 = Comment(issue_id=dt102.id, user_id=dev_sarah.id, content="Working on it! Status updates trigger instant server-side re-renders now.")
            db.add_all([c1, c2])
            db.commit()
            print("  [OK] Created sample comments on DT-102")

        print("\n[SUCCESS] Seeding completed with 10 employee accounts across 3 projects!")
        print("--------------------------------------------------")
        print("Ready Test Credentials (Password for all: admin123 / pm123 / dev123):")
        print("   * Admin:              admin@devtrack.io      / admin123")
        print("   * PM (DevTrack):      pm.alex@devtrack.io    / pm123")
        print("   * PM (Infra):         pm.maria@devtrack.io   / pm123")
        print("   * Developer (Sarah):  dev.sarah@devtrack.io  / dev123")
        print("   * Developer (Rahul):  dev.rahul@devtrack.io  / dev123")
        print("   * Developer (Chen):   dev.chen@devtrack.io   / dev123")
        print("   * Developer (Lisa):   dev.lisa@devtrack.io   / dev123")
        print("--------------------------------------------------")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
