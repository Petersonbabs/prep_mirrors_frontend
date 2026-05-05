// frontend/src/components/interview/InterviewFeedback.tsx

import { useState } from 'react';
import { Star, TrendingUp, Target, Brain, Mic, Users, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react';

// ✅ Define the category scores type
type CategoryScores = {
    communication: number;
    technical_accuracy: number;
    problem_solving: number;
    clarity: number;
    confidence: number;
};

// ✅ Define the category keys
type CategoryKey = keyof CategoryScores;

// ✅ Define category config with proper typing
const categoryConfig: Record<CategoryKey, { label: string; icon: string; color: string }> = {
    communication: { label: 'Communication', icon: '💬', color: 'blue' },
    technical_accuracy: { label: 'Technical Depth', icon: '⚙️', color: 'purple' },
    problem_solving: { label: 'Problem Solving', icon: '🧩', color: 'green' },
    clarity: { label: 'Clarity', icon: '🎯', color: 'yellow' },
    confidence: { label: 'Confidence', icon: '💪', color: 'orange' },
};

interface InterviewFeedbackProps {
    phase: 'technical' | 'behavioral';
    companyName: string;
    feedback: {
        overall_score: number;
        category_scores: CategoryScores;
        strengths: string[];
        improvements: string[];
        specific_feedback: Array<{
            question: string;
            answer: string;
            feedback: string;
            score: number;
        }>;
        suggested_practice: string;
    };
    questions: string[];
    onContinue: () => void;
    onBack?: () => void;
}

export default function InterviewFeedback({ phase, companyName, feedback, questions, onContinue, onBack }: InterviewFeedbackProps) {
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

    if (!feedback) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400">Analyzing your answers...</p>
                </div>
            </div>
        );
    }

    // ✅ Calculate overall score safely
    const overallScore = feedback.overall_score ||
        Object.values(feedback.category_scores).reduce((a, b) => a + b, 0) / 5;

    const overallPercent = Math.round(overallScore * 20);

    // ✅ Helper function to get score color based on value
    const getScoreColor = (score: number) => {
        if (score >= 4) return 'text-emerald-400';
        if (score >= 3) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBg = (score: number) => {
        if (score >= 4) return 'bg-emerald-500/20';
        if (score >= 3) return 'bg-yellow-500/20';
        return 'bg-red-500/20';
    };

    return (
        <div className="min-h-screen bg-neutral-950 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
                        <Star className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-primary-400">{phase === 'technical' ? 'Technical' : 'Behavioral'} Round Complete</span>
                    </div>
                    <h1 className="font-display font-bold text-3xl text-white mb-2">
                        {companyName} Interview Feedback
                    </h1>
                    <p className="text-neutral-400">Here's how you performed in the {phase} round</p>
                </div>

                {/* Overall Score */}
                <div className="bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl p-6 text-center mb-6 border border-primary-500/20">
                    <p className="text-neutral-400 text-sm mb-2">Overall Score</p>
                    <div className="text-6xl font-bold text-white mb-2">{overallPercent}</div>
                    <p className="text-xs text-neutral-500">/100</p>
                    <div className="w-full bg-neutral-700 rounded-full h-2 mt-4">
                        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${overallPercent}%` }} />
                    </div>
                </div>

                {/* Category Scores - ✅ Fixed type issue */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                    {(Object.keys(categoryConfig) as CategoryKey[]).map((key) => {
                        const score = feedback.category_scores[key];
                        const config = categoryConfig[key];
                        return (
                            <div key={key} className="bg-neutral-800/50 rounded-xl p-3 text-center">
                                <span className="text-xl mb-2 block">{config.icon}</span>
                                <p className={`text-2xl font-bold ${getScoreColor(score)}`}>{Math.round(score * 20)}</p>
                                <p className="text-xs text-neutral-500">{config.label}</p>
                                <div className="w-full bg-neutral-700 rounded-full h-1 mt-2">
                                    <div className={`${getScoreBg(score)} h-1 rounded-full transition-all duration-700`} style={{ width: `${score * 20}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Strengths */}
                {feedback.strengths?.length > 0 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 mb-6">
                        <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            What You Did Well
                        </h3>
                        <ul className="space-y-2">
                            {feedback.strengths.map((strength, i) => (
                                <li key={i} className="flex items-start gap-2 text-neutral-300">
                                    <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Areas to Improve */}
                {feedback.improvements?.length > 0 && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 mb-6">
                        <h3 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Areas to Improve
                        </h3>
                        <ul className="space-y-2">
                            {feedback.improvements.map((improvement, i) => (
                                <li key={i} className="flex items-start gap-2 text-neutral-300">
                                    <ChevronRight className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                    <span>{improvement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Question-by-Question Breakdown */}
                {feedback.specific_feedback?.length > 0 && (
                    <div className="space-y-4 mb-8">
                        <h3 className="font-semibold text-white">Question Breakdown</h3>
                        {feedback.specific_feedback.map((item, i) => (
                            <div key={i} className="bg-neutral-800/30 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}
                                    className="w-full text-left p-4 flex items-center justify-between hover:bg-neutral-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${item.score >= 4 ? 'bg-emerald-500/20 text-emerald-400' :
                                                item.score >= 3 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {Math.round(item.score * 20)}
                                        </div>
                                        <span className="text-sm font-medium text-white line-clamp-1">
                                            Question {i + 1}
                                        </span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${expandedQuestion === i ? 'rotate-90' : ''}`} />
                                </button>

                                {expandedQuestion === i && (
                                    <div className="p-4 pt-0 border-t border-neutral-700/50">
                                        <p className="text-sm text-primary-400 mb-2">Question:</p>
                                        <p className="text-sm text-neutral-300 mb-4">{questions[i]}</p>
                                        <p className="text-sm text-primary-400 mb-2">Your Answer:</p>
                                        <p className="text-sm text-neutral-300 mb-4 italic">{item.answer || 'Answer captured via voice'}</p>
                                        <p className="text-sm text-primary-400 mb-2">Feedback:</p>
                                        <p className="text-sm text-neutral-300">{item.feedback}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Suggested Practice */}
                {feedback.suggested_practice && (
                    <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-5 mb-6">
                        <h3 className="font-semibold text-primary-400 mb-2 flex items-center gap-2">
                            📚 Suggested Practice
                        </h3>
                        <p className="text-neutral-300 text-sm">{feedback.suggested_practice}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            ← Retry
                        </button>
                    )}
                    <button
                        onClick={onContinue}
                        className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        Continue to Coach Mira
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}