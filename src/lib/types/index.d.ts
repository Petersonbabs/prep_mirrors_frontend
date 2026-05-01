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

e// frontend/src/lib/types/feedback.ts

export interface CategoryScore {
  name: "Communication Skills" | "Technical Knowledge" | "Problem Solving" | "Cultural Fit" | "Confidence & Clarity";
  score: number;
  comment: string;
  quote?: string;
}

export interface SuggestedPractice {
  title: string;
  description: string;
  url?: string;
  type: "article" | "video" | "exercise" | "course";
}

export interface OnboardingFeedback {
  overall_score: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  suggested_practice: SuggestedPractice;
  finalAssessment: string;
}

export interface FeedbackResponse {
  success: boolean;
  data?: OnboardingFeedback;
  error?: string;
}

export interface UserProfile {
  name: string;
  targetRole: string;
  level: string;
  goal: string;
  hiring_timeline: string;
  last_onboarding_step?: number;
  pre_first_interview_confidence?: number | null;
  post_first_interview_confidence?: number | null;
  onboarding_completed?: boolean;
  email?: string;
  plan_type?: 'free' | 'pro';
  subscription_status?: 'active' | 'trialing' | 'cancelled' | 'expired';
  subscription_tier?: 'free' | 'pro'
  trial_end_date?: string | null;
  has_seen_walkthrough?: boolean;
  next_billing_date?: string | null;
}

export interface Company {
  id: string;
  name: string;
  role: string;
  salary: string;
  jobType: string;
  location: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  logo: string;
  profile_id: string;
  created_at: string;
}