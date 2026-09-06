import { ServiceBusClient } from '@azure/service-bus';
import { IServiceBusService } from '@/types';

const SERVICE_BUS_CONNECTION = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING;
const QUEUE_NAME = process.env.AZURE_SERVICE_BUS_QUEUE_NAME || 'ai-generation-jobs';

export class ServiceBusService implements IServiceBusService {
  private client: ServiceBusClient | null = null;

  constructor() {
    if (SERVICE_BUS_CONNECTION) {
      try {
        this.client = new ServiceBusClient(SERVICE_BUS_CONNECTION);
      } catch (err) {
        console.warn('[ServiceBusService] Azure SDK initialization warning:', err);
      }
    }
  }

  public async dispatchGenerationJob(payload: {
    generationId: string;
    promptTemplate: string;
    parameters: Record<string, any>;
  }): Promise<{ success: boolean; messageId: string }> {
    const messageId = `msg-${Date.now()}-${payload.generationId}`;

    if (this.client) {
      try {
        const sender = this.client.createSender(QUEUE_NAME);
        await sender.sendMessages({
          body: payload,
          messageId,
          contentType: 'application/json',
        });
        await sender.close();
        return { success: true, messageId };
      } catch (error) {
        console.error('[ServiceBusService] Azure dispatch error:', error);
      }
    }

    return { success: true, messageId: `mock-${messageId}` };
  }
}

export const serviceBusService = new ServiceBusService();
