# 06 - Azure Service Bus Queue Messaging

Documentation for **Azure Service Bus** decoupling generation request submission from worker processing.

---

## 📮 Service Bus Specifications

- **Terraform Resource**: `azurerm_servicebus_namespace.sb`
- **Queue Resource**: `azurerm_servicebus_queue.jobs`
- **Queue Name**: `ai-generation-jobs`
- **Namespace SKU**: `Standard`
- **Fully Qualified Namespace**: `<namespace>.servicebus.windows.net`

---

## 📩 Queue Message Payload Format

```json
{
  "jobId": "job-1788683226054-89k6dw",
  "inputImageUrl": "data:image/png;base64,...",
  "promptTemplate": "A futuristic cyberpunk neon cat portrait",
  "customPrompt": "golden hour lighting",
  "parameters": {
    "guidanceScale": 7.5,
    "strength": 0.75,
    "steps": 30
  },
  "createdAt": "2026-09-06T16:50:00.000Z"
}
```
