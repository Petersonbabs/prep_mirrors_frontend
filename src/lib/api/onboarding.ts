import { AiProvider, FeedbackResponse } from "../types";
import { apiClient } from "./client";

// frontend/src/lib/api/onboarding.ts

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

// All onboarding endpoints require a bearer token and resolve the profile from
// it server-side; the profileId arguments here are not what grants access.
export const onboardingApi = {
  generateQuestions: async (data: generateQuestionsParams) => {
    return apiClient.post('/api/onboarding/generate-questions', data);
  },

  getMyOnboardingQuestions: async (profileId: string): Promise<GetMyQuestionsResponse> => {
    return apiClient.get(`/api/onboarding/my-questions/${profileId}`);
  },

  submitAnswers: async (profileId: string, conversation: Array<{ role: string; content: string }>, userProfile: any) => {
    return apiClient.post('/api/onboarding/submit-answers', {
      profileId,
      conversation,
      userProfile,
      interviewType: "mixed",
    });
  },

  saveConfidence: async (profileId: string, postConfidenceScore: number) => {
    return apiClient.post('/api/onboarding/save-confidence', { profileId, postConfidenceScore });
  },

  getMyFeedback: async (profileId: string): Promise<FeedbackResponse> => {
    return apiClient.get(`/api/onboarding/feedback/${profileId}`);
  },
};
