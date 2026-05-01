// frontend/src/components/dashboard/InterviewCard.tsx
import { useState } from 'react';
import { PlayIcon, DollarSignIcon, MapPinIcon, BriefcaseIcon, Wallet, Building2, Info, X } from 'lucide-react';

const DIFFICULTY_COLORS: Record<string, string> = {
    Easy: 'bg-secondary-100 dark:bg-green-500 text-secondary-700',
    Medium: 'bg-accent-100  text-accent-700 dark:text-black/80',
    Hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const COLOR_PALETTE = [
    'bg-blue-500',      // 0
    'bg-indigo-500',    // 1
    'bg-purple-500',    // 2
    'bg-pink-500',      // 3
    'bg-red-500',       // 4
    'bg-orange-500',    // 5
    'bg-amber-500',     // 6
    'bg-yellow-600',    // 7
    'bg-emerald-500',   // 8
    'bg-green-500',     // 9
    'bg-teal-500',      // 10
    'bg-cyan-500',      // 11
    'bg-sky-500',       // 12
    'bg-blue-600',      // 13
    'bg-violet-500',    // 14
    'bg-fuchsia-500',   // 15
    'bg-rose-500',      // 16
    'bg-slate-600',     // 17
    'bg-gray-600',      // 18
    'bg-zinc-600',      // 19
];

// Get color based on letter's position in alphabet
const getCompanyColor = (logo: string): string => {
    if (!logo || logo.length === 0) return 'bg-primary-500';

    const letter = logo.toUpperCase().charCodeAt(0);
    const index = (letter - 65) % COLOR_PALETTE.length; // 65 = 'A'
    return COLOR_PALETTE[index];
};

export function InterviewCard({ interview, index, onStart }: { interview: any; index: number; onStart: (interview: any) => void }) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <>
            <div
                className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 card-lift animate-fade-in cursor-pointer hover:border-primary-300 transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setShowDetails(true)}
            >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Company Logo */}
                    <div className={`w-12 h-12 rounded-2xl ${getCompanyColor(interview.logo)} flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0`}>
                        {interview.logo}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                                <h3 className="font-display font-bold text-neutral-900 dark:text-white text-base leading-tight">{interview.role}</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{interview.name}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${DIFFICULTY_COLORS[interview.difficulty]}`}>
                                {interview.difficulty}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 mb-3">
                            <div className="flex items-center gap-1 text-xs text-neutral-500">
                                <Wallet className="w-3.5 h-3.5" />
                                <span>{interview.salary}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-neutral-500">
                                <MapPinIcon className="w-3.5 h-3.5" />
                                <span>{interview.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-neutral-500">
                                <BriefcaseIcon className="w-3.5 h-3.5" />
                                <span>{interview.job_type || interview.jobType}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-neutral-500">
                                <Building2 className="w-3.5 h-3.5" />
                                <span>{interview.industry || 'Technology'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs font-semibold rounded-full">
                                    Technical
                                </span>
                                <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-500 text-xs font-semibold rounded-full">
                                    Behavioral
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStart(interview);
                                }}
                                className="flex w-full sm:w-fit items-center justify-center gap-1.5 px-4 py-4 md:py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm sm:text-xs font-semibold rounded-xl transition-colors"
                            >
                                <PlayIcon className="w-3.5 h-3.5" />
                                <span>Start</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Company Details Modal */}
            {showDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetails(false)}>
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b dark:border-neutral-800 p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl ${getCompanyColor(interview.logo)} flex items-center justify-center text-white font-bold text-lg`}>
                                    {interview.logo}
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-xl">{interview.name}</h2>
                                    <p className="text-sm text-neutral-500">{interview.role}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetails(false)} className="p-1 hover:bg-neutral-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-4">
                            {/* About Company */}
                            {interview.about && (
                                <div>
                                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                        <Building2 className="w-4 h-4" /> About the Company
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{interview.about}</p>
                                </div>
                            )}

                            {/* Job Description */}
                            {interview.description && (
                                <div>
                                    <h3 className="font-semibold text-sm mb-2">Job Description</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{interview.description}</p>
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                                    <p className="text-xs text-neutral-500">Industry</p>
                                    <p className="text-sm font-medium">{interview.industry || 'Technology'}</p>
                                </div>
                                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                                    <p className="text-xs text-neutral-500">Company Size</p>
                                    <p className="text-sm font-medium">{interview.size || 'Not specified'}</p>
                                </div>
                                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                                    <p className="text-xs text-neutral-500">Founded</p>
                                    <p className="text-sm font-medium">{interview.founded_year || 'N/A'}</p>
                                </div>
                                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                                    <p className="text-xs text-neutral-500">Difficulty</p>
                                    <p className="text-sm font-medium">{interview.difficulty}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowDetails(false);
                                        onStart(interview);
                                    }}
                                    className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <PlayIcon className="w-4 h-4" />
                                    Start Interview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}