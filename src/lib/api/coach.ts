import { apiClient } from './client';

export const coachApi = {
    startSession: async (data: {
        interviewPhase: string;
        companyName?: string;
        feedback?: any;
    }) => {
        return apiClient.post('/api/coach/session/start', data);
    },

    sendMessage: async (sessionId: string, message: string) => {
        return apiClient.post(`/api/coach/session/${sessionId}/chat`, { message });
    },

    endSession: async (sessionId: string) => {
        return apiClient.post(`/api/coach/session/${sessionId}/end`, {});
    },
};