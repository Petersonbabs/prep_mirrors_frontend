

export interface Subscription {
    tier: 'free' | 'pro';
    status: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'expired';
    isTrialActive: boolean;
    trialEndsAt?: string;
    interviewsRemaining: number;
    resetDate?: string;
}

export const subscriptionApi = {
    getStatus: async (userId: string): Promise<{ success: boolean; data?: Subscription; error?: string }> => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscription/status/${userId}`);
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Failed to fetch subscription' };
        }
    },

    canInterview: async (userId: string): Promise<{ success: boolean; allowed: boolean; remaining?: number; reason?: string }> => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscription/can-interview/${userId}`);
            return await response.json();
        } catch (error) {
            return { success: false, allowed: false, reason: 'Network error' };
        }
    },
};