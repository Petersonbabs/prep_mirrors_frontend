// frontend/src/components/dashboard/Achievements.tsx
import { TrophyIcon } from 'lucide-react';

export function Achievements() {
    const achievements = [
        { icon: '🔥', label: 'First Streak', unlocked: true, color: 'bg-accent-50' },
        { icon: '🎤', label: 'First Interview', unlocked: true, color: 'bg-primary-50' },
        { icon: '⭐', label: 'High Score', unlocked: true, color: 'bg-secondary-100' },
        { icon: '🏆', label: '10 Done', unlocked: false },
        { icon: '💎', label: 'Perfect Score', unlocked: false },
        { icon: '🚀', label: '7-Day Streak', unlocked: false },
    ];

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border shadow-card">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <TrophyIcon className="w-4 h-4 text-accent-500" /> Achievements
            </h3>
            <div className="grid grid-cols-3 gap-3">
                {achievements.map((a, i) => (
                    <div key={i} className={`flex flex-col items-center gap-1 p-2 rounded-xl ${a.unlocked ? a.color || 'bg-neutral-100' : 'bg-neutral-100 dark:bg-neutral-700 opacity-50'}`}>
                        <span className={`text-xl ${!a.unlocked && 'grayscale'}`}>{a.icon}</span>
                        <span className="text-xs text-center text-neutral-600 dark:text-neutral-400 leading-tight">{a.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}