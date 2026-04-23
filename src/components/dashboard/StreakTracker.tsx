// frontend/src/components/dashboard/StreakTracker.tsx
export function StreakTracker({ streak }: { streak: number }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const completedDays = [true, true, true, true, false, false, false];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{streak} day streak</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Keep it going!</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Best streak</p>
          <p className="font-display font-bold text-lg text-accent-500">12 days</p>
        </div>
      </div>
      <div className="flex gap-2">
        {days.map((day, i) => (
          <div key={day} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs transition-all ${
              completedDays[i] ? 'bg-primary-500 text-white shadow-soft' : 
              i === 4 ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-dashed border-primary-300 text-primary-400' : 
              'bg-neutral-100 dark:bg-neutral-700 text-neutral-400'
            }`}>
              {completedDays[i] ? '✓' : i === 4 ? '?' : ''}
            </div>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}