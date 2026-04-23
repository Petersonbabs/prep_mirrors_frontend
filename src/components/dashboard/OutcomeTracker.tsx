// frontend/src/components/dashboard/OutcomeTracker.tsx
import { useState } from 'react';

export function OutcomeTracker() {
    const [outcomeStatus, setOutcomeStatus] = useState<string | null>(null);
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    if (outcomeStatus === null) {
        return (
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border shadow-card">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-semibold text-sm flex items-center gap-2"><span>🎯</span> Had a real interview?</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">Let us know how it went — it helps us improve.</p>
                    </div>
                    <button onClick={() => setDismissed(true)} className="text-neutral-400 hover:text-neutral-600 text-xs">✕</button>
                </div>
                <div className="space-y-2">
                    {[
                        { id: 'offer', emoji: '🎉', label: 'I got the offer!', color: 'hover:border-secondary-400 hover:bg-secondary-50' },
                        { id: 'in-process', emoji: '🔄', label: 'Still in the process', color: 'hover:border-primary-400 hover:bg-primary-50' },
                        { id: 'preparing', emoji: '📚', label: 'Still preparing', color: 'hover:border-neutral-400 hover:bg-neutral-50' }
                    ].map(({ id, emoji, label, color }) => (
                        <button key={id} onClick={() => setOutcomeStatus(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 border-neutral-200 text-left transition-all ${color}`}>
                            <span className="text-base">{emoji}</span><span className="text-sm font-medium">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (outcomeStatus === 'offer') {
        return (
            <div className="bg-secondary-50 dark:bg-secondary-900/20 rounded-2xl p-5 border border-secondary-200">
                <div className="text-2xl mb-2">🎉</div>
                <p className="font-semibold text-secondary-700 text-sm mb-1">Congratulations!</p>
                <p className="text-xs text-secondary-600 mb-3">That's amazing news. Would you share what helped most?</p>
                <textarea placeholder="What made the difference for you? (optional)" className="w-full text-xs px-3 py-2 rounded-xl border border-secondary-200 bg-white resize-none" rows={2} />
                <button onClick={() => setDismissed(true)} className="mt-2 w-full py-2 bg-secondary-500 hover:bg-secondary-600 text-white text-xs font-semibold rounded-xl">Submit & close</button>
            </div>
        );
    }

    if (outcomeStatus === 'in-process') {
        return (
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-5 border border-primary-200">
                <div className="text-2xl mb-2">💪</div>
                <p className="font-semibold text-primary-700 text-sm mb-1">Keep going — you've got this.</p>
                <p className="text-xs text-primary-600 mb-3">What round are you in?</p>
                <div className="flex flex-wrap gap-2 mb-3">
                    {['Phone screen', 'Technical', 'Behavioral', 'Final round'].map(round => (
                        <button key={round} className="px-2.5 py-1 text-xs font-medium rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-100">{round}</button>
                    ))}
                </div>
                <button onClick={() => setDismissed(true)} className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-xl">Got it</button>
            </div>
        );
    }

    if (outcomeStatus === 'preparing') {
        return (
            <div className="bg-neutral-100 dark:bg-neutral-700/50 rounded-2xl p-5 border">
                <div className="text-2xl mb-2">📚</div>
                <p className="font-semibold text-neutral-700 text-sm mb-1">Smart — preparation is everything.</p>
                <p className="text-xs text-neutral-500 mb-3">When's your target interview date?</p>
                <div className="flex flex-wrap gap-2 mb-3">
                    {['This week', 'Next 2 weeks', 'This month', 'No date yet'].map(t => (
                        <button key={t} className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-200">{t}</button>
                    ))}
                </div>
                <button onClick={() => setDismissed(true)} className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl">Set my plan</button>
            </div>
        );
    }

    return null;
}