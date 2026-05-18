// frontend/src/lib/api/progress.ts
import { apiClient } from './client';
import type { 
  UserStats, 
  SessionHistory, 
  SkillImprovement, 
  DashboardProgressData,
  ScoreTrendPoint 
} from '../hooks/useProgressData';


export const progressApi = {
  /**
   * Get all dashboard progress data in one request
   */
  getDashboard: async (): Promise<{
    success: boolean;
    data?: DashboardProgressData;
    error?: string;
  }> => {
    return apiClient.get('/api/progress/dashboard');
  },

  /**
   * Get user statistics
   */
  getStats: async (): Promise<{
    success: boolean;
    data?: UserStats;
    error?: string;
  }> => {
    return apiClient.get('/api/progress/stats');
  },

  /**
   * Get session history with pagination
   */
  getSessions: async (
    limit: number = 20, 
    offset: number = 0
  ): Promise<{
    success: boolean;
    data?: SessionHistory[];
    pagination?: { limit: number; offset: number; count: number };
    error?: string;
  }> => {
    return apiClient.get(`/api/progress/sessions?limit=${limit}&offset=${offset}`);
  },

  /**
   * Get skill improvement (before vs after)
   */
  getSkillImprovement: async (): Promise<{
    success: boolean;
    data?: SkillImprovement;
    message?: string;
    error?: string;
  }> => {
    return apiClient.get('/api/progress/skills');
  },

  /**
   * Get confidence journey data
   */
  getConfidenceJourney: async (): Promise<{
    success: boolean;
    data?: { entries: any[]; average_gain: number };
    error?: string;
  }> => {
    return apiClient.get('/api/progress/confidence');
  },

  /**
   * Get score trend over time
   */
  getTrend: async (range: '7d' | '30d' | 'all' = '30d'): Promise<{
    success: boolean;
    data: ScoreTrendPoint[];
    average: number;
    range?: string;
    error?: string;
  }> => {
    return apiClient.get(`/api/progress/trend?range=${range}`);
  },
};