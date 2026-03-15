# FlowTask Architecture Context

## 1. Project Overview

**Project Name:** FlowTask

**Description:**
FlowTask is a lightweight SaaS-style task management system inspired by Kanban tools like Trello. The system allows users to create workspaces, boards, and tasks organized in columns.

The project is intentionally simplified because it is a **solo-developed portfolio project**, but it follows **professional software architecture practices**.

Primary goals:

- demonstrate backend architecture
- demonstrate frontend architecture
- apply software testing
- demonstrate API design
- demonstrate SaaS-style multi-entity modeling

---

# 2. System Architecture

The system follows a **3-tier architecture**.

```text
Client (Web)
   ↓
Frontend Application
   ↓
Backend API
   ↓
Database
```

Deployment architecture:

```text
User
 ↓
Frontend (Vercel)
 ↓
Backend API (Render)
 ↓
PostgreSQL Database (Render Managed DB)
```

Technologies used:

Frontend:

- Next.js
- Tailwind CSS

Backend:

- NestJS
- Prisma

Database:

- PostgreSQL

Infrastructure:

- Docker (development only)

Deployment:

- Vercel (frontend)
- Render (backend + database)

Package manager:

- pnpm

---

# 3. Architectural Philosophy

The backend uses a **modular architecture inspired by Clean Architecture principles**.

Important principles:

- Separation of responsibilities
- Feature-based modular structure
- Low coupling between modules
- Testable services
- DTO-based API contracts

Clean Architecture is **not strictly implemented with layers**, but its principles guide module design.

---

# 4. Backend Project Structure

```text
backend/

src/

  modules/
    auth/
    users/
    workspaces/
    boards/
    tasks/

  database/
    prisma.service.ts
    prisma.module.ts

  common/
    guards/
    filters/
    decorators/

  config/

  app.module.ts
  main.ts

prisma/
  schema.prisma
  migrations/

docker-compose.yml
```

Key rules:

- Each feature exists inside a **module**
- Controllers handle HTTP layer
- Services contain business logic
- DTOs define request/response contracts

---

# 5. Backend Modules

Modules represent **system features**.

### Auth Module

Responsibilities:

- user login
- user registration
- JWT authentication

Endpoints:

```
POST /auth/register
POST /auth/login
GET  /auth/me
```

---

### Users Module

Responsibilities:

- user management
- profile data

---

### Workspaces Module

Responsibilities:

- create workspaces
- list workspaces
- workspace ownership

---

### Boards Module

Responsibilities:

- create boards
- list boards within workspace

---

### Tasks Module

Responsibilities:

- create tasks
- edit tasks
- move tasks between columns
- delete tasks

---

# 6. Database Design

ORM:

- Prisma

Database:

- PostgreSQL

Core entities:

```
User
Workspace
Board
Task
```

Relationships:

```
User
 └── Workspaces

Workspace
 └── Boards

Board
 └── Tasks
```

Simplified schema chosen intentionally to avoid overengineering.

---

# 7. Frontend Architecture

Frontend uses **component-driven architecture**.

Structure:

```text
frontend/

src/

  app/
    login/
    dashboard/
    workspace/
    board/

  components/
    ui/
    board/
    layout/

  services/
    api.ts
    auth.service.ts
    workspace.service.ts
    task.service.ts

  hooks/

  types/

  utils/
```

Key principles:

- reusable UI components
- API access isolated in services
- hooks manage state logic

---

# 8. Development Environment

Local development uses Docker.

```text
Docker Compose

API container
PostgreSQL container
```

Purpose:

- reproducible environment
- easy local setup
- isolated database

---

# 9. Production Deployment

In production:

Database and API are **separate services**.

Architecture:

```
Vercel
   ↓
Frontend

Render
   ↓
NestJS API

Render Managed PostgreSQL
```

Reasons:

- improved scalability
- security (database not public)
- managed backups

---

# 10. Testing Strategy

The project includes a **multi-layer testing strategy**.

Testing types:

Unit tests
Integration tests
End-to-end tests

Tools:

- Jest (unit tests)
- Playwright or Cypress (E2E)

Testable layers:

- services
- API endpoints
- user flows

---

# 11. API Design Principles

The API follows REST conventions.

Examples:

```
POST /auth/login
POST /workspaces
GET  /workspaces
GET  /boards/:id
POST /tasks
PATCH /tasks/:id
DELETE /tasks/:id
```

Some domain-specific endpoints exist:

```
PATCH /tasks/:id/move
```

This supports Kanban drag-and-drop behavior.

---

# 12. Design Constraints

Important constraints for the project:

- built by a single developer
- limited complexity
- focus on architecture quality rather than feature count
- database intentionally minimal

---

# 13. Intended Learning Outcomes

This project demonstrates:

- backend modular architecture
- API design
- SaaS-style data modeling
- frontend component architecture
- deployment architecture
- automated testing

---

# 14. LLM Usage Notes

This document is designed to provide **complete architectural context for any LLM interacting with the repository**.

LLMs should assume:

- NestJS modular backend
- Prisma ORM
- PostgreSQL database
- Next.js frontend
- Docker for local development
- Render + Vercel deployment
