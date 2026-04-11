import { AiProvider } from "../types";

// frontend/src/lib/api/onboarding.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

export interface generateQuestionsParams {
  profileId: string,
  targetRole: string,
  level?: string,
  goal?: string,
  numQuestions: number
  provider?: AiProvider
  interviewType: "behavioural" | "technical" | "mixed"
}

export interface GetMyQuestionsResponse {
  success: boolean;
  questions: string[];
}

export const onboardingApi = {
  generateQuestions: async (data: generateQuestionsParams) => {
    const response = await fetch(`${API_URL}/api/onboarding/generate-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getMyOnboardingQuestions: async (profileId: string): Promise<GetMyQuestionsResponse> => {
    const response = await fetch(`${API_URL}/api/onboarding/my-questions/${profileId}`);
    return response.json();
  },

  submitAnswers: async (tempUserId: string, questions: string[], answers: string[], userProfile: any) => {
    const response = await fetch(`${API_URL}/api/onboarding/submit-answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempUserId, questions, answers, userProfile }),
    });
    return response.json();
  },

  saveConfidence: async (profileId: string, postConfidenceScore: number) => {
    const response = await fetch(`${API_URL}/api/onboarding/save-confidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, postConfidenceScore }),
    });
    return response.json();
  },
};