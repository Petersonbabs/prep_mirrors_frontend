import { apiClient } from "./client";

export interface Subscription {
    tier: 'free' | 'pro';
    status: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'expired';
    isTrialActive: boolean;
    trialEndsAt?: string;
    interviewsRemaining: number;
    resetDate?: string;
    price: number
}

// Subscription state is read from the bearer token server-side; the userId
// arguments are retained for call-site compatibility only.
export const subscriptionApi = {
    getStatus: async (userId: string): Promise<{ success: boolean; data?: Subscription; error?: string }> => {
        try {
            return await apiClient.get(`/api/subscription/status/${userId}`);
        } catch (error) {
            return { success: false, error: 'Failed to fetch subscription' };
        }
    },

    canInterview: async (userId: string): Promise<{ success: boolean; allowed: boolean; remaining?: number; reason?: string }> => {
        try {
            return await apiClient.get(`/api/subscription/can-interview/${userId}`);
        } catch (error) {
            return { success: false, allowed: false, reason: 'Network error' };
        }
    },

    getPortalUrl: async (userId: string) => {
        try {
            return await apiClient.post('/api/subscription/portal-url', { userId });
        } catch (error) {
            return { success: false, allowed: false, reason: 'Network error' };
        }
    },

    upgrade: async (userId: string, variantId: string) => {
        try {
            return await apiClient.post('/api/subscription/checkout-url', { userId, variantId });
        } catch (error) {
            return { success: false, allowed: false, reason: 'Network error' };
        }
    }
};
