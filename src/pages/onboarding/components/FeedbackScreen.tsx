// frontend/src/components/onboarding/OnboardingFeedbackScreen.tsx
import { useState } from 'react';

interface QuestionFeedback {
  question_text: string;
  score: number;
  key_strength: string;
  key_improvement: string;
  reference_to_answer: string;
}

interface OnboardingFeedbackScreenProps {
  firstName: string;
  overallScore: number;
  weakestQuestionIndex: number;
  questionsFeedback: QuestionFeedback[];
  overallAdvice: string;
  suggestedPractice: string;
  preConfidenceScore?: number | null;
  onPostConfidenceSet?: (score: number) => void;
  onContinue: () => void;
  isLoading?: boolean;
}

export default function OnboardingFeedbackScreen({
  firstName,
  overallScore,
  weakestQuestionIndex,
  questionsFeedback,
  overallAdvice,
  suggestedPractice,
  preConfidenceScore,
  onPostConfidenceSet,
  onContinue,
  isLoading = false
}: OnboardingFeedbackScreenProps) {
  const [postConfidence, setPostConfidence] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const confidenceEmojis = ['😰', '😟', '😐', '🙂', '😄'];
  const confidenceLabels = [
    'Very nervous',
    'Nervous',
    'Neutral',
    'Fairly confident',
    'Very confident',
  ];

  const handlePostConfidence = (score: number) => {
    setPostConfidence(score);
    setRatingSubmitted(true);
    onPostConfidenceSet?.(score);
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

  const overallPercent = Math.round((overallScore / 5) * 100);

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto w-full pt-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse mx-auto mb-4" />
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mx-auto mb-2" />
          <div className="h-4 w-64 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mx-auto" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-4 animate-pulse">
              <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-2" />
              <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto w-full pt-4 animate-slide-up">
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
          This is your baseline. PrepMirrors will help you improve every single
          area.
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
                {delta !== null && delta > 0
                  ? `You feel ${delta} step${delta > 1 ? 's' : ''} more confident than when you started! 🎉`
                  : delta === 0
                    ? "Your confidence held steady — that's a good sign."
                    : "Thanks for being honest. That's exactly what we'll work on."}
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

      {/* Question breakdown */}
      <div className="space-y-3 mb-6">
        {questionsFeedback.map((q, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-4 ${idx === weakestQuestionIndex
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : getScoreBg(q.score)
              }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{idx === weakestQuestionIndex ? '⚠️' : '📌'}</span>
                <span className="font-display font-semibold text-sm text-neutral-900 dark:text-white">
                  Question {idx + 1}
                </span>
              </div>
              <div className="flex items-baseline gap-1 flex-shrink-0">
                <span className={`font-display font-bold text-2xl ${getScoreColor(q.score)}`}>
                  {Math.round((q.score / 5) * 100)}
                </span>
                <span className="text-neutral-400 text-xs">/100</span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mb-2 line-clamp-2">{q.question_text}</p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                💪 {q.key_strength}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                📈 {q.key_improvement}
              </p>
              <p className="text-xs text-neutral-500 italic">
                📝 "{q.reference_to_answer}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Weakest question focus */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6">
        <p className="font-semibold text-red-700 dark:text-red-400 text-sm mb-1">
          🎯 Your biggest opportunity
        </p>
        <p className="text-red-600 dark:text-red-300 text-sm">{overallAdvice}</p>
        <p className="text-red-500 dark:text-red-400 text-xs mt-2">💡 Try this: {suggestedPractice}</p>
      </div>

      {/* Key takeaway */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-4 mb-6">
        <p className="font-display font-semibold text-primary-700 dark:text-primary-300 text-sm mb-1">
          💡 The good news
        </p>
        <p className="text-primary-600 dark:text-primary-400 text-sm leading-relaxed">
          Every single area you scored below 80 is directly trainable with
          PrepMirrors. Consistent, focused practice is how candidates go from
          good to genuinely exceptional — and that's exactly what we're here to
          help you do.
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