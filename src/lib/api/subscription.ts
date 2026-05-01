

export interface Subscription {
    tier: 'free' | 'pro';
    status: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'expired';
    isTrialActive: boolean;
    trialEndsAt?: string;
    interviewsRemaining: number;
    resetDate?: string;
    price: number
}
const API_URL = import.meta.env.API_URL || 'http://localhost:4444';

export const subscriptionApi = {
    getStatus: async (userId: string): Promise<{ success: boolean; data?: Subscription; error?: string }> => {
        try {
            const response = await fetch(`${API_URL}/api/subscription/status/${userId}`);
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Failed to fetch subscription' };
        }
    },

    canInterview: async (userId: string): Promise<{ success: boolean; allowed: boolean; remaining?: number; reason?: string }> => {
        try {
            const response = await fetch(`${API_URL}/api/subscription/can-interview/${userId}`);
            return await response.json();
        } catch (error) {
            return { success: false, allowed: false, reason: 'Network error' };
        }
    },

    getPortalUrl: async (userId: string) => {
        try {
            const response = await fetch(`${API_URL}/api/subscription/portal-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            return await response.json();
        } catch (error) {
            return { success: false, allowed: false, reason: 'Network error' };
        }
    },

    upgrade: async (userId: string, variantId: string) => {
        try {
            const response = await fetch(`${API_URL}/api/subscription/checkout-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    variantId
                }),
            });

            return await response.json();
        } catch (error) {
            return { success: false, allowed: false, reason: 'Network error' };
        }
    }
};