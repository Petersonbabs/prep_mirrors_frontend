// frontend/src/components/feedback/FeedbackDisplay.tsx
import { useState } from 'react';
import {
    StarIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    LightbulbIcon,
    TrendingUpIcon,
    TargetIcon,
    MicIcon,
    BrainIcon,
    UsersIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ThumbsUpIcon,
    ThumbsDownIcon,
    BookOpenIcon,
    VideoIcon,
    ClipboardListIcon,
} from 'lucide-react';
import { Feedback } from '../../../lib/types';



interface FeedbackDisplayProps {
    feedback: Feedback;
    question: string;
    onImprove?: () => void;
    onNext?: () => void;
}

export default function FeedbackDisplay({ feedback, question, onImprove, onNext }: FeedbackDisplayProps) {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const getScoreColor = (score: number) => {
        if (score >= 4) return 'text-emerald-600 bg-emerald-100';
        if (score >= 3) return 'text-amber-600 bg-amber-100';
        return 'text-red-600 bg-red-100';
    };

    const getScoreIcon = (score: number) => {
        if (score >= 4) return <ThumbsUpIcon className="w-4 h-4" />;
        if (score >= 3) return <TrendingUpIcon className="w-4 h-4" />;
        return <ThumbsDownIcon className="w-4 h-4" />;
    };

    const breakdownSections = [
        {
            id: 'structure',
            title: 'Answer Structure',
            icon: ClipboardListIcon,
            data: feedback.breakdown.structure as { score: number; feedback: string; example: string },
            color: 'blue',
        },
        {
            id: 'technical',
            title: 'Technical Accuracy',
            icon: BrainIcon,
            data: feedback.breakdown.technical_accuracy,
            color: 'purple',
        },
        {
            id: 'communication',
            title: 'Communication',
            icon: MicIcon,
            data: feedback.breakdown.communication,
            color: 'green',
        },
        {
            id: 'engagement',
            title: 'Engagement',
            icon: UsersIcon,
            data: feedback.breakdown.engagement,
            color: 'orange',
        },
    ];

    return (
        <div className="max-w-4xl mx-auto  md:p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Interview Feedback</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">Here's how you did on your answer</p>
            </div>

            {/* Overall Score Card */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-4 md:p-6 text-white">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div>
                        <p className="text-primary-100 text-sm">Overall Score</p>
                        <p className="text-5xl font-bold">{feedback.overall_score}/5</p>
                    </div>
                    <div className="text-right">
                        <p className="text-primary-100 text-sm hidden sm:block">Performance</p>
                        <p className={`text-xl font-semibold ${getScoreColor(feedback.overall_score)}`}>
                            {feedback.overall_score >= 4 ? 'Excellent!' : feedback.overall_score >= 3 ? 'Good Job!' : 'Needs Practice'}
                        </p>
                    </div>
                </div>
                <p className="mt-4 text-primary-50 text-sm">{feedback.overall_feedback}</p>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Quality', value: feedback.quality, icon: StarIcon },
                    { label: 'Depth', value: feedback.depth, icon: BrainIcon },
                    { label: 'Clarity', value: feedback.clarity, icon: TargetIcon },
                    { label: 'Confidence', value: feedback.confidence, icon: TrendingUpIcon },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-neutral-800 rounded-xl p-3 text-center shadow-sm">
                        <stat.icon className="w-5 h-5 mx-auto mb-1 text-neutral-400" />
                        <p className="text-2xl font-bold">{stat.value}/5</p>
                        <p className="text-xs text-neutral-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Breakdown Sections */}
            <div className="space-y-3">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Detailed Analysis</h3>
                {breakdownSections.map((section) => {
                    const Icon = section.icon;
                    const isExpanded = expandedSection === section.id;
                    const scoreColor = getScoreColor(section.data.score);

                    return (
                        <div
                            key={section.id}
                            className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
                        >
                            <button
                                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                                className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${scoreColor}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-neutral-900 dark:text-white">{section.title}</p>
                                        <p className="text-sm text-neutral-500">{section.data.feedback.substring(0, 60)}...</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`px-2 py-1 rounded-full text-sm font-bold ${scoreColor}`}>
                                        {section.data.score}/5
                                    </div>
                                    {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-neutral-400" /> : <ChevronDownIcon className="w-5 h-5 text-neutral-400" />}
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="p-4 border-t border-neutral-100 dark:border-neutral-700 space-y-3">
                                    {/* Full feedback */}
                                    <div>
                                        <p className="text-sm text-neutral-700 dark:text-neutral-300">{section.data.feedback}</p>
                                    </div>

                                    {/* Specific example if available */}
                                    {section.id === 'structure' && section.data.example  && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">✨ Example</p>
                                            <p className="text-sm text-neutral-700 dark:text-neutral-300">"{section.data.example}"</p>
                                        </div>
                                    )}

                                    {/* Missing points for technical accuracy */}
                                    {section.id === 'technical' && section.data.missing_points && section.data.missing_points.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-amber-600 mb-1">📌 Points to include</p>
                                            <ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400">
                                                {section.data.missing_points.map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Filler words for communication */}
                                    {section.id === 'communication' && section.data.filler_words && section.data.filler_words.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-amber-600 mb-1">🗣️ Watch out for filler words</p>
                                            <div className="flex flex-wrap gap-2">
                                                {section.data.filler_words.map((word, i) => (
                                                    <span key={i} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full">
                                                        {word}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Strengths & Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <ThumbsUpIcon className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-semibold text-emerald-800 dark:text-emerald-400">Strengths</h3>
                    </div>
                    <ul className="space-y-2">
                        {feedback.strengths.map((strength, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                                <CheckCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircleIcon className="w-5 h-5 text-amber-600" />
                        <h3 className="font-semibold text-amber-800 dark:text-amber-400">Areas to Improve</h3>
                    </div>
                    <ul className="space-y-2">
                        {feedback.areas_for_improvement.map((area, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
                                <AlertCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{area}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* What You Said vs Better Example */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4">
                    <p className="text-xs font-medium text-neutral-500 mb-2">📝 What you said</p>
                    <p className="text-sm italic text-neutral-700 dark:text-neutral-300">"{feedback.what_you_said}"</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                    <p className="text-xs font-medium text-emerald-600 mb-2">⭐ Stronger version</p>
                    <p className="text-sm italic text-emerald-700 dark:text-emerald-300">"{feedback.better_example}"</p>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <LightbulbIcon className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-primary-800 dark:text-primary-400">Quick Tips to Improve</h3>
                </div>
                <ul className="space-y-2">
                    {feedback.quick_tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-primary-700 dark:text-primary-300">
                            <span className="w-5 h-5 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {i + 1}
                            </span>
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Suggested Practice */}
            {feedback.suggested_practice && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <ClipboardListIcon className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-800 dark:text-purple-400">Practice Suggestion</h3>
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">{feedback.suggested_practice}</p>
                </div>
            )}

            {/* Recommended Resources */}
            {feedback.recommended_resources && feedback.recommended_resources.length > 0 && (
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">📚 Recommended Resources</h3>
                    <div className="space-y-2">
                        {feedback.recommended_resources.map((resource, i) => (
                            <div key={i} className="flex items-center gap-3">
                                {resource.type === 'article' && <BookOpenIcon className="w-4 h-4 text-neutral-500" />}
                                {resource.type === 'video' && <VideoIcon className="w-4 h-4 text-neutral-500" />}
                                {resource.type === 'exercise' && <ClipboardListIcon className="w-4 h-4 text-neutral-500" />}
                                <span className="text-sm text-neutral-700 dark:text-neutral-300">{resource.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                {onImprove && (
                    <button
                        onClick={onImprove}
                        className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
                    >
                        Practice with Coach Mira
                    </button>
                )}
                {onNext && (
                    <button
                        onClick={onNext}
                        className="flex-1 py-3 
                         bg-primary-500 hover:bg-primary-600 font-semibold rounded-xl transition-colors"
                    >
                        Continue
                    </button>
                )}
            </div>
        </div>
    );
}