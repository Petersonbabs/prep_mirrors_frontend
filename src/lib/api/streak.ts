// frontend/src/lib/api/streak.ts
import { apiClient } from './client';

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_active: string;
  freezes_available: number;
  upcoming_milestones: Array<{
    days: number;
    reward: string;
    reward_value: string;
  }>;
  recent_history: Array<{
    date: string;
    had_activity: boolean;
    used_freeze: boolean;
  }>;
}

export interface StreakUpdateResponse {
  current_streak: number;
  longest_streak: number;
  milestone_achieved: {
    days: number;
    reward: string;
  } | null;
}

export const streakApi = {
  /**
   * Get current streak data for authenticated user
   */
  getStreak: async (): Promise<{
    success: boolean;
    data?: StreakData;
    error?: string;
  }> => {
    return apiClient.get('/api/streak');
  },

  /**
   * Update streak after completing an interview
   */
  updateStreak: async (): Promise<{
    success: boolean;
    data?: StreakUpdateResponse;
    error?: string;
  }> => {
    return apiClient.post('/api/streak/update', {});
  },

  /**
   * Purchase a streak freeze
   */
  purchaseFreeze: async (): Promise<{
    success: boolean;
    freezes_available?: number;
    error?: string;
  }> => {
    return apiClient.post('/api/streak/purchase-freeze', {});
  },
};