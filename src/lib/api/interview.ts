import { Feedback } from "../types";


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

export interface GenerateQuestionResponse {
  success: boolean;
  tempUserId: string;
  question: string;
  providerUsed: string;
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
    const response = await fetch(`${API_URL}/api/quick-interview/generate-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, jobTarget }),
    });
    return response.json();
  },
 

  processAnswer: async (
    tempUserId: string,
    question: string,
    answerTranscript: string,
    jobTarget: string
  ): Promise<ProcessAnswerResponse> => {
    const response = await fetch(`${API_URL}/api/quick-interview/process-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tempUserId,
        question,
        answerTranscript,
        jobTarget,
      }),
    });
    return response.json();
  },

  continue: async (tempUserId: string): Promise<ContinueResponse> => {
    const response = await fetch(`${API_URL}/api/quick-interview/continue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempUserId }),
    });
    return response.json();
  },
};