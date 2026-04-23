// frontend/src/components/dashboard/RecentActivity.tsx
import { CalendarIcon } from 'lucide-react';

export function RecentActivity() {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border shadow-card">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary-500" /> Recent Activity
            </h3>
            <div className="space-y-3">
                {[
                    { emoji: '✅', title: 'Stripe Technical', score: '82/100', time: '2h ago', color: 'bg-secondary-100' },
                    { emoji: '🎤', title: 'Airbnb Behavioral', score: '75/100', time: 'Yesterday', color: 'bg-primary-100' },
                    { emoji: '📚', title: 'AI Coach Session', score: 'System Design', time: '2 days ago', color: 'bg-accent-100' }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center text-sm`}>{item.emoji}</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{item.title}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Score: {item.score} · {item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}