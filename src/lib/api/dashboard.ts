const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

export const dashboardApi = {
    markWalkthroughComplete: async (userId: string): Promise<{ success: boolean }> => {
        try {
            const response = await fetch(`${API_URL}/api/user/mark-walkthrough`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            return await response.json();
        } catch (error) {
            return { success: false };
        }
    },
};