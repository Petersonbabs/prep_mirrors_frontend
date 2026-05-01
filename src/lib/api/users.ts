// frontend/src/lib/api/user.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

export const userApi = {
    updateProfile: async (userId: string, data: {
        target_role?: string;
        experience_level?: string;
        goal?: string;
    }): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_URL}/api/user/update-profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...data }),
            });
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    },
};