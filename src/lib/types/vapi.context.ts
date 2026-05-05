import { Company, UserProfile } from ".";

export interface TechnicalContext {
    companyName: string;
    industry: string;
    targetRole: string;
    experienceLevel: string;
    userName: string;
    userBackground: string;
    strengths: string;
    weaknesses: string;
    companyDescription: string;
    companyAvailableRole: string;
    jobDescription: string;
    questions: string[];
    numQuestions: number;
    jobType: string;
}

export interface BehavioralContext {
    companyName: string;
    companyValues: string;
    companyCulture: string;
    companyDescription: string;
    companyAvailableRole: string;
    targetRole: string;
    experienceLevel: string;
    userName: string;
    userBackground: string;
    userGoal: string;
    strengths: string;
    weaknesses: string;
    questions: string[];
    numQuestions: number;
    jobDescription: string;
    jobType: string;
}

export function buildTechnicalContext(params: {
    company: Company;
    user: UserProfile;
    questions?: string[];
    strengths?: string[];
    weaknesses?: string[];
}): TechnicalContext {
    return {
        companyName: params.company.name || "This Company",
        companyDescription: params.company.about,
        jobDescription: params.company.description,
        companyAvailableRole: params.company.role,
        jobType: params.company.jobType || "Remote",
        industry: params.company.industry || 'Technology',
        targetRole: params.company.role,
        experienceLevel: params.user.level || 'Mid-level',
        userName: params.user.name?.split(' ')[0] || 'Candidate',
        userBackground: `${params.user.level || 'Experienced'} professional with focus on ${params.user.targetRole || 'software development'}`,
        strengths: params.strengths?.slice(0, 2).join(', ') || 'Technical problem-solving',
        weaknesses: params.weaknesses?.slice(0, 1).join(', ') || 'Adding more structure to answers',
        questions: params.questions ?? [],
        numQuestions: params.questions?.length || 3,
    };
}

export function buildBehavioralContext(params: {
    company: Company;
    user: UserProfile;
    questions?: string[];
    strengths?: string[];
    weaknesses?: string[];
}): BehavioralContext {
    return {
        companyName: params.company.name,
        companyValues: params.company.culture || 'Innovation, Collaboration, Integrity',
        jobDescription: params.company.description,
        companyDescription: params.company.about,
        companyAvailableRole: params.company.role,
        jobType: params.company.jobType,
        companyCulture: params.company.culture || 'Fast-paced, supportive, and growth-oriented',
        targetRole: params.company.role,
        experienceLevel: params.user.level || 'Mid-level',
        userName: params.user.name?.split(' ')[0] || 'Candidate',
        userBackground: `${params.user.level || 'Experienced'} professional`,
        userGoal: params.user.goal || 'Advance career in tech',
        strengths: params.strengths?.slice(0, 2).join(', ') || 'Team collaboration',
        weaknesses: params.weaknesses?.slice(0, 1).join(', ') || 'Providing more specific examples',
        questions: params.questions ?? [],
        numQuestions: params.questions?.length || 3
    };
}