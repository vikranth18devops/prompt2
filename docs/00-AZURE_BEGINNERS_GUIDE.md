# 00 - Azure Cloud & DevOps Primer (Fresher & Beginner Guide)

Welcome! If you are a **fresher, student, or beginner** who is new to **Microsoft Azure Cloud** and **Terraform Infrastructure-as-Code**, this document explains everything in plain English with simple analogies.

---

## ☁️ What is Cloud Computing & Microsoft Azure?

Imagine you want to start a restaurant business. You could build a physical building from scratch, buy refrigerators, and hire security guards. Or, you could rent a fully furnished space in a modern shopping mall where electricity, security, and maintenance are handled for you.

**Cloud Computing** is renting computers, storage, and databases from tech giants (like Microsoft) across the internet instead of buying physical hardware.

**Microsoft Azure** is Microsoft's cloud platform—a global network of massive data centers hosting millions of servers.

---

## 🧱 Explanation of Azure Services Used in This Project

In our **AI Image Studio** application, we use **8 core Azure services**. Here is what each service does in plain English:

| Azure Service Name | Everyday Analogy | What it Does in Our Application |
| :--- | :--- | :--- |
| **1. Resource Group** | 📁 **Project Folder** | A container that groups all related cloud items together. Deleting the Resource Group deletes all resources inside it cleanly. |
| **2. App Service / Web App** | 🖥️ **24/7 Web Server** | Runs our Next.js web application code online so users can access `https://my-app.azurewebsites.net`. |
| **3. Database for PostgreSQL** | 🗄️ **Digital Filing Cabinet** | Stores structured data securely (user accounts, prompt categories, prompt templates, and generation logs). |
| **4. Storage Account & Blob Storage** | 🖼️ **Cloud Image Folder (Google Drive)** | Stores user-uploaded photos (`/uploads/`) and AI-generated artwork (`/generated/`). |
| **5. Service Bus & Queue** | 📮 **Digital Post Office Waiting Queue** | When 100 users click "Generate" at once, jobs are placed in a queue (`ai-generation-jobs`) so the web app never crashes. |
| **6. Key Vault** | 🏦 **Bank Safe / Password Manager** | Stores sensitive secret keys (OpenAI API key, JWT secret) in an encrypted digital safe. |
| **7. Application Insights** | 📹 **Security Camera & Monitor** | Monitors web traffic, tracks page load speeds, and sends alerts if an error occurs. |
| **8. Managed Identity** | 🪪 **Employee ID Badge** | Gives our Web Server automatic permission to access Key Vault and Storage without writing passwords in code files! |

---

## 🛠️ What is Terraform Infrastructure-as-Code (IaC)?

### The Old Way (Manual Azure Portal Clicks):
To build our cloud app manually, you would log into `portal.azure.com`, click 80 buttons, fill out 40 forms, and risk making a mistake. If you wanted to do it again for staging, you'd spend another 2 hours clicking.

### The Terraform Way (Automatic Blueprint Builder):
**Terraform** is a free tool that reads a simple configuration file ([`terraform/main.tf`](../terraform/main.tf)) and automatically builds all 8 Azure cloud services in 2 minutes!

```
[ Your Terraform Code (main.tf) ] ---> ( Run 'terraform apply' ) ---> [ All 8 Azure Services Built Automatically ]
```

---

## 🚀 Beginner Step-by-Step Azure Setup Guide (Zero to Deployed)

### Step 1: Create a Free Azure Account
1. Go to [azure.microsoft.com/free](https://azure.microsoft.com/free/).
2. Sign up to get **$200 in free Azure credits** for 30 days.

### Step 2: Install Azure CLI and Terraform on Your Computer
- **Mac (Homebrew)**:
  ```bash
  brew install azure-cli terraform
  ```
- **Windows (PowerShell)**:
  ```powershell
  winget install Microsoft.AzureCLI
  winget install HashiCorp.Terraform
  ```

### Step 3: Log in to Azure from Terminal
Open your terminal or command prompt and run:
```bash
az login
```
A browser window will open. Log in with your Azure credentials.

### Step 4: Provision Cloud Infrastructure with Terraform
Navigate to the project's `terraform` directory and execute:

```bash
# 1. Move into terraform directory
cd terraform

# 2. Copy sample variables file
cp terraform.tfvars.example terraform.tfvars

# 3. Initialize Terraform plugins
terraform init

# 4. Preview what Azure resources will be created
terraform plan

# 5. Build infrastructure on Azure Cloud
terraform apply -auto-approve
```

### Step 5: Check Your Deployed Website
Once Terraform finishes, it will print your live Azure Web App URL:
```
Outputs:
web_app_url = "https://app-aistudio-xxxxxx.azurewebsites.net"
```
Open that URL in your browser—your application is now live on Microsoft Azure!

---

## ❓ Frequently Asked Questions for Beginners

<details>
<summary><b>Q: Will I be charged money by Azure?</b></summary>
<p>If you use a free Azure trial account ($200 credit), all resources in this project fall within free/basic tier limits. When testing is complete, run <code>terraform destroy</code> to delete all resources and stop any usage.</p>
</details>

<details>
<summary><b>Q: How do I clean up and delete everything when I'm done?</b></summary>
<p>Simply run <code>terraform destroy -auto-approve</code> inside the <code>terraform/</code> directory. Terraform will delete all Azure resources safely in reverse order.</p>
</details>
