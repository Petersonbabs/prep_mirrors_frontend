import { useState } from 'react';
import {
  TrophyIcon,
  PlayIcon,
  MapPinIcon,
  BriefcaseIcon,
  DollarSignIcon,
  CalendarIcon,
  ZapIcon,
  Loader2
} from 'lucide-react';
import { DashboardWalkthrough } from '../components/DashboardWalkthrough';
import { useAuth } from '../lib/hooks/useAuth';
import { InterviewData, Page } from '../App';

interface DashboardPageProps {
  onStartInterview: (interview: InterviewData) => void;
  onNavigate: (page: Page) => void;
  showWalkthrough?: boolean;
  onWalkthroughComplete?: () => void;
}
const MOCK_INTERVIEWS: InterviewData[] = [
  {
    id: '1',
    company: 'Google',
    role: 'Software Engineer II',
    salary: '$180,000 – $240,000',
    jobType: 'Full-time',
    location: 'Mountain View, CA (Hybrid)',
    phase: 'technical',
    difficulty: 'Hard',
    logo: 'G'
  },
  {
    id: '2',
    company: 'Stripe',
    role: 'Software Engineer',
    salary: '$160,000 – $200,000',
    jobType: 'Full-time',
    location: 'San Francisco, CA (Remote)',
    phase: 'technical',
    difficulty: 'Medium',
    logo: 'S'
  },
  {
    id: '3',
    company: 'Airbnb',
    role: 'Frontend Engineer',
    salary: '$150,000 – $190,000',
    jobType: 'Full-time',
    location: 'San Francisco, CA (Hybrid)',
    phase: 'technical',
    difficulty: 'Medium',
    logo: 'A'
  },
  {
    id: '4',
    company: 'Meta',
    role: 'Software Engineer',
    salary: '$190,000 – $260,000',
    jobType: 'Full-time',
    location: 'Menlo Park, CA (On-site)',
    phase: 'technical',
    difficulty: 'Hard',
    logo: 'M'
  },
  {
    id: '5',
    company: 'Notion',
    role: 'Software Engineer',
    salary: '$140,000 – $175,000',
    jobType: 'Full-time',
    location: 'New York, NY (Remote)',
    phase: 'technical',
    difficulty: 'Easy',
    logo: 'N'
  },
  {
    id: '6',
    company: 'Linear',
    role: 'Full Stack Engineer',
    salary: '$130,000 – $165,000',
    jobType: 'Full-time',
    location: 'Remote',
    phase: 'technical',
    difficulty: 'Medium',
    logo: 'L'
  }];

const COMPANY_COLORS: Record<string, string> = {
  G: 'bg-blue-500',
  S: 'bg-indigo-500',
  A: 'bg-rose-500',
  M: 'bg-blue-600',
  N: 'bg-neutral-800',
  L: 'bg-purple-500'
};
const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400',
  Medium:
    'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400',
  Hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
};
function StreakTracker({ streak }: { streak: number; }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const completedDays = [true, true, true, true, false, false, false];
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="streak-flame text-2xl">🔥</span>
          <div>
            <p className="font-display font-bold text-2xl text-neutral-900 dark:text-white">
              {streak} day streak
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Keep it going!
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Best streak
          </p>
          <p className="font-display font-bold text-lg text-accent-500">
            12 days
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {days.map((day, i) =>
          <div key={day} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs transition-all ${completedDays[i] ? 'bg-primary-500 text-white shadow-soft' : i === 4 ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-dashed border-primary-300 dark:border-primary-700 text-primary-400' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400'}`}>

              {completedDays[i] ? '✓' : i === 4 ? '?' : ''}
            </div>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {day}
            </span>
          </div>
        )}
      </div>
    </div>);

}
function ProgressCard({
  label,
  value,
  max,
  color,
  icon






}: { label: string; value: number; max: number; color: string; icon: string; }) {
  const percent = value / max * 100;
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-700 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg">{icon}</span>
        <span className="font-display font-bold text-lg text-neutral-900 dark:text-white">
          {value}/{max}
        </span>
      </div>
      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
        {label}
      </p>
      <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full progress-fill ${color}`}
          style={{
            width: `${percent}%`
          }} />

      </div>
    </div>);

}
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full animate-fade-in">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-3">
          <div className="h-8 w-64 skeleton" />
          <div className="h-4 w-48 skeleton" />
        </div>
        <div className="h-12 w-32 skeleton" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-700 h-32 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-8 h-8 skeleton rounded-xl" />
              <div className="w-12 h-6 skeleton" />
            </div>
            <div className="h-3 w-20 skeleton mb-2" />
            <div className="h-2 w-full skeleton" />
          </div>
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="h-10 w-48 skeleton" />
            <div className="h-8 w-32 skeleton" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 h-32 flex gap-4">
              <div className="w-12 h-12 skeleton rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                  <div className="h-5 w-40 skeleton" />
                  <div className="h-5 w-16 skeleton rounded-full" />
                </div>
                <div className="h-3 w-60 skeleton" />
                <div className="flex justify-between">
                  <div className="h-4 w-24 skeleton rounded-full" />
                  <div className="h-8 w-20 skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-40 w-full skeleton" />
          <div className="h-60 w-full skeleton" />
        </div>
      </div>
    </div>
  </div>
);

export function DashboardPage({
  onStartInterview,
  showWalkthrough = false,
  onWalkthroughComplete
}: DashboardPageProps) {
  const { profile: userProfile, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'all' | 'technical' | 'behavioral'>(
      'all');
  const [filter, setFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>(
    'all'
  );
  const [outcomeStatus, setOutcomeStatus] = useState<
    null | 'offer' | 'in-process' | 'preparing' | 'dismissed'>(
      null);

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  const firstName = userProfile?.name?.split(' ')[0] || 'there';
  const timeOfDay =
    new Date().getHours() < 12 ?
      'morning' :
      new Date().getHours() < 17 ?
        'afternoon' :
        'evening';
  const filteredInterviews = MOCK_INTERVIEWS.filter(
    (i) => filter === 'all' || i.difficulty === filter
  );
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full">
      {/* Dashboard Walkthrough Overlay */}
      {showWalkthrough && onWalkthroughComplete &&
        <DashboardWalkthrough
          firstName={firstName}
          onComplete={onWalkthroughComplete} />

      }

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
              Good {timeOfDay}, {firstName}! 👋
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Ready to practice? You have {MOCK_INTERVIEWS.length} interviews
              waiting for you.
            </p>
          </div>
          <button
            onClick={() => onStartInterview(MOCK_INTERVIEWS[0])}
            className="flex items-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-2xl transition-colors shadow-soft whitespace-nowrap">

            <ZapIcon className="w-4 h-4" />
            <span>Quick Start</span>
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ProgressCard
            label="Interviews Done"
            value={7}
            max={20}
            color="bg-primary-500"
            icon="🎤" />

          <ProgressCard
            label="Questions Answered"
            value={34}
            max={100}
            color="bg-secondary-500"
            icon="💬" />

          <ProgressCard
            label="Skills Improved"
            value={5}
            max={10}
            color="bg-accent-500"
            icon="📈" />

          <ProgressCard
            label="Badges Earned"
            value={3}
            max={12}
            color="bg-purple-500"
            icon="🏆" />

        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Interviews */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs + Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex gap-1 bg-white dark:bg-neutral-800 rounded-xl p-1 border border-neutral-100 dark:border-neutral-700 w-fit">
                {(['all', 'technical', 'behavioral'] as const).map((tab) =>
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-primary-500 text-white shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}>

                    {tab}
                  </button>
                )}
              </div>
              <div className="flex gap-1">
                {(['all', 'Easy', 'Medium', 'Hard'] as const).map((f) =>
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'}`}>

                    {f === 'all' ? 'All' : f}
                  </button>
                )}
              </div>
            </div>

            {/* Interview cards */}
            <div className="space-y-3">
              {filteredInterviews.map((interview, i) =>
                <div
                  key={interview.id}
                  className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 card-lift animate-fade-in"
                  style={{
                    animationDelay: `${i * 50}ms`
                  }}>

                  <div className="flex items-start gap-4">
                    {/* Company logo */}
                    <div
                      className={`w-12 h-12 rounded-2xl ${COMPANY_COLORS[interview.logo] || 'bg-primary-500'} flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0`}>

                      {interview.logo}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-display font-bold text-neutral-900 dark:text-white text-base leading-tight">
                            {interview.role}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                            {interview.company}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${DIFFICULTY_COLORS[interview.difficulty]}`}>

                          {interview.difficulty}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 mb-3">
                        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <DollarSignIcon className="w-3.5 h-3.5" />
                          <span>{interview.salary}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          <span>{interview.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <BriefcaseIcon className="w-3.5 h-3.5" />
                          <span>{interview.jobType}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full">
                            Technical
                          </span>
                          <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 text-xs font-semibold rounded-full">
                            Behavioral
                          </span>
                        </div>
                        <button
                          onClick={() => onStartInterview(interview)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-xl transition-colors">

                          <PlayIcon className="w-3.5 h-3.5" />
                          <span>Start</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            {/* Streak */}
            <StreakTracker streak={4} />

            {/* ── Outcome Tracker ── */}
            {outcomeStatus === null &&
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-neutral-900 dark:text-white text-sm flex items-center gap-2">
                      <span>🎯</span> Had a real interview?
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Let us know how it went — it helps us improve.
                    </p>
                  </div>
                  <button
                    onClick={() => setOutcomeStatus('dismissed')}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-xs transition-colors flex-shrink-0 ml-2">

                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: 'offer' as const,
                      emoji: '🎉',
                      label: 'I got the offer!',
                      color:
                        'hover:border-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/20'
                    },
                    {
                      id: 'in-process' as const,
                      emoji: '🔄',
                      label: 'Still in the process',
                      color:
                        'hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    },
                    {
                      id: 'preparing' as const,
                      emoji: '📚',
                      label: 'Still preparing',
                      color:
                        'hover:border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }].
                    map(({ id, emoji, label, color }) =>
                      <button
                        key={id}
                        onClick={() => setOutcomeStatus(id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 text-left transition-all ${color}`}>

                        <span className="text-base">{emoji}</span>
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {label}
                        </span>
                      </button>
                    )}
                </div>
              </div>
            }

            {outcomeStatus === 'offer' &&
              <div className="bg-secondary-50 dark:bg-secondary-900/20 rounded-2xl p-5 border border-secondary-200 dark:border-secondary-800">
                <div className="text-2xl mb-2">🎉</div>
                <p className="font-display font-semibold text-secondary-700 dark:text-secondary-300 text-sm mb-1">
                  Congratulations!
                </p>
                <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed mb-3">
                  That's amazing news. Your practice paid off. Would you share
                  what helped most?
                </p>
                <textarea
                  placeholder="What made the difference for you? (optional)"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 focus:outline-none focus:border-secondary-400 resize-none"
                  rows={2} />

                <button
                  onClick={() => setOutcomeStatus('dismissed')}
                  className="mt-2 w-full py-2 bg-secondary-500 hover:bg-secondary-600 text-white text-xs font-semibold rounded-xl transition-colors">

                  Submit & close
                </button>
              </div>
            }

            {outcomeStatus === 'in-process' &&
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-5 border border-primary-200 dark:border-primary-800">
                <div className="text-2xl mb-2">💪</div>
                <p className="font-display font-semibold text-primary-700 dark:text-primary-300 text-sm mb-1">
                  Keep going — you've got this.
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400 leading-relaxed mb-3">
                  What round are you in? We'll prioritize the right practice for
                  you.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    'Phone screen',
                    'Technical',
                    'Behavioral',
                    'Final round'].
                    map((round) =>
                      <button
                        key={round}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg border border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">

                        {round}
                      </button>
                    )}
                </div>
                <button
                  onClick={() => setOutcomeStatus('dismissed')}
                  className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-xl transition-colors">

                  Got it, keep practicing
                </button>
              </div>
            }

            {outcomeStatus === 'preparing' &&
              <div className="bg-neutral-100 dark:bg-neutral-700/50 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-600">
                <div className="text-2xl mb-2">📚</div>
                <p className="font-display font-semibold text-neutral-700 dark:text-neutral-300 text-sm mb-1">
                  Smart — preparation is everything.
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                  When's your target interview date? We'll help you build a
                  plan.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    'This week',
                    'Next 2 weeks',
                    'This month',
                    'No date yet'].
                    map((t) =>
                      <button
                        key={t}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">

                        {t}
                      </button>
                    )}
                </div>
                <button
                  onClick={() => setOutcomeStatus('dismissed')}
                  className="w-full py-2 bg-neutral-800 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold rounded-xl transition-colors">

                  Set my plan
                </button>
              </div>
            }

            {/* Recent activity */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card">
              <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary-500" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center text-sm">
                    ✅
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      Stripe Technical
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Score: 82/100 · 2h ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm">
                    🎤
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      Airbnb Behavioral
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Score: 75/100 · Yesterday
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center text-sm">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      AI Coach Session
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      System Design · 2 days ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card">
              <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <TrophyIcon className="w-4 h-4 text-accent-500" />
                Achievements
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-accent-50 dark:bg-accent-900/20">
                  <span className="text-xl">🔥</span>
                  <span className="text-xs text-center text-neutral-600 dark:text-neutral-400 leading-tight">
                    First Streak
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <span className="text-xl">🎤</span>
                  <span className="text-xs text-center text-neutral-600 dark:text-neutral-400 leading-tight">
                    First Interview
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-secondary-100 dark:bg-secondary-900/20">
                  <span className="text-xl">⭐</span>
                  <span className="text-xs text-center text-neutral-600 dark:text-neutral-400 leading-tight">
                    High Score
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 opacity-50">
                  <span className="text-xl grayscale">🏆</span>
                  <span className="text-xs text-center text-neutral-400 dark:text-neutral-500 leading-tight">
                    10 Done
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 opacity-50">
                  <span className="text-xl grayscale">💎</span>
                  <span className="text-xs text-center text-neutral-400 dark:text-neutral-500 leading-tight">
                    Perfect Score
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 opacity-50">
                  <span className="text-xl grayscale">🚀</span>
                  <span className="text-xs text-center text-neutral-400 dark:text-neutral-500 leading-tight">
                    7-Day Streak
                  </span>
                </div>
              </div>
            </div>

            {/* Tip of the day */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <span className="font-display font-semibold text-sm">
                  Tip of the Day
                </span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">
                Use the STAR method (Situation, Task, Action, Result) for
                behavioral questions. It keeps your answers structured and
                memorable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);

}