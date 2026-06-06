// frontend/src/lib/api/interview.ts
import { supabase } from "../supabase";
import { Feedback } from "../types";
import { SessionPhase } from "../types/interview.types";
import { apiClient } from "./client";


export interface GenerateQuestionResponse {
  success: boolean;
  tempUserId: string;
  question: string;
  providerUsed: string;
}

export interface GenerateQuestionsParam {
  companyId: string;
  companyName: string;
  phase: string;
  targetRole: string;
  experienceLevel: string;
  numQuestions: number;
}

export interface ProcessAnswerResponse {
  success: boolean;
  feedback: Feedback;
  avgScore: number;
  providerUsed: string;
}

export interface ContinueResponse {
  success: boolean;
  prefillData: {
    name: string;
    jobTarget: string;
  };
}

export const interviewApi = {
  generateQuestion: async (name: string, jobTarget: string): Promise<GenerateQuestionResponse> => {
    return apiClient.post('/api/quick-interview/generate-question', { name, jobTarget });
  },

  generateQuestions: async (params: GenerateQuestionsParam) => {
    return apiClient.post('/api/generate-questions', params);
  },

  processAnswer: async (
    tempUserId: string,
    question: string,
    answerTranscript: string,
    jobTarget: string
  ): Promise<ProcessAnswerResponse> => {
    return apiClient.post('/api/quick-interview/process-answer', {
      tempUserId,
      question,
      answerTranscript,
      jobTarget,
    });
  },

  continue: async (tempUserId: string): Promise<ContinueResponse> => {
    return apiClient.post('/api/quick-interview/continue', { tempUserId });
  },

  createSession: async (data: {
    companyId: string;
    companyName: string;
    phase: SessionPhase;
    questions: string[];
    answers: string[];
    transcript: Array<{ role: string; content: string }>;
    userId: string;
  }) => {
    return apiClient.post('/api/interview/session/create', data);
  },

  getSession: async (companyId: string) => {
    if (!companyId || companyId === 'undefined') {
      return { success: true, session: null };
    }
    try {
      return await apiClient.get(`/api/interview/session/${companyId}`);
    } catch (error) {
      console.error('Error getting session:', error);
      return { success: true, session: null };
    }
  },

  getInterviewQuestions: async (companyId: string, phase: string) => {
    if (!companyId || companyId === 'undefined') {
      return { success: true, questions: [] };
    }
    try {
      return await apiClient.get(`/api/interview/session/${companyId}/questions/${phase}`);
    } catch (error) {
      console.error('Error getting questions:', error);
      return { success: true, questions: [] };
    }
  },

  completeSession: async (sessionId: string, data: {
    answers: string[];
    transcript: Array<{ role: string; content: string }>;
  }) => {
    return apiClient.post(`/api/interview/session/${sessionId}/complete`, data);
  },

  updateSession: async (data: {
    sessionId?: string;
    companyId?: string;
    phase?: string;
    status?: string;
  }) => {
    return apiClient.patch('/api/interview/session/update', data);
  },

  getFeedback: async (sessionId: string) => {
    return apiClient.get(`/api/interview/session/${sessionId}/feedback`);
  },

  getLatestUserFeedback: async (userId: string) => {
    // Fetch from interview_sessions table
    const { data } = await supabase
      .from('interview_sessions')
      .select('feedback')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return data?.feedback || null;
  },

  generateFeedback: async (sessionId: string) => {
    return apiClient.post(`/api/interview/session/${sessionId}/generate-feedback`, {});
  },
};