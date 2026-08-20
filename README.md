# Users DevSecOps Lab

Base CRUD application for a progressive DevOps/DevSecOps/GitOps laboratory.

## Current phase

This project intentionally contains only the application base:

- HTML
- CSS
- JavaScript vanilla
- Node.js
- TypeScript
- Express
- PostgreSQL
- `pg`

The following are deliberately NOT included yet:

- Docker
- Docker Compose
- Kubernetes
- Kind
- Argo CD
- SonarQube
- Azure DevOps Pipelines
- CI/CD
- GitOps

They will be introduced progressively in later laboratory phases.

## Architecture

Browser -> Frontend -> REST API -> Backend -> PostgreSQL

## Requirements

- Node.js 20+ recommended
- PostgreSQL 16+ recommended

## Database

For this initial phase, create a PostgreSQL database and execute:

`database/schema.sql`

Example database values:

- database: users_lab
- user: users_app
- password: choose your own local password

Liquibase will later become the owner of schema changes.

## Backend

From `backend/`:

1. Copy `.env.example` to `.env`.
2. Set the PostgreSQL values.
3. Install dependencies:

```bash
npm install
```

4. Start development server:

```bash
npm run dev
```

The API will be available at:

`http://localhost:3000`

Useful endpoints:

- GET /health
- GET /version
- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

## Frontend

The frontend is static HTML/CSS/JavaScript.

For local development, serve the `frontend/` directory with any simple static HTTP server.

Do not open `index.html` directly with `file://`; use HTTP so browser requests behave consistently.

The current API URL is configured in `frontend/js/app.js` and can later be moved to a deployment-specific configuration mechanism before Docker/Kubernetes are introduced.

## Tests

From `backend/`:

```bash
npm test
```

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```

## Next laboratory phase

After this application is verified locally, the next phase will be:

1. PostgreSQL baseline
2. Liquibase `generate-changelog`
3. Liquibase-managed changesets
4. Docker
5. Kubernetes/Kind
6. Argo CD
7. SonarQube
8. Azure DevOps CI/CD
9. GitOps
10. Rolling updates
11. Rollback
# users-devsecops
