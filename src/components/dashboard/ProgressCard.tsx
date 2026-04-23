// frontend/src/components/dashboard/ProgressCard.tsx
export function ProgressCard({ label, value, max, icon }: { label: string; value: number; max: number; icon: string }) {
    const percent = (value / max) * 100;
    const colors = {
        '🎤': 'bg-primary-500',
        '💬': 'bg-secondary-500',
        '📈': 'bg-accent-500',
        '🏆': 'bg-purple-500',
    }[icon] || 'bg-primary-500';

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-700 shadow-card">
            <div className="flex items-center justify-between mb-3">
                <span className="text-lg">{icon}</span>
                <span className="font-display font-bold text-lg text-neutral-900 dark:text-white">{value}/{max}</span>
            </div>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">{label}</p>
            <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${colors}`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}