// frontend/src/components/dashboard/StreakTracker.tsx
import { useEffect, useState } from 'react';
import { Flame, Award, Gift, Calendar, AlertCircle } from 'lucide-react';
import { streakApi } from '../../lib/api/streak';
import { useAuth } from '../../lib/hooks/useAuth';

interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_active: string;
  freezes_available: number;
  upcoming_milestones: Array<{ days: number; reward: string; reward_value: string }>;
  recent_history: Array<{ date: string; had_activity: boolean; used_freeze: boolean }>;
}

export function StreakTracker() {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFreezeModal, setShowFreezeModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadStreakData();
    }
  }, [user]);

  const loadStreakData = async () => {
    const response = await streakApi.getStreak();
    if (response.success) {
      setStreakData(response.data as StreakData);
    }
    setLoading(false);
  };

  const purchaseFreeze = async () => {
    const response = await streakApi.purchaseFreeze();
    if (response.success) {
      await loadStreakData();
      setShowFreezeModal(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-neutral-800 rounded-xl" />;
  }

  if (!streakData) return null;

  const { current_streak, longest_streak, freezes_available, upcoming_milestones, recent_history } = streakData;
  
  // Calculate days until next milestone
  const nextMilestone = upcoming_milestones[0];
  const daysToMilestone = nextMilestone ? nextMilestone.days - current_streak : null;

  // Get recent activity for last 7 days
  const last7Days = recent_history.slice(-7);
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card">
      {/* Streak Flame */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 ${current_streak >= 7 ? 'text-orange-500' : 'text-neutral-400'}`}>
            <Flame className="w-6 h-6 fill-current" />
            <span className="font-display font-bold text-2xl text-neutral-900 dark:text-white">
              {current_streak}
            </span>
          </div>
          <span className="text-sm text-neutral-500">day streak</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">Best streak</p>
          <p className="font-display font-bold text-lg text-primary-500">{longest_streak} days</p>
        </div>
      </div>

      {/* Progress to next milestone */}
      {nextMilestone && daysToMilestone && daysToMilestone > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-neutral-500">{current_streak} days</span>
            <span className="text-primary-400">{nextMilestone.days} days milestone</span>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
              style={{ width: `${(current_streak / nextMilestone.days) * 100}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {daysToMilestone} more days to earn {nextMilestone.reward === 'badge' ? 'a badge' : 'a streak freeze'}!
          </p>
        </div>
      )}

      {/* Week view */}
      <div className="flex justify-between mb-4">
        {weekDays.map((day, i) => {
          const historyItem = last7Days[i];
          const isActive = historyItem?.had_activity;
          const usedFreeze = historyItem?.used_freeze;
          
          return (
            <div key={day} className="text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 ${
                isActive ? 'bg-primary-500 text-white' :
                usedFreeze ? 'bg-blue-500/20 text-blue-400' :
                'bg-neutral-100 dark:bg-neutral-700 text-neutral-400'
              }`}>
                {isActive ? '✓' : usedFreeze ? '❄️' : day}
              </div>
              <span className="text-xs text-neutral-500">{day}</span>
            </div>
          );
        })}
      </div>

      {/* Streak Freezes */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-primary-500" />
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {freezes_available} Streak Freeze{freezes_available !== 1 ? 's' : ''} available
          </span>
        </div>
        <button
          onClick={() => setShowFreezeModal(true)}
          className="text-xs text-primary-500 hover:underline"
        >
          Buy more
        </button>
      </div>

      {/* Freeze Purchase Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-2">Protect Your Streak</h3>
            <p className="text-neutral-500 mb-4">
              Streak Freezes keep your streak alive if you miss a day.
            </p>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 mb-4">
              <p className="text-2xl font-bold text-primary-600">$0.99</p>
              <p className="text-xs text-neutral-500">per Streak Freeze</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={purchaseFreeze}
                className="flex-1 py-2 bg-primary-500 text-white rounded-xl"
              >
                Purchase
              </button>
              <button
                onClick={() => setShowFreezeModal(false)}
                className="flex-1 py-2 border border-neutral-300 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}