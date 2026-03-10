import { useState } from "react";

interface FeedbackArea {
  label: string;
  score: number;
  grade: string;
  color: string;
  insight: string;
  icon: string;
}

interface FeedbackScreenProps {
  firstName: string;
  onContinue: () => void;
  preConfidenceScore?: number | null;
  onPostConfidenceSet?: (score: number) => void;
}

function FeedbackScreen({
  firstName,
  onContinue,
  preConfidenceScore,
  onPostConfidenceSet
}: FeedbackScreenProps) {
  const [postConfidence, setPostConfidence] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const confidenceEmojis = ['😰', '😟', '😐', '🙂', '😄'];
  const confidenceLabels = [
    'Very nervous',
    'Nervous',
    'Neutral',
    'Fairly confident',
    'Very confident'];

  const handlePostConfidence = (score: number) => {
    setPostConfidence(score);
    setRatingSubmitted(true);
    onPostConfidenceSet?.(score);
  };
  const delta =
    postConfidence && preConfidenceScore ?
      postConfidence - preConfidenceScore :
      null;
  const areas: FeedbackArea[] = [
    {
      label: 'Answer Structure',
      score: 68,
      grade: 'C+',
      color: 'text-accent-500',
      insight:
        'Your answers had good content but lacked a clear beginning, middle, and end. Try the STAR framework.',
      icon: '🏗️'
    },
    {
      label: 'Communication Clarity',
      score: 74,
      grade: 'B-',
      color: 'text-yellow-500',
      insight:
        'You communicated ideas clearly but used filler words frequently. Pausing beats "um" every time.',
      icon: '🗣️'
    },
    {
      label: 'Confidence & Delivery',
      score: 61,
      grade: 'C',
      color: 'text-orange-500',
      insight:
        'Your pace was good but your voice dropped at the end of answers. Ending strong signals conviction.',
      icon: '💪'
    },
    {
      label: 'Content Depth',
      score: 79,
      grade: 'B',
      color: 'text-primary-500',
      insight:
        'Strong examples and relevant experience. Adding specific metrics would make your stories 40% more memorable.',
      icon: '🧠'
    },
    {
      label: 'Engagement & Energy',
      score: 72,
      grade: 'B-',
      color: 'text-yellow-500',
      insight:
        'You showed genuine interest but energy dipped in question 2. Consistent enthusiasm signals motivation.',
      icon: '⚡'
    }];

  const overall = Math.round(
    areas.reduce((sum, a) => sum + a.score, 0) / areas.length
  );
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-secondary-500';
    if (score >= 65) return 'text-yellow-500';
    return 'text-orange-500';
  };
  const getScoreBg = (score: number) => {
    if (score >= 80)
      return 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800';
    if (score >= 65)
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
  };
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

      {/* ── Post-session confidence check ── */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card mb-5">
        {!ratingSubmitted ?
          <>
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              How do you feel now compared to before?
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Your honest answer helps us track your progress over time.
            </p>
            <div className="flex justify-between gap-2">
              {confidenceEmojis.map((emoji, i) =>
                <button
                  key={i}
                  onClick={() => handlePostConfidence(i + 1)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group">

                  <span className="text-xl">{emoji}</span>
                  <span className="text-xs text-neutral-400 group-hover:text-primary-500 transition-colors leading-tight text-center">
                    {confidenceLabels[i]}
                  </span>
                </button>
              )}
            </div>
          </> :

          <div className="flex items-center gap-4">
            <div className="text-3xl">
              {confidenceEmojis[(postConfidence ?? 1) - 1]}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                {delta !== null && delta > 0 ?
                  `You feel ${delta} step${delta > 1 ? 's' : ''} more confident than when you started! 🎉` :
                  delta === 0 ?
                    "Your confidence held steady — that's a good sign." :
                    "Thanks for being honest. That's exactly what we'll work on."}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Response recorded · We'll track this as you practice
              </p>
            </div>
          </div>
        }
      </div>

      {/* Overall score */}
      <div className="bg-neutral-900 dark:bg-neutral-800 rounded-2xl p-5 mb-5 text-center">
        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Overall Score
        </p>
        <div className="flex items-baseline justify-center gap-2 mb-1">
          <span
            className={`font-display font-bold text-6xl ${getScoreColor(overall)}`}>

            {overall}
          </span>
          <span className="text-neutral-500 text-xl">/100</span>
        </div>
        <p className="text-neutral-400 text-sm">
          {overall >= 80 ?
            "Strong performance — let's make it exceptional." :
            overall >= 65 ?
              'Solid foundation — clear areas to sharpen.' :
              'Good start — significant room to grow with practice.'}
        </p>
      </div>

      {/* Area breakdown */}
      <div className="space-y-3 mb-6">
        {areas.map((area) =>
          <div
            key={area.label}
            className={`rounded-2xl border p-4 ${getScoreBg(area.score)}`}>

            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{area.icon}</span>
                <span className="font-display font-semibold text-sm text-neutral-900 dark:text-white">
                  {area.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1 flex-shrink-0">
                <span
                  className={`font-display font-bold text-2xl ${getScoreColor(area.score)}`}>

                  {area.score}
                </span>
                <span className="text-neutral-400 text-xs">/100</span>
              </div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
              {area.insight}
            </p>
          </div>
        )}
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
        className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors text-base shadow-soft">

        See how PrepMirrors fixes this →
      </button>
    </div>);

}

export default FeedbackScreen;