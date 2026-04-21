// frontend/src/components/onboarding/OnboardingFeedbackScreen.tsx
import { useEffect, useState } from 'react';
import { onboardingApi } from '../../../lib/api/onboarding';
import { useAuth } from '../../../lib/hooks/useAuth';
import toast from 'react-hot-toast';

// Define types directly in component to avoid import issues
interface CategoryScore {
  name: string;
  score: number;
  comment: string;
  quote?: string;
}

interface SuggestedPractice {
  title: string;
  description: string;
  url?: string;
  type: 'article' | 'video' | 'exercise' | 'course';
}

interface OnboardingFeedback {
  overall_score: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  suggested_practice: SuggestedPractice;
  finalAssessment: string;
}

interface OnboardingFeedbackScreenProps {
  firstName: string;
  preConfidenceScore?: number | null;
  onPostConfidenceSet?: (score: number) => void;
  onContinue: () => void;
}

export default function OnboardingFeedbackScreen({
  firstName,
  preConfidenceScore,
  onPostConfidenceSet,
  onContinue,
}: OnboardingFeedbackScreenProps) {
  const [postConfidence, setPostConfidence] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [isSavingConfidence, setIsSavingConfidence] = useState(false);
  const [feedbackData, setFeedbackData] = useState<OnboardingFeedback | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(true); // Start true
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchFeedback();
    }
  }, [user?.id]); // Add dependency

  const fetchFeedback = async () => {
    if (!user?.id) {
      toast.error("User not found");
      setLoadingFeedback(false);
      return;
    }

    try {
      const response = await onboardingApi.getMyFeedback(user.id);
      if (response.success && response.data) {
        setFeedbackData(response.data);
      } else {
        toast.error(response.error || "Failed to load feedback");
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error("Failed to load your feedback");
    } finally {
      setLoadingFeedback(false);
    }
  };

  const confidenceEmojis = ['😰', '😟', '😐', '🙂', '😄'];
  const confidenceLabels = [
    'Very nervous',
    'Nervous',
    'Neutral',
    'Fairly confident',
    'Very confident',
  ];

  const handlePostConfidence = async (score: number) => {
    setPostConfidence(score);
    setRatingSubmitted(true);
    setIsSavingConfidence(true);

    if (onPostConfidenceSet) {
      await onPostConfidenceSet(score);
    }

    setIsSavingConfidence(false);
  };

  const delta = postConfidence && preConfidenceScore ? postConfidence - preConfidenceScore : null;

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-emerald-600';
    if (score >= 3) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 4) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    if (score >= 3) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const overallPercent = feedbackData ? Math.round((feedbackData.overall_score / 5) * 100) : 0;
  const overallScore = feedbackData?.overall_score ?? 0;

  if (loadingFeedback) {
    return (
      <div className="max-w-lg mx-auto w-full pt-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse mx-auto mb-4" />
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mx-auto mb-2" />
          <div className="h-4 w-64 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mx-auto" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-4 animate-pulse">
              <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-2" />
              <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no feedback data, show error state
  if (!feedbackData) {
    return (
      <div className="max-w-lg mx-auto w-full pt-4 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-neutral-500 mb-6">
          We couldn't load your feedback. Please try again.
        </p>
        <button
          onClick={fetchFeedback}
          className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full pt-4 animate-slide-up">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-500 mb-2">
          Your Results
        </p>
        <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-2 leading-tight">
          Here's how you did,
          <br />
          {firstName}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          This is your baseline. PrepMirrors will help you improve every single area.
        </p>
      </div>

      {/* Post-session confidence check */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card mb-5">
        {!ratingSubmitted ? (
          <>
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              How do you feel now compared to before?
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Your honest answer helps us track your progress over time.
            </p>
            <div className="flex justify-between gap-2">
              {confidenceEmojis.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => handlePostConfidence(i + 1)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group"
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="text-xs text-neutral-400 group-hover:text-primary-500 transition-colors leading-tight text-center">
                    {confidenceLabels[i]}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-3xl">{confidenceEmojis[(postConfidence ?? 1) - 1]}</div>
            <div className="flex-1">
              <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                {isSavingConfidence ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  delta !== null && delta > 0
                    ? `You feel ${delta} step${delta > 1 ? 's' : ''} more confident than when you started! 🎉`
                    : delta === 0
                      ? "Your confidence held steady — that's a good sign."
                      : "Thanks for being honest. That's exactly what we'll work on."
                )}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Response recorded · We'll track this as you practice
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Overall score */}
      <div className="bg-neutral-900 dark:bg-neutral-800 rounded-2xl p-5 mb-5 text-center">
        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Overall Score
        </p>
        <div className="flex items-baseline justify-center gap-2 mb-1">
          <span className={`font-display font-bold text-6xl ${getScoreColor(overallScore)}`}>
            {overallPercent}
          </span>
          <span className="text-neutral-500 text-xl">/100</span>
        </div>
        <p className="text-neutral-400 text-sm">
          {overallScore >= 4
            ? "Strong performance — let's make it exceptional."
            : overallScore >= 3
              ? 'Solid foundation — clear areas to sharpen.'
              : 'Good start — significant room to grow with practice.'}
        </p>
      </div>

      {/* Category Scores */}
      <div className="space-y-3 mb-6">
        {feedbackData.categoryScores.map((cat, idx) => (
          <div key={idx} className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-neutral-900 dark:text-white">{cat.name}</h3>
              <div className={`px-2 py-1 rounded-full text-sm font-bold ${getScoreColor(cat.score)}`}>
                {Math.round((cat.score / 5) * 100)}/100
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{cat.comment}</p>
            {cat.quote && (
              <div className="bg-neutral-100 dark:bg-neutral-700/50 rounded-lg p-2 mt-2">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                  💬 "{cat.quote}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Strengths & Areas */}
      <div className="grid gap-3 mb-6">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">💪 Strengths</p>
          <ul className="space-y-1">
            {feedbackData.strengths.map((s, i) => (
              <li key={i} className="text-xs text-emerald-700 dark:text-emerald-300">• {s}</li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">📈 Areas to Improve</p>
          <ul className="space-y-1">
            {feedbackData.areasForImprovement.map((a, i) => (
              <li key={i} className="text-xs text-amber-700 dark:text-amber-300">• {a}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Practice */}
      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-4 mb-6 border border-primary-200 dark:border-primary-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🎯</span>
          <h3 className="font-semibold text-primary-800 dark:text-primary-300">Recommended Practice</h3>
        </div>
        <p className="font-medium text-primary-700 dark:text-primary-300 text-sm">{feedbackData.suggested_practice.title}</p>
        <p className="text-primary-600 dark:text-primary-400 text-sm mt-1">{feedbackData.suggested_practice.description}</p>
        {feedbackData.suggested_practice.url && (
          <a
            href={feedbackData.suggested_practice.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs text-primary-500 hover:underline"
          >
            📚 {feedbackData.suggested_practice.type === 'article' ? 'Read Article' :
              feedbackData.suggested_practice.type === 'video' ? 'Watch Video' :
                feedbackData.suggested_practice.type === 'course' ? 'Take Course' : 'Try Exercise'} →
          </a>
        )}
      </div>

      {/* Final Assessment */}
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-4 mb-6">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">
          "{feedbackData.finalAssessment}"
        </p>
      </div>

      {/* Key takeaway */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-4 mb-6">
        <p className="font-display font-semibold text-primary-700 dark:text-primary-300 text-sm mb-1">
          💡 The good news
        </p>
        <p className="text-primary-600 dark:text-primary-400 text-sm leading-relaxed">
          Every single area you scored below 80 is directly trainable with PrepMirrors.
          Consistent, focused practice is how candidates go from good to genuinely exceptional — and that's exactly what we're here to help you do.
        </p>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors text-base shadow-soft"
      >
        See how PrepMirrors fixes this →
      </button>
    </div>
  );
}