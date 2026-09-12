// frontend/src/lib/api/user.ts
import { apiClient } from "./client";

export const userApi = {
    // The profile updated is always the signed-in user's; userId is sent only
    // for backward compatibility and is ignored by the server.
    updateProfile: async (userId: string, data: {
        target_role?: string;
        experience_level?: string;
        goal?: string;
    }): Promise<{ success: boolean; error?: string }> => {
        try {
            return await apiClient.put('/api/update-profile', { userId, ...data });
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    },
};
