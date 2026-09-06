# Implementation Plan — AI Image Generation Platform & Admin Panel

Establish the full architectural plan and initial foundation for a production-ready AI image generation platform built with Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Prisma ORM (PostgreSQL), and Azure Cloud Integration abstractions (Blob Storage, Service Bus, Key Vault, Application Insights).

---

## User Review Required

> [!IMPORTANT]
> **Single Codebase, Dual Application Architecture**
> The platform hosts both the **User-Facing AI Image Generator** and the **Admin Panel** within a single Next.js App Router workspace (`/app/(user)` and `/app/admin`), sharing core UI components, Prisma ORM models, and Azure service abstractions.

> [!NOTE]
> **Azure Integration Strategy**
> Since Azure credentials depend on cloud provisioning, service wrappers for **Azure Blob Storage**, **Azure Service Bus**, **Azure Key Vault**, and **Azure Application Insights** will include clean fallback/mock drivers for local development while seamlessly plugging into SDK clients (`@azure/storage-blob`, `@azure/service-bus`, `@azure/identity`, `@microsoft/applicationinsights-web`) in production.

---

## Proposed Architecture & Structure

```
.
├── app/
│   ├── (user)/                # User-Facing AI Image Generator UI
│   │   ├── page.tsx           # Main Generator Studio Dashboard
│   │   ├── gallery/           # User Generations Gallery
│   │   └── layout.tsx         # User Layout with Header & Navigation
│   ├── admin/                 # Admin Panel UI
│   │   ├── login/             # Admin Authentication
│   │   ├── prompts/           # Prompt Management (Create, Edit, Activate)
│   │   ├── categories/        # Category Management
│   │   ├── analytics/         # Application Insights & Job Telemetry Overview
│   │   └── layout.tsx         # Admin Dashboard Sidebar & Shell
│   ├── api/                   # Serverless Backend & API Routes
│   │   ├── auth/              # Auth endpoints (Admin login / session validation)
│   │   ├── prompts/           # Prompts API (Public listing & Admin CRUD)
│   │   ├── categories/        # Categories API
│   │   ├── generate/          # Job Submission & Processing Stream API
│   │   ├── upload/            # Azure Blob Presigned Upload URL Generator
│   │   └── health/            # App Insights Telemetry & Health check
│   ├── globals.css            # Tailwind & Theme Token Definitions
│   └── layout.tsx             # Root Layout with Font & Theme Providers
├── components/
│   ├── ui/                    # shadcn/ui base design primitives (Button, Card, Dialog, etc.)
│   ├── user/                  # User workflow components
│   │   ├── ImageUploader.tsx  # Drag & Drop input image loader
│   │   ├── PromptSelector.tsx # Dynamic prompt cards fetched from DB
│   │   ├── ProcessingVisualizer.tsx # Framer Motion state animation
│   │   ├── ImageComparisonSlider.tsx # Before/After comparison tool
│   │   └── GenerationControls.tsx # Aspect ratio, strength, seed controls
│   ├── admin/                 # Admin panel components
│   │   ├── PromptForm.tsx     # Create/Edit Prompt with live preview & activate toggle
│   │   ├── CategoryManager.tsx # Category creation & icon picker
│   │   └── JobMonitor.tsx     # Service Bus queue telemetry viewer
│   └── shared/                # Navigation, Header, Badges, Status Pill
├── lib/
│   ├── azure/                 # Modular Azure Integration Layer
│   │   ├── blob.ts            # Azure Blob Storage Client & Presigned URLs
│   │   ├── serviceBus.ts      # Azure Service Bus Producer/Consumer queue
│   │   ├── keyVault.ts        # Azure Key Vault secret retrieval helper
│   │   └── telemetry.ts       # Azure Application Insights logging wrapper
│   ├── db/                    # Database client
│   │   └── prisma.ts          # Singleton Prisma Client Instance
│   └── utils.ts               # Shared helper functions
├── prisma/
│   ├── schema.prisma          # Database models (Prompts, Categories, Jobs, Admin Users)
│   └── seed.ts                # Initial seed data for categories & starter prompts
└── public/                    # Static assets & placeholder previews
```

---

## Data Models & Schema Design (Prisma + PostgreSQL)

### 1. `Category`
- `id` (String, UUID, PK)
- `name` (String)
- `slug` (String, Unique)
- `description` (String?)
- `icon` (String)
- `createdAt` / `updatedAt`

### 2. `Prompt`
- `id` (String, UUID, PK)
- `title` (String)
- `slug` (String, Unique)
- `description` (String)
- `promptTemplate` (String) - Master template string with dynamic placeholders
- `negativePrompt` (String?)
- `previewImageUrl` (String) - Azure Blob Storage URL
- `categoryId` (FK to Category)
- `isActive` (Boolean, default: true)
- `defaultConfig` (JSON) - Default strength, guidance scale, steps
- `createdAt` / `updatedAt`

### 3. `ImageGeneration` (User Job)
- `id` (String, UUID, PK)
- `inputImageUrl` (String) - Azure Blob Storage URL
- `outputImageUrl` (String?) - Azure Blob Storage URL
- `promptId` (FK to Prompt)
- `customPrompt` (String?) - Optional user prompt modifications
- `parameters` (JSON) - Applied generation settings (guidance, strength, seed)
- `status` (Enum: `PENDING`, `QUEUED`, `PROCESSING`, `COMPLETED`, `FAILED`)
- `progress` (Int, 0-100)
- `errorMessage` (String?)
- `executionTimeMs` (Int?)
- `createdAt` / `updatedAt`

### 4. `AdminUser`
- `id` (String, UUID, PK)
- `email` (String, Unique)
- `passwordHash` (String)
- `name` (String)
- `role` (Enum: `ADMIN`, `SUPERADMIN`)
- `createdAt` / `updatedAt`

---

## Key Workflows & Features

### Core User Workflow
1. **Upload Input Image**: User uploads source image -> Uploaded directly to Azure Blob Storage container (`/user-inputs`).
2. **Select Dynamic Prompt**: User chooses prompt category and active prompt loaded dynamically from `/api/prompts` database endpoint.
3. **Configure & Generate**: User tweaks parameters -> Job dispatched via API (`/api/generate`) -> Message queued in Azure Service Bus.
4. **Processing Animation**: Framer Motion animated interface visualizes status steps (`QUEUED` -> `PROCESSING` -> `COMPLETED`) via polling/SSE stream.
5. **View & Download**: Interactive Before/After slider visualizes input vs generated output with high-res download option.

### Core Admin Workflow
1. **Secure Admin Login**: Auth guard with hashed credentials & JWT token.
2. **Create / Edit Prompt**: Form to specify prompt title, template string, category, parameter defaults, and preview image upload to Azure Blob Storage.
3. **Toggle Active Status**: Instantly activate/deactivate prompts. Inactive prompts disappear immediately from User UI.
4. **Telemetry & Queue Monitoring**: View system status powered by Azure Application Insights metrics.

---

## Security & Architectural Constraints

- **No Hardcoded Prompts**: Prompts strictly fetched from PostgreSQL via Prisma ORM API routes.
- **No Binaries in DB**: Image binaries stored strictly in Azure Blob Storage; only HTTPS URLs stored in PostgreSQL.
- **Secret Isolation**: Secrets retrieved via environment variables / Azure Key Vault abstraction.
- **Clean Service Layers**: Decoupled modules for DB, Storage, Queuing, Telemetry, and UI components.

---

## Verification Plan

### Automated Verification
- Project initialization with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.
- Prisma schema generation (`npx prisma generate`) and seed verification (`npx prisma db seed`).
- Type check (`npm run build` or `npx tsc --noEmit`).

### Manual Verification
- Test user flow: Image upload preview, prompt selection, generation simulation, high-res download.
- Test admin flow: Login, prompt creation with preview image upload, prompt activation toggle, and real-time reflection in user UI.
