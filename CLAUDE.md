# CLAUDE.md — Resto

This file provides guidance for AI assistants (Claude Code and others) working in this repository.

## Project Overview

**Resto** is a restaurant management/food-service application (French: *application de restauration*).

- **Repository**: `kanis1245/resto`
- **Language**: French is the documented/user-facing language of the project
- **Status**: Greenfield — no source code has been committed yet

---

## Repository Structure

```
Resto/
├── CLAUDE.md         # This file
└── README.md         # Project summary
```

As the project is built out, this section should be updated to reflect the actual directory layout (e.g. `src/`, `api/`, `frontend/`, `tests/`, etc.).

---

## Development Setup

> Update this section as soon as a technology stack and tooling are chosen.

Typical steps to document here:
1. Prerequisites (Node.js version, Python version, Docker, etc.)
2. `git clone` + dependency installation command
3. Environment variables (`.env` setup from `.env.example`)
4. Database setup / migrations
5. How to run the development server
6. How to run tests

---

## Tech Stack

> To be defined. Recommended to record choices here as they are made.

Possible areas to document:
- **Backend**: framework, language, runtime
- **Frontend**: framework, build tool
- **Database**: engine, ORM/query library
- **Auth**: strategy and library
- **Deployment**: hosting platform, containerization

---

## Conventions

### Git

- Development branch for AI-assisted work: `claude/add-claude-documentation-Hh9PN`
- Push with `git push -u origin <branch-name>`
- Write clear, descriptive commit messages in English or French (be consistent once chosen)
- Never force-push to `main`

### Code Style

> Fill in once linting/formatting tooling is configured.

- Agree on a formatter (Prettier, Black, etc.) and enforce it via a config file committed to the repo
- Agree on a linter (ESLint, Flake8, etc.) and commit its config
- Run linting before committing (add a pre-commit hook or CI step)

### Naming

- Keep names consistent with the domain language (restaurant, menu, commande, table, etc.)
- Prefer explicit names over abbreviations
- File names: use `kebab-case` for files, `PascalCase` for classes/components (adjust once a framework is chosen)

### Environment Variables

- Never commit secrets or `.env` files
- Maintain a `.env.example` file listing all required variables with placeholder values
- Document each variable's purpose inline in `.env.example`

### Testing

- Write tests alongside new features, not after
- Target meaningful coverage on business logic / API routes
- Document how to run the test suite in this file once configured

---

## AI Assistant Notes

- **No source code exists yet**: All implementation is still to come. Do not assume any file structure or library is already in place.
- **Language**: The project description is in French. Clarify with the user whether code comments, variable names, and commit messages should be in French or English.
- **Scope**: This is a restaurant application — keep domain concepts (menus, orders, tables, reservations, staff, etc.) in mind when designing features.
- **Update this file**: Whenever a major architectural decision is made (framework chosen, database selected, API design established), update this CLAUDE.md to reflect the current state of the project. It should always represent the most up-to-date picture of the codebase.

---

## GitHub Integration

- Repo: `kanis1245/resto`
- Use MCP GitHub tools (`mcp__github__*`) for all GitHub interactions (PRs, issues, comments)
- Do NOT create pull requests unless the user explicitly requests one
