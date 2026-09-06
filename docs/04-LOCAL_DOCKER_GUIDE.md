# Step 04 - Local Docker Containerization & Multi-Container Guide

This document guides beginners through running the complete application stack (Web + PostgreSQL) locally using Docker and Docker Compose before deploying to the cloud.

---

## 📁 Docker Asset Layout (`docker/`)

- [`docker/Dockerfile`](../docker/Dockerfile): Multi-stage Node 22 Alpine build (`deps` -> `builder` -> `runner`).
- [`docker/docker-compose.yml`](../docker/docker-compose.yml): Next.js web application + PostgreSQL 15 database stack.
- [`docker/docker-entrypoint.sh`](../docker/docker-entrypoint.sh): Executable startup script for database auto-migration and seeding.

---

## 🚀 Running the Local Docker Stack

### Step 1: Build the Docker Image
```bash
npm run docker:build
```
*Behind the scenes: Docker executes the multi-stage build, caching dependencies in the `deps` layer and generating optimized Next.js standalone assets in `runner`.*

### Step 2: Start the Web + Database Stack
```bash
npm run docker:up
```
*This starts PostgreSQL 15 on port 5432 and the Web App on port 3000.*

### Step 3: Inspect Logs
```bash
npm run docker:logs
```

### Step 4: Verify Deployment
Open your browser:
- User Studio: `http://localhost:3000`
- Admin Control Panel: `http://localhost:3000/admin`
- Health Probe: `http://localhost:3000/api/health`

### Step 5: Stop the Container Stack
```bash
npm run docker:down
```

---

## ➡️ Next Step

Proceed to **[Step 05 - 05-TERRAFORM_REMOTE_STATE.md](05-TERRAFORM_REMOTE_STATE.md)** to prepare remote Terraform state locking on Azure Blob Storage!
