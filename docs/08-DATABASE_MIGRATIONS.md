# Step 08 - PostgreSQL Database Migrations & Admin Seeding

This document guides freshers through applying database schema changes to Azure Database for PostgreSQL Flexible Server using Prisma ORM.

---

## 🗄️ Database Architecture & Prisma ORM

The application uses **Prisma ORM 5.22** to interact with PostgreSQL.

The schema is defined in [`prisma/schema.prisma`](../prisma/schema.prisma):
- `User`
- `PromptCategory`
- `Prompt`
- `PromptVersion`
- `Generation`
- `GenerationAsset`

---

## 🚀 Running Migrations on Azure PostgreSQL

### 1. Set Database Connection String
```bash
export DATABASE_URL="postgresql://aistudioadmin:YourPassword123!@psql-aistudio-prod.postgres.database.azure.com:5432/aistudio?sslmode=require"
```

### 2. Apply Prisma Schema Migration
```bash
npx prisma db push
```
*Output:*
```
🚀  Your database is now in sync with your Prisma schema.
```

### 3. Seed Default Admin Account & Prompt Categories
```bash
npx prisma db seed
```
*Output:*
```
🌱  Seeding database...
Created Admin User: admin@azure-ai.com
Created 5 Default Prompt Categories (Cyberpunk, Studio Portrait, Anime, 3D Toy, Vintage Film)
Created 12 Default Prompts with Version 1.0 history.
✅  Seeding completed successfully!
```

---

## 🔑 Default Credentials Created by Seed Script

- **Admin Login Email**: `admin@azure-ai.com`
- **Admin Login Password**: `AdminPass123!`
- **Admin Control Panel URL**: `https://app-aistudio-prod.azurewebsites.net/admin`

---

## ➡️ Next Step

Proceed to **[Step 09 - 09-CONTAINER_REGISTRY_GUIDE.md](09-CONTAINER_REGISTRY_GUIDE.md)** to build and push container images to Azure Container Registry (ACR)!
