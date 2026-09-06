# 09 - Azure Application Insights & Telemetry

Documentation for **Azure Application Insights** tracking application performance, request latency, exceptions, and system metrics.

---

## 📹 Telemetry Setup

- **Log Analytics Workspace**: `azurerm_log_analytics_workspace.law`
- **App Insights Resource**: `azurerm_application_insights.appinsights`
- **Application Type**: `web`
- **Retention**: `30 days`

---

## 📊 Tracked Custom Events ([`lib/azure/telemetry.ts`](../../lib/azure/telemetry.ts))

- `SubmitGenerationJob` — Triggered when a user requests an image generation.
- `OpenAiGenerationSuccess` — Tracks execution time and OpenAI model used.
- `JobCompleted` — Tracks completion time and job ID.
- `trackException` — Logs runtime exceptions and error stack traces.
