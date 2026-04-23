import { useState } from 'react';
import { ZapIcon } from 'lucide-react';
import { useDashboardData } from '../../lib/hooks/useDashboardData';
import { StreakTracker } from '../../components/dashboard/StreakTracker';
import { ProgressCard } from '../../components/dashboard/ProgressCard';
import { InterviewCard } from '../../components/dashboard/InterviewCard';
import { SubscriptionCard } from '../../components/dashboard/SubscriptionCard';
import { OutcomeTracker } from '../../components/dashboard/OutcomeTracker';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { Achievements } from '../../components/dashboard/Achievements';
import { TipOfTheDay } from '../../components/dashboard/TipOfTheDay';

const MOCK_INTERVIEWS = [
  { id: '1', company: 'Google', role: 'Software Engineer II', salary: '$180,000 – $240,000', jobType: 'Full-time', location: 'Mountain View, CA (Hybrid)', difficulty: 'Hard', logo: 'G' },
  { id: '2', company: 'Stripe', role: 'Software Engineer', salary: '$160,000 – $200,000', jobType: 'Full-time', location: 'San Francisco, CA (Remote)', difficulty: 'Medium', logo: 'S' },
  { id: '3', company: 'Airbnb', role: 'Frontend Engineer', salary: '$150,000 – $190,000', jobType: 'Full-time', location: 'San Francisco, CA (Hybrid)', difficulty: 'Medium', logo: 'A' },
  { id: '4', company: 'Meta', role: 'Software Engineer', salary: '$190,000 – $260,000', jobType: 'Full-time', location: 'Menlo Park, CA (On-site)', difficulty: 'Hard', logo: 'M' },
  { id: '5', company: 'Notion', role: 'Software Engineer', salary: '$140,000 – $175,000', jobType: 'Full-time', location: 'New York, NY (Remote)', difficulty: 'Easy', logo: 'N' },
  { id: '6', company: 'Linear', role: 'Full Stack Engineer', salary: '$130,000 – $165,000', jobType: 'Full-time', location: 'Remote', difficulty: 'Medium', logo: 'L' },
];

interface DashboardPageProps {
  onStartInterview: (interview: any) => void;
  showWalkthrough?: boolean;
  onWalkthroughComplete?: () => void;
}

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full animate-fade-in">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-3">
          <div className="h-8 w-64 skeleton" />
          <div className="h-4 w-48 skeleton" />
        </div>
        <div className="h-12 w-32 skeleton" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl p-4 h-32 animate-pulse" />)}
      </div>
    </div>
  </div>
);

export function DashboardPage({ onStartInterview, showWalkthrough, onWalkthroughComplete }: DashboardPageProps) {
  const { subscription, loading, streak, stats, firstName } = useDashboardData();
  const [filter, setFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';

  const filteredInterviews = MOCK_INTERVIEWS.filter(i => filter === 'all' || i.difficulty === filter);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
              Good {timeOfDay}, {firstName}! 👋
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              {subscription?.tier === 'pro'
                ? 'You have unlimited interviews. Ready to practice?'
                : `You have ${subscription?.interviewsRemaining as any || 3} free interviews remaining this month.`}
            </p>
          </div>
          <button
            onClick={() => onStartInterview(MOCK_INTERVIEWS[0])}
            className="flex items-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-2xl transition-colors shadow-soft whitespace-nowrap">
            <ZapIcon className="w-4 h-4" />
            <span>Quick Start</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ProgressCard label="Interviews Done" value={stats.interviewsDone} max={20} icon="🎤" />
          <ProgressCard label="Questions Answered" value={stats.questionsAnswered} max={100} icon="💬" />
          <ProgressCard label="Skills Improved" value={stats.skillsImproved} max={10} icon="📈" />
          <ProgressCard label="Badges Earned" value={stats.badgesEarned} max={12} icon="🏆" />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Interviews */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex gap-1 bg-white dark:bg-neutral-800 rounded-xl p-1 border w-fit">
                {['all', 'Easy', 'Medium', 'Hard'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'text-neutral-500'
                      }`}>
                    {f === 'all' ? 'All' : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredInterviews.map((interview, i) => (
                <InterviewCard key={interview.id} interview={interview} index={i} onStart={onStartInterview} />
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4">
            <SubscriptionCard subscription={subscription} />
            <StreakTracker streak={streak} />
            <OutcomeTracker />
            <RecentActivity />
            <Achievements />
            <TipOfTheDay />
          </div>
        </div>
      </div>
    </div>
  );
}