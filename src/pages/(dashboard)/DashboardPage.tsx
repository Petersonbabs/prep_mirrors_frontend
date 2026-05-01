// frontend/src/pages/DashboardPage.tsx (updated)
import { useState, useEffect } from 'react';
import { ZapIcon } from 'lucide-react';
import { useDashboardData } from '../../lib/hooks/useDashboardData';
import { useAuth } from '../../lib/hooks/useAuth';
import { StreakTracker } from '../../components/dashboard/StreakTracker';
import { ProgressCard } from '../../components/dashboard/ProgressCard';
import { InterviewCard } from '../../components/dashboard/InterviewCard';
import { SubscriptionCard } from '../../components/dashboard/SubscriptionCard';
import { OutcomeTracker } from '../../components/dashboard/OutcomeTracker';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { Achievements } from '../../components/dashboard/Achievements';
import { TipOfTheDay } from '../../components/dashboard/TipOfTheDay';
import { DashboardWalkthrough } from '../../components/DashboardWalkthrough';
import { dashboardApi } from '../../lib/api/dashboard';
import { companiesApi } from '../../lib/api/companies';
import { Company } from '../../lib/types';
import { RefreshCompaniesButton } from '../../components/dashboard/RefreshCompaniesButton';
import { RequiredInfoModal } from '../../components/dashboard/RequiredInfoModal';
import { userApi } from '../../lib/api/users';

interface DashboardPageProps {
  onStartInterview: (interview: any) => void;
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

export function DashboardPage({ onStartInterview, onWalkthroughComplete }: DashboardPageProps) {
  const { subscription, loading, streak, stats, firstName } = useDashboardData();
  const { user, profile, refreshProfile } = useAuth();
  const [filter, setFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [checkingWalkthrough, setCheckingWalkthrough] = useState(true);
  const [showRequiredInfoModal, setShowRequiredInfoModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hasRequiredInfo, setHasRequiredInfo] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';

  useEffect(() => {
    const checkRequiredInfo = async () => {
      if (user?.id && !loadingCompanies) {
        const response = await companiesApi.getUserCompanies(user.id);
        setHasRequiredInfo(response.hasRequiredInfo !== false);

        // If no companies AND has required info, generate
        if (response.companies.length === 0 && response.hasRequiredInfo) {
          await loadCompanies();
        } else if (response.companies.length === 0 && !response.hasRequiredInfo) {
          setShowRequiredInfoModal(true);
        }
      }
    };

    checkRequiredInfo();
  }, [user, loadingCompanies]);


  useEffect(() => {
    if (user?.id) {
      loadCompanies();
    }
  }, [user]);

  const handleSaveRequiredInfo = async (data: { targetRole: string; experienceLevel: string; goal: string }) => {
    setGenerating(true);

    // Save to profile first
    await userApi.updateProfile(user?.id as string, {
      target_role: data.targetRole,
      experience_level: data.experienceLevel,
      goal: data.goal,
    });

    // Then generate companies
    const response = await companiesApi.generateCompanies(
      user?.id as string,
      data.targetRole,
      data.experienceLevel
    );

    if (response.success) {
      setCompanies(response.companies);
      setShowRequiredInfoModal(false);
      await refreshProfile();
    }

    setGenerating(false);
  };

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    const response = await companiesApi.getUserCompanies(user?.id as string);
    if (response.success && response.companies.length > 0) {
      setCompanies(response.companies);
    } else {
      // Generate if none exist
      const generateResponse = await companiesApi.generateCompanies(
        user?.id as string,
        profile?.targetRole || 'Software Engineer',
        profile?.level || 'junior'
      );
      if (generateResponse.success && generateResponse.companies) {
        setCompanies(generateResponse.companies);
      }
    }
    setLoadingCompanies(false);
  };

  const handleRefreshCompanies = async () => {
    await loadCompanies(); // Reload after refresh
  };

  const filteredInterviews = companies.filter(company => filter === 'all' || company.difficulty === filter);

  // Check if user has seen walkthrough
  useEffect(() => {
    const checkWalkthrough = async () => {
      if (profile && !loading) {
        if (profile.has_seen_walkthrough === false) {
          setShowWalkthrough(true);
        }
        setCheckingWalkthrough(false);
      } else if (!loading && !profile) {
        setCheckingWalkthrough(false);
      }
    };

    checkWalkthrough();
  }, [profile, loading]);

  const handleWalkthroughComplete = async () => {
    setShowWalkthrough(false);

    if (user?.id) {
      await dashboardApi.markWalkthroughComplete(user.id);
      await refreshProfile();
    }

    onWalkthroughComplete?.();
  };

  if (loading || checkingWalkthrough || loadingCompanies) return <DashboardSkeleton />;

  return (
    <>
      {showWalkthrough && (
        <DashboardWalkthrough
          firstName={firstName}
          onComplete={handleWalkthroughComplete}
        />
      )}

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="welcome-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
                Good {timeOfDay}, {firstName}! 👋
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                {subscription?.tier === 'pro'
                  ? 'You have unlimited interviews. Ready to practice?'
                  : `You have ${subscription?.interviewsRemaining || 3} free interviews remaining this month.`}
              </p>
            </div>
            <div className="flex items-center gap-2">

              <button
                onClick={() => onStartInterview(companies[0])}
                className="quick-start-btn flex items-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-2xl transition-colors shadow-soft whitespace-nowrap"
              >
                <ZapIcon className="w-4 h-4" />
                <span>Quick Start</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <ProgressCard label="Interviews Done" value={stats.interviewsDone} max={20} icon="🎤" />
            <ProgressCard label="Questions Answered" value={stats.questionsAnswered} max={100} icon="💬" />
            <ProgressCard label="Skills Improved" value={stats.skillsImproved} max={10} icon="📈" />
            <ProgressCard label="Badges Earned" value={stats.badgesEarned} max={12} icon="🏆" />
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Interviews */}
            <div className="interviews-section lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex gap-1 bg-white dark:bg-neutral-800 rounded-xl p-1 border w-fit">
                  {['all', 'Easy', 'Medium', 'Hard'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'text-neutral-500'
                        }`}
                    >
                      {f === 'all' ? 'All' : f}
                    </button>
                  ))}
                </div>

                <RefreshCompaniesButton
                  onRefresh={handleRefreshCompanies}
                  subscriptionTier={subscription?.tier || 'free'}
                />
              </div>

              <div className="space-y-3">
                {filteredInterviews.map((interview, i) => (
                  <InterviewCard key={interview.id} interview={interview} index={i} onStart={onStartInterview} />
                ))}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="progress-section space-y-4">
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

      {showRequiredInfoModal && (
        <RequiredInfoModal
          isOpen={showRequiredInfoModal}
          onClose={() => setShowRequiredInfoModal(false)}
          onSave={handleSaveRequiredInfo}
          isLoading={generating}
        />
      )}
    </>
  );
}