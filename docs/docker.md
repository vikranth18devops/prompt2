# Docker Containerization & Local Setup Guide

Guide for building multi-stage Docker container images and running multi-container stacks locally.

---

## 📁 Container Asset Layout (`docker/`)

- [`docker/Dockerfile`](../docker/Dockerfile): Multi-stage Node 22 Alpine build (`deps` -> `builder` -> `runner`).
- [`docker/docker-compose.yml`](../docker/docker-compose.yml): Next.js web application + PostgreSQL 15 database stack.
- [`docker/docker-entrypoint.sh`](../docker/docker-entrypoint.sh): Executable startup script for database auto-migration and seeding.

---

## 🚀 Commands

```bash
# Build Docker image
npm run docker:build

# Start Web + PostgreSQL in containers
npm run docker:up

# View container logs
npm run docker:logs

# Stop containers
npm run docker:down
```
