#!/usr/bin/env bash
set -e

echo "🚀 Setting up Azure Remote State Storage for Terraform..."

STATE_RG="rg-terraform-state"
LOCATION="eastus"
RANDOM_SUFFIX=$(openssl rand -hex 3)
STATE_STORAGE_ACCOUNT="tfstateaistudio${RANDOM_SUFFIX}"
CONTAINER_NAME="tfstate"

echo "1️⃣ Creating Resource Group '$STATE_RG'..."
az group create --name "$STATE_RG" --location "$LOCATION" --output table

echo "2️⃣ Creating Storage Account '$STATE_STORAGE_ACCOUNT'..."
az storage account create \
  --resource-group "$STATE_RG" \
  --name "$STATE_STORAGE_ACCOUNT" \
  --sku Standard_LRS \
  --encryption-services blob \
  --output table

echo "3️⃣ Creating Blob Container '$CONTAINER_NAME'..."
az storage container create \
  --name "$CONTAINER_NAME" \
  --account-name "$STATE_STORAGE_ACCOUNT" \
  --auth-mode login \
  --output table

echo "✅ Remote State Backend Storage Ready!"
echo ""
echo "Update terraform/providers.tf with the following backend block:"
echo "---------------------------------------------------------------"
echo "  backend \"azurerm\" {"
echo "    resource_group_name  = \"$STATE_RG\""
echo "    storage_account_name = \"$STATE_STORAGE_ACCOUNT\""
echo "    container_name       = \"$CONTAINER_NAME\""
echo "    key                  = \"prod.terraform.tfstate\""
echo "  }"
echo "---------------------------------------------------------------"
