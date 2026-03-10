import React, { useState, memo } from 'react';
import {
  StarIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  MessageSquareIcon,
  HomeIcon,
  ThumbsUpIcon,
  AlertCircleIcon,
  LightbulbIcon,
  LayoutListIcon,
  MicIcon,
  ZapIcon,
  BrainIcon,
  SparklesIcon,
  QuoteIcon,
  ChevronRightIcon } from
'lucide-react';
import { InterviewData } from '../App';
interface FeedbackPageProps {
  interview: InterviewData;
  phase: 'technical' | 'behavioral';
  feedbackData: {
    question: string;
    answer: string;
  };
  onImprove: () => void;
  onNextPhase: () => void;
  onDashboard: () => void;
}
// ─── Data ─────────────────────────────────────────────────────────────────────
interface FeedbackArea {
  id: string;
  icon: React.ReactNode;
  label: string;
  score: number;
  grade: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  barColor: string;
  summary: string;
  insight: string;
  whatYouSaid: string;
  betterExample: string;
  tips: string[];
}
const FEEDBACK_AREAS: FeedbackArea[] = [
{
  id: 'structure',
  icon: <LayoutListIcon className="w-4 h-4" />,
  label: 'Answer Structure',
  score: 68,
  grade: 'C+',
  accentColor: '#f59e0b',
  bgColor: 'bg-amber-50 dark:bg-amber-900/15',
  borderColor: 'border-amber-200 dark:border-amber-800',
  textColor: 'text-amber-600 dark:text-amber-400',
  barColor: 'bg-amber-400',
  summary: 'Good content but lacked a clear framework.',
  insight:
  'Your answer contained relevant information but jumped between points without a clear narrative arc. Interviewers score structure heavily because it signals how you think under pressure. A well-structured answer shows you can organize complex information quickly — a critical skill in any role.',
  whatYouSaid:
  '"I worked on a project where we had to optimize the database... it was pretty complex and we used several techniques... the team was involved and we eventually got it working better."',
  betterExample:
  '"Situation: Our checkout database was timing out under peak load, causing a 12% cart abandonment rate. Task: I was asked to lead the optimization effort. Action: I profiled queries, identified 3 N+1 problems, added targeted indexes, and introduced Redis caching for product data. Result: Query time dropped 84%, abandonment fell to 3%, and we saved an estimated $40K/month in lost revenue."',
  tips: [
  'Use the STAR framework: Situation → Task → Action → Result',
  'Open with a one-sentence summary of the outcome',
  'Keep each section to 2–3 sentences max']

},
{
  id: 'clarity',
  icon: <MicIcon className="w-4 h-4" />,
  label: 'Communication Clarity',
  score: 74,
  grade: 'B-',
  accentColor: '#3b82f6',
  bgColor: 'bg-blue-50 dark:bg-blue-900/15',
  borderColor: 'border-blue-200 dark:border-blue-800',
  textColor: 'text-blue-600 dark:text-blue-400',
  barColor: 'bg-blue-400',
  summary: 'Clear ideas, but filler words reduced impact.',
  insight:
  'You communicated your core ideas clearly and at a good pace. However, filler words like "um", "like", and "you know" appeared frequently — roughly every 15 seconds. These erode perceived confidence even when your content is strong. The good news: this is one of the fastest things to fix with deliberate practice.',
  whatYouSaid:
  '"So, um, basically what we did was, like, we looked at the problem and, you know, tried a few different approaches until we kind of figured out what worked..."',
  betterExample:
  '"We evaluated three approaches: rewriting the query, adding an index, and caching. After benchmarking each, we chose caching — it gave us the best performance gain with the least risk to existing functionality."',
  tips: [
  'Replace filler words with a deliberate pause — silence reads as confidence',
  'Practice recording yourself and counting fillers per minute',
  'Slow down by 20% — rushing triggers more filler words']

},
{
  id: 'confidence',
  icon: <ZapIcon className="w-4 h-4" />,
  label: 'Confidence & Delivery',
  score: 61,
  grade: 'C',
  accentColor: '#ef4444',
  bgColor: 'bg-red-50 dark:bg-red-900/15',
  borderColor: 'border-red-200 dark:border-red-800',
  textColor: 'text-red-600 dark:text-red-400',
  barColor: 'bg-red-400',
  summary: 'Voice dropped at key moments — end stronger.',
  insight:
  'Your opening was solid, but your energy and vocal projection dropped noticeably toward the end of each answer — exactly when interviewers are forming their final impression. Ending with a strong, declarative statement signals conviction and ownership. This is the area with the highest ROI for your next interview.',
  whatYouSaid:
  '"...and I think that was probably the right approach, maybe. It seemed to work out okay, I guess."',
  betterExample:
  '"That decision directly contributed to a 40% reduction in support tickets. I\'d make the same call again — and I\'d move faster."',
  tips: [
  'End every answer with a declarative statement, never a question or hedge',
  'Avoid "I think", "maybe", "I guess" — replace with "I believe" or just state it',
  'Maintain eye contact and upright posture through the final word']

},
{
  id: 'depth',
  icon: <BrainIcon className="w-4 h-4" />,
  label: 'Content Depth',
  score: 79,
  grade: 'B',
  accentColor: '#6366f1',
  bgColor: 'bg-indigo-50 dark:bg-indigo-900/15',
  borderColor: 'border-indigo-200 dark:border-indigo-800',
  textColor: 'text-indigo-600 dark:text-indigo-400',
  barColor: 'bg-indigo-400',
  summary: 'Strong examples — add metrics to make them land.',
  insight:
  'You demonstrated genuine domain knowledge and drew on relevant experience. Your examples were credible and specific. The gap between a B and an A here is quantification — interviewers remember numbers. Specific metrics make your stories 40% more memorable and signal that you think in terms of outcomes, not just activities.',
  whatYouSaid:
  '"We improved the performance significantly and the team was really happy with the results. It made a big difference to the product."',
  betterExample:
  '"We reduced API response time from 1.8s to 340ms — a 5× improvement. That directly lifted our conversion rate by 8%, which translated to roughly $200K in additional annual revenue."',
  tips: [
  'Prepare at least 3 metrics for every major project you might discuss',
  'If you don\'t have exact numbers, use ranges: "roughly 40–50% faster"',
  'Connect technical metrics to business outcomes whenever possible']

},
{
  id: 'engagement',
  icon: <SparklesIcon className="w-4 h-4" />,
  label: 'Engagement & Energy',
  score: 72,
  grade: 'B-',
  accentColor: '#10b981',
  bgColor: 'bg-emerald-50 dark:bg-emerald-900/15',
  borderColor: 'border-emerald-200 dark:border-emerald-800',
  textColor: 'text-emerald-600 dark:text-emerald-400',
  barColor: 'bg-emerald-400',
  summary: 'Genuine interest shown — energy dipped in Q2.',
  insight:
  "You showed authentic enthusiasm in your opening and closing, which interviewers notice and value. However, your energy dipped significantly during the second question — a common pattern when candidates hit a topic they're less comfortable with. Consistent energy throughout signals motivation and resilience, both of which are hiring signals.",
  whatYouSaid:
  "\"That's an interesting question... [long pause] ...I suppose I've dealt with something like that before, it wasn't the most exciting project but...\"",
  betterExample:
  '"That\'s actually one of my favorite types of problem to work on. Here\'s a situation where I had to navigate something similar — and what I learned from it changed how I approach this kind of challenge entirely."',
  tips: [
  'Reframe every question as an opportunity, not a test — your mindset shows',
  'Prepare a "bridge" phrase for topics you\'re less confident in',
  'Smile slightly when you start answering — it physically shifts your energy']

}];

const MOCK_FEEDBACK = {
  score: 71,
  strengths: [
  'Relevant experience and credible examples',
  'Good pacing and natural conversational tone',
  'Showed genuine interest in the role']

};
// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: {score: number;}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - score / 100 * circumference;
  const color = score >= 80 ? '#10B981' : score >= 65 ? '#F59E0B' : '#EF4444';
  const label = score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : 'Needs Work';
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="8"
            className="dark:stroke-neutral-700" />

          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />

        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-2xl text-neutral-900 dark:text-white">
            {score}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            /100
          </span>
        </div>
      </div>
      <span
        className="mt-1.5 text-xs font-semibold"
        style={{
          color
        }}>

        {label}
      </span>
    </div>);

}
// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score, barColor }: {score: number;barColor: string;}) {
  return (
    <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${barColor}`}
        style={{
          width: `${score}%`
        }} />

    </div>);

}
// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({
  area,
  userAnswer



}: {area: FeedbackArea;userAnswer: string;}) {
  return (
    <div className="flex flex-col gap-5 animate-fade-in" key={area.id}>
      {/* Area header */}
      <div
        className={`rounded-2xl p-5 border ${area.bgColor} ${area.borderColor}`}>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div
              className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${area.textColor} mb-2`}>

              <span>{area.icon}</span>
              <span>{area.label}</span>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
              {area.insight}
            </p>
          </div>
          <div className="flex-shrink-0 text-center">
            <div
              className={`text-3xl font-display font-bold ${area.textColor}`}>

              {area.score}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              /100
            </div>
            <div className={`text-sm font-bold mt-0.5 ${area.textColor}`}>
              {area.grade}
            </div>
          </div>
        </div>
      </div>

      {/* What you said */}
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2 mb-3">
          <QuoteIcon className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
          <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
            What you said
          </h4>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic border-l-2 border-neutral-300 dark:border-neutral-600 pl-3">
          {area.whatYouSaid}
        </p>
      </div>

      {/* Better example */}
      <div className="bg-white dark:bg-neutral-800/80 rounded-2xl p-5 border-2 border-dashed border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
            <CheckIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Stronger version
          </h4>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed border-l-2 border-emerald-300 dark:border-emerald-700 pl-3">
          {area.betterExample}
        </p>
      </div>

      {/* Tips */}
      <div className="bg-primary-50 dark:bg-primary-900/15 rounded-2xl p-5 border border-primary-100 dark:border-primary-800">
        <div className="flex items-center gap-2 mb-3">
          <LightbulbIcon className="w-4 h-4 text-primary-500 flex-shrink-0" />
          <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wider">
            How to fix it
          </h4>
        </div>
        <div className="space-y-2">
          {area.tips.map((tip, i) =>
          <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                  {i + 1}
                </span>
              </div>
              <p className="text-sm text-primary-700 dark:text-primary-300 leading-relaxed">
                {tip}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>);

}
// ─── Main Page ────────────────────────────────────────────────────────────────
export function FeedbackPage({
  interview,
  phase,
  feedbackData,
  onImprove,
  onNextPhase,
  onDashboard
}: FeedbackPageProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    FEEDBACK_AREAS[0].id
  );
  const isLastPhase = phase === 'behavioral';
  const selectedArea =
  FEEDBACK_AREAS.find((a) => a.id === selectedAreaId) ?? FEEDBACK_AREAS[0];
  const overallScore = Math.round(
    FEEDBACK_AREAS.reduce((sum, a) => sum + a.score, 0) / FEEDBACK_AREAS.length
  );
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onDashboard}
            className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">

            <ArrowLeftIcon className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            {phase === 'technical' ? '⚙️ Technical' : '🤝 Behavioral'} Feedback
          </span>
          <div className="w-20" />
        </div>

        {/* ── Celebration banner ── */}
        <div className="bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl p-5 text-white mb-6 relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 right-0 text-7xl opacity-10 -mt-3 -mr-3 select-none">
            🎉
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎊</span>
            <div>
              <h2 className="font-display font-bold text-xl">
                Interview Complete!
              </h2>
              <p className="text-white/80 text-sm">
                You completed the {phase} round for {interview.company}. Here's
                your detailed feedback.
              </p>
            </div>
          </div>
        </div>

        {/* ── Top summary row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Score card */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card flex items-center gap-5">
            <ScoreRing score={overallScore} />
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white mb-0.5">
                Overall Score
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                {interview.role} · {interview.company}
              </p>
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((i) =>
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${i <= Math.round(overallScore / 20) ? 'text-amber-400 fill-amber-400' : 'text-neutral-300 dark:text-neutral-600'}`} />

                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Better than 65% of candidates
              </p>
            </div>
          </div>

          {/* Question reviewed */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card">
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
              Question Reviewed
            </p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium line-clamp-3">
              "{feedbackData.question}"
            </p>
          </div>
        </div>

        {/* ── Master-Detail Layout ── */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* LEFT — Feedback area cards */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
                <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Feedback Areas
                </p>
              </div>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
                {FEEDBACK_AREAS.map((area) => {
                  const isSelected = selectedAreaId === area.id;
                  return (
                    <button
                      key={area.id}
                      onClick={() => setSelectedAreaId(area.id)}
                      className={`w-full text-left px-4 py-3.5 transition-all duration-200 group relative ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50'}`}>

                      {/* Selected indicator bar */}
                      {isSelected &&
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-500 rounded-r-full" />
                      }

                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400' : `${area.bgColor} ${area.textColor}`}`}>

                          {area.icon}
                        </div>

                        {/* Label + bar */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-sm font-semibold truncate ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-300'}`}>

                              {area.label}
                            </span>
                            <span
                              className={`text-xs font-bold ml-2 flex-shrink-0 ${isSelected ? 'text-primary-600 dark:text-primary-400' : area.textColor}`}>

                              {area.score}
                            </span>
                          </div>
                          <ScoreBar
                            score={area.score}
                            barColor={
                            isSelected ? 'bg-primary-400' : area.barColor
                            } />

                        </div>

                        {/* Arrow */}
                        <ChevronRightIcon
                          className={`w-3.5 h-3.5 flex-shrink-0 transition-all ${isSelected ? 'text-primary-500 translate-x-0.5' : 'text-neutral-300 dark:text-neutral-600'}`} />

                      </div>
                    </button>);

                })}
              </div>

              {/* Strengths footer */}
              <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-700 bg-emerald-50 dark:bg-emerald-900/10">
                <div className="flex items-center gap-1.5 mb-2">
                  <ThumbsUpIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Top Strengths
                  </p>
                </div>
                <div className="space-y-1">
                  {MOCK_FEEDBACK.strengths.map((s, i) =>
                  <div key={i} className="flex items-start gap-1.5">
                      <CheckIcon className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                        {s}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Detail panel */}
          <div className="flex-1 min-w-0">
            <DetailPanel area={selectedArea} userAnswer={feedbackData.answer} />
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onImprove}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-2xl transition-colors shadow-soft">

            <MessageSquareIcon className="w-5 h-5" />
            <span>Improve with AI Coach</span>
          </button>

          {!isLastPhase ?
          <button
            onClick={onNextPhase}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-2xl transition-colors">

              <span>Continue to Behavioral Round</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button> :

          <button
            onClick={onDashboard}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">

              <HomeIcon className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          }
        </div>
      </div>
    </div>);

}