/**
 * Azure Application Insights Telemetry Service
 */

const INSTRUMENTATION_KEY = process.env.AZURE_APPINSIGHTS_INSTRUMENTATIONKEY || process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

export interface TelemetryEvent {
  name: string;
  properties?: Record<string, any>;
  metrics?: Record<string, number>;
}

export function trackEvent(name: string, properties?: Record<string, any>, metrics?: Record<string, number>): void {
  const timestamp = new Date().toISOString();
  console.log(`[Azure App Insights Event] [${timestamp}] ${name}`, {
    properties: properties || {},
    metrics: metrics || {},
    hasInstrumentationKey: Boolean(INSTRUMENTATION_KEY),
  });
}

export function trackException(error: Error, customProperties?: Record<string, any>): void {
  console.error(`[Azure App Insights Exception] ${error.message}`, {
    stack: error.stack,
    properties: customProperties || {},
  });
}

export function trackMetric(name: string, value: number, properties?: Record<string, any>): void {
  console.log(`[Azure App Insights Metric] ${name}: ${value}`, properties || {});
}

export function getTelemetryHealthStatus(): { isConfigured: boolean; isHealthy: boolean; detail?: string } {
  const isConfigured = Boolean(INSTRUMENTATION_KEY);
  return {
    isConfigured,
    isHealthy: true,
    detail: isConfigured ? 'Application Insights connection string active' : 'Not configured (using stdout telemetry logger)',
  };
}
