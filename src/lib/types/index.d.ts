export interface Feedback {
  quality: number;
  depth: number;
  clarity: number;
  confidence: number;
  breakdown: {
    structure: {
      score: number;
      feedback: string;
      example?: string;
    };
    technical_accuracy: {
      score: number;
      feedback: string;
      missing_points?: string[];
    };
    communication: {
      score: number;
      feedback: string;
      filler_words?: string[];
    };
    engagement: {
      score: number;
      feedback: string;
    };
  };
  overall_score: number;
  overall_feedback: string;
  strengths: string[];
  areas_for_improvement: string[];
  what_you_said: string;
  better_example: string;
  quick_tips: string[];
  suggested_practice?: string;
  recommended_resources?: Array<{
    title: string;
    url?: string;
    type: 'article' | 'video' | 'exercise';
  }>;
}

export enum AiProvider {
  GEMINI = 'gemini',
  OPENAI = 'openai'
}

export interface QuestionFeedback {
  question_text: string;
  score: number;
  key_strength: string;
  key_improvement: string;
  reference_to_answer: string;
}

export interface OnboardingFeedback {
  overall_score: number;
  weakest_question_index: number;
  questions: QuestionFeedback[];
  overall_advice: string;
  suggested_practice: string;
}

export interface FeedbackResponse {
  success: boolean;
  data?: OnboardingFeedback;
  error?: string;
}