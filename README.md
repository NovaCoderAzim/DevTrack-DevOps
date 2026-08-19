# DevTrack — Cloud-Native SaaS Issue & Project Management Platform

DevTrack is a modern, role-aware SaaS issue and project tracking platform built for engineering teams. It provides comprehensive project planning, Kanban task tracking, team management, and server-side filtering and pagination.

---

## 🏛️ Application Architecture & RBAC (Phase 1)

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: FastAPI, Python 3.11, SQLAlchemy 2.0, Pydantic v2, Alembic
- **Database**: PostgreSQL 15 (with relational tables, foreign key constraints, and migrations)
- **Security**: JWT Bearer authentication, PBKDF2 / bcrypt password hashing

### Role-Based Access Control (RBAC)
- 🛡️ **ADMIN**: Full system control, employee management, project creation, issue management, and platform analytics.
- 💼 **PROJECT_MANAGER**: Project oversight, team member assignment, issue creation, and milestone management.
- 💻 **DEVELOPER**: Scoped visibility to assigned projects and tasks, Kanban board updates, and issue comments.

---

## 🐳 Phase 2 — Docker Containerization

Phase 2 containerizes DevTrack into three independent, standalone Docker containers operating across an isolated Docker bridge network.

```
[ Browser / Host ]
        |
        v  (Port 3000 on Host)
[ devtrack-frontend:phase2 (NGINX Multi-Stage Container) ]
        |  (API calls dispatched to http://localhost:8000/api/v1)
        v
[ devtrack-backend:phase2 (FastAPI / Uvicorn Container - Non-Root User) ]
        |  (Database DNS: devtrack-postgres:5432 on 'devtrack-net')
        v
[ devtrack-postgres (PostgreSQL 15-alpine Container + Volume 'devtrack-db-data') ]
```

---

### 📦 Docker Artifacts

| Component | Image Name | Base Image | Highlights |
| :--- | :--- | :--- | :--- |
| **Backend** | `devtrack-backend:phase2` | `python:3.11-slim` | Non-root `appuser` (UID 1000), unbuffered logs, zero baked-in secrets |
| **Frontend** | `devtrack-frontend:phase2` | `node:20-alpine` (Build) + `nginx:alpine` (Runtime) | Multi-stage build, NGINX SPA fallback (`try_files`), asset caching |
| **Database** | `postgres:15-alpine` | `postgres:15-alpine` | Isolated Docker network, persistent named volume |

---

### 🚀 Running the Containerized Application (Step-by-Step)

#### 1. Create Isolated Docker Network & Volume
```bash
docker network create devtrack-net
docker volume create devtrack-db-data
```

#### 2. Start PostgreSQL Container
```bash
docker run -d \
  --name devtrack-postgres \
  --network devtrack-net \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=devtrack_db \
  -v devtrack-db-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15-alpine
```

#### 3. Build Backend Docker Image
```bash
docker build -t devtrack-backend:phase2 backend/
```

#### 4. Run Database Migrations & Initial Seed Data
Run Alembic migrations directly against the containerized PostgreSQL database:
```bash
docker run --rm --network devtrack-net \
  -e DATABASE_URL=postgresql://postgres:postgres123@devtrack-postgres:5432/devtrack_db \
  devtrack-backend:phase2 \
  alembic upgrade head
```

Seed initial structured employees, projects, and issues:
```bash
docker run --rm --network devtrack-net \
  -e DATABASE_URL=postgresql://postgres:postgres123@devtrack-postgres:5432/devtrack_db \
  devtrack-backend:phase2 \
  python seed.py
```

#### 5. Start Backend Container
```bash
docker run -d \
  --name devtrack-backend \
  --network devtrack-net \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://postgres:postgres123@devtrack-postgres:5432/devtrack_db \
  -e JWT_SECRET=your_secure_jwt_secret_key_here \
  -e BACKEND_CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,http://localhost:80,http://localhost,http://localhost:5173" \
  devtrack-backend:phase2
```

#### 6. Build & Start Frontend Container
Build the multi-stage NGINX image:
```bash
docker build -t devtrack-frontend:phase2 frontend/
```

Run the containerized frontend:
```bash
docker run -d \
  --name devtrack-frontend \
  --network devtrack-net \
  -p 3000:80 \
  devtrack-frontend:phase2
```

---

### 🔍 Health Check & Verification

- **Frontend Application**: `http://localhost:3000/`
- **Direct SPA Navigation & Refresh**: Verify `/login`, `/dashboard`, `/projects`, `/issues`, `/employees`, and `/settings`.
- **Backend Health Check**:
  ```bash
  curl -i http://localhost:8000/health
  # Response: HTTP/1.1 200 OK {"status":"healthy","service":"DevTrack Core API"}
  ```
- **Backend Swagger Interactive Docs**: `http://localhost:8000/docs`

---

### 🧹 Safe Container Cleanup & Teardown

To stop and remove only the Phase 2 DevTrack resources without affecting other Docker workloads:

```bash
# Stop and remove DevTrack containers
docker stop devtrack-frontend devtrack-backend devtrack-postgres
docker rm devtrack-frontend devtrack-backend devtrack-postgres

# Remove DevTrack network
docker network rm devtrack-net

# (Optional) Remove database volume if a fresh start is desired
docker volume rm devtrack-db-data
```
