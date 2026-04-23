// frontend/src/components/dashboard/InterviewCard.tsx
import { PlayIcon, DollarSignIcon, MapPinIcon, BriefcaseIcon } from 'lucide-react';

const DIFFICULTY_COLORS: Record<string, string> = {
    Easy: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400',
    Medium: 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400',
    Hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const COMPANY_COLORS: Record<string, string> = {
    G: 'bg-blue-500', S: 'bg-indigo-500', A: 'bg-rose-500', M: 'bg-blue-600', N: 'bg-neutral-800', L: 'bg-purple-500'
};

export function InterviewCard({ interview, index, onStart }: { interview: any; index: number; onStart: (interview: any) => void }) {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 card-lift animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl ${COMPANY_COLORS[interview.logo] || 'bg-primary-500'} flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0`}>
                    {interview.logo}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                            <h3 className="font-display font-bold text-neutral-900 dark:text-white text-base leading-tight">{interview.role}</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{interview.company}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${DIFFICULTY_COLORS[interview.difficulty]}`}>
                            {interview.difficulty}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 mb-3">
                        <div className="flex items-center gap-1 text-xs text-neutral-500"><DollarSignIcon className="w-3.5 h-3.5" /><span>{interview.salary}</span></div>
                        <div className="flex items-center gap-1 text-xs text-neutral-500"><MapPinIcon className="w-3.5 h-3.5" /><span>{interview.location}</span></div>
                        <div className="flex items-center gap-1 text-xs text-neutral-500"><BriefcaseIcon className="w-3.5 h-3.5" /><span>{interview.jobType}</span></div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs font-semibold rounded-full">Technical</span>
                            <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-500 text-xs font-semibold rounded-full">Behavioral</span>
                        </div>
                        <button onClick={() => onStart(interview)} className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-xl transition-colors">
                            <PlayIcon className="w-3.5 h-3.5" /><span>Start</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}