# The Evolution of Todo

This project documents the journey of a Todo application from a simple local CLI to a cloud-native, full-stack web system. This is a **Product Architect** demonstration built strictly using Agentic Dev Stack principles.

## 📜 Constitution & Rules
All development is governed by the [Constitution](./constitution.md) and tracked in the `history/` folder.
- **Mandate**: No manual coding allowed. All code is generated via Specs and Plans.
- **Structure**:
  - `history/`: Prompt History Records (PHR) and ADRs.
  - `specs/`: Feature specifications and architectural plans.
  - `src/`: Verified source code.

## 🚀 Phases

### Phase I: In-Memory Python CLI
A command-line tool for managing tasks in local memory.
- **Run**: `uv run src/cli/main.py`
- **Package Manager**: UV

### Phase II: Full-Stack Web App (FastAPI + Next.js)
A multi-user system with persistent storage (Neon PostgreSQL) and JWT Authentication (Better Auth).
- **Backend**: Python FastAPI + SQLModel (Port 800).
- **Frontend**: Next.js 16+ (App Router, Port 3000).
- **Deployment**: Unified Vercel deployment (frontend + backend combined).
- **Setup**: See [guide.md](./guide.md) for detailed instructions.

## 📁 Repository Structure
```text
.
├── api/
│   └── index.py       # Vercel serverless entry point (bridges to backend)
├── history/           # PHR Records
├── specs/             # SDD Specifications
├── src/
│   ├── cli/           # Phase I CLI App
│   ├── backend/       # Phase II FastAPI service
│   └── frontend/      # Phase II Next.js application
├── vercel.json        # Vercel routing configuration
├── constitution.md    # Governing Rules
└── pyproject.toml     # Project Workspace
```

## 🚀 Deployment Architecture

This project uses a **unified deployment** approach on Vercel:
- **Frontend & Backend Combined**: Both deployed as a single Vercel application
- **`api/index.py`**: Bridges Vercel serverless functions to FastAPI backend
- **`vercel.json`**: Routes `/api/*` requests to Python backend, all other routes to Next.js
- **Result**: Single URL serves both frontend UI and backend API

**Live Endpoints** (after deployment):
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-app.vercel.app/api/*`
- API Docs: `https://your-app.vercel.app/docs`

See [guide.md](./guide.md) for complete deployment instructions.
