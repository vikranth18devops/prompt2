#!/usr/bin/env bash
set -e

echo "🚀 Starting Production Azure Terraform Deployment..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$SCRIPT_DIR"

if [ ! -f "terraform.tfvars" ]; then
  echo "⚠️ Warning: terraform.tfvars not found. Creating from terraform.tfvars.example..."
  cp terraform.tfvars.example terraform.tfvars
  echo "Please edit terraform/terraform.tfvars with your actual passwords before proceeding if needed."
fi

echo "1️⃣ Initializing Terraform..."
terraform init

echo "2️⃣ Planning Infrastructure..."
terraform plan -out=tfplan

echo "3️⃣ Applying Infrastructure..."
terraform apply -auto-approve tfplan

echo "✅ Infrastructure Provisioned Successfully!"
echo "Outputs:"
terraform output

cd "$PROJECT_ROOT"
