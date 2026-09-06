# 05 - Azure Storage Account & Blob Storage

Documentation for **Azure Storage Account** hosting user photo uploads and AI-generated output images.

---

## 🖼️ Storage Specifications

- **Terraform Resource**: `azurerm_storage_account.sa`
- **Container Resource**: `azurerm_storage_container.images`
- **Container Name**: `ai-images`
- **Account Tier**: `Standard`
- **Replication**: `LRS` (Locally Redundant Storage)
- **Minimum TLS Version**: `TLS 1.2`
- **Container Access Type**: `blob` (Public read access for images)

---

## 📁 Blob Path Partitioning

Images uploaded or synthesized by the platform are saved under partitioned subfolders:
- `/uploads/{timestamp}-{filename}.png` — User uploaded images.
- `/generated/{timestamp}-output.png` — AI generated artwork assets.
- `/prompt-previews/{prompt-id}.png` — Admin prompt preview cards.
