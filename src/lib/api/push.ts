// frontend/src/lib/api/push.ts
import { apiClient } from './client';

export const pushApi = {
  /**
   * Subscribe to push notifications
   */
  subscribe: async (subscription: PushSubscriptionJSON, userAgent: string): Promise<{
    success: boolean;
    error?: string;
  }> => {
    return apiClient.post('/api/push/subscribe', {
      subscription,
      userAgent,
    });
  },

  /**
   * Unsubscribe from push notifications
   */
  unsubscribe: async (endpoint: string): Promise<{
    success: boolean;
    error?: string;
  }> => {
    return apiClient.post('/api/push/unsubscribe', { endpoint });
  },

  /**
   * Test push notification (for development)
   */
  testNotification: async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    return apiClient.post('/api/push/test', {});
  },
};