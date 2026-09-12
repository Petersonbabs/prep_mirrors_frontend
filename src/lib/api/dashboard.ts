import { apiClient } from "./client";

export const dashboardApi = {
    // Marks the walkthrough seen for the signed-in user; userId is ignored
    // server-side in favour of the bearer token.
    markWalkthroughComplete: async (userId: string): Promise<{ success: boolean }> => {
        try {
            return await apiClient.post('/api/user/mark-walkthrough', { userId });
        } catch (error) {
            return { success: false };
        }
    },
};
