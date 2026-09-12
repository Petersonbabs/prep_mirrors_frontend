import React, { useState, useEffect } from 'react';
import {
    SparklesIcon,
    CheckCircle2Icon,
    AlertTriangleIcon,
    ClockIcon,
    ArrowRightIcon,
    LockIcon,
    ShieldCheckIcon,
    TrendingUpIcon,
    RefreshCwIcon,
    ZapIcon
} from 'lucide-react';
import { DiagnosticEvaluationSchema } from '../../lib/types/diagnostic.types';

interface DiagnosticScorecardProps {
    scoreData: DiagnosticEvaluationSchema;
    /** Heard over the call, so it may be mis-transcribed — always editable. */
    name?: string;
    role: string;
    company: string;
    timelineDays: number;
    onProceedToPaywall: () => void;
    /** Email, plus the name as corrected by the candidate. */
    onAuthenticate: (email: string, name?: string) => void;
}

export const DiagnosticScorecard: React.FC<DiagnosticScorecardProps> = ({
    scoreData,
    name,
    role,
    company,
    timelineDays,
    onProceedToPaywall,
    onAuthenticate
}) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [authEmail, setAuthEmail] = useState('');
    const [editableName, setEditableName] = useState(name ?? '');
    const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

    // The name arrives mid-call, after this may already have rendered.
    useEffect(() => {
        if (name) setEditableName(name);
    }, [name]);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (!authEmail) return;
        setIsSubmittingAuth(true);
        setTimeout(() => {
            onAuthenticate(authEmail, editableName.trim() || undefined);
            setIsUnlocked(true);
            setIsSubmittingAuth(false);
        }, 600);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 text-neutral-900 dark:text-white font-sans animate-slide-up">
            {/* 1. Readiness Score Gauge Hero Banner */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-neutral-900 via-neutral-900 to-primary-950 border border-neutral-800 text-white shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-300 border border-primary-500/30 px-3.5 py-1 rounded-full text-xs font-semibold">
                            <SparklesIcon className="w-3.5 h-3.5" />
                            <span>AI Diagnostic Scorecard • {role} @ {company}</span>
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight">
                            {editableName ? `${editableName}, here's your baseline` : 'Your Diagnostic Baseline'}
                        </h2>
                        <p className="text-sm text-neutral-400 max-w-md">
                            Evaluated using real FAANG recruiter rubrics, STAR completeness metrics, and speech density analysis.
                        </p>
                    </div>

                    {/* Score Gauge Circle */}
                    <div className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-neutral-800 shadow-card min-w-[200px]">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-neutral-800 stroke-current"
                                    strokeWidth="3.5"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className="text-primary-500 stroke-current transition-all duration-1000 ease-out"
                                    strokeDasharray={`${scoreData.readiness_score}, 100`}
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="font-display font-bold text-3xl text-white">
                                    {scoreData.readiness_score}%
                                </span>
                                <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                                    Readiness
                                </span>
                            </div>
                        </div>
                        <span className="mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-secondary-500/20 text-secondary-300 border border-secondary-500/30">
                            {scoreData.benchmark_status}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. Micro-Gated Email Auth Banner (If not yet unlocked) */}
            {!isUnlocked ? (
                <div className="rounded-3xl p-8 bg-white dark:bg-neutral-900 border-2 border-primary-500/40 shadow-soft text-center space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto">
                        <LockIcon className="w-7 h-7" />
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                        <h3 className="font-display font-bold text-2xl text-neutral-900 dark:text-white">
                            Unlock Your Full Diagnostic Report
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Enter your email to view your exact quote rewrites, red-flag analysis, and your personalized <strong className="text-neutral-900 dark:text-white">{timelineDays}-Day Practice Plan</strong>.
                        </p>
                    </div>

                    <form onSubmit={handleUnlock} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                        {/* Pre-filled from what we heard on the call. Editable
                            because speech-to-text mangles names, and a name we
                            got wrong is worse than no name at all. */}
                        <input
                            type="text"
                            placeholder="Your name"
                            value={editableName}
                            onChange={(e) => setEditableName(e.target.value)}
                            aria-label="Your name"
                            className="sm:w-36 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                        />
                        <input
                            type="email"
                            required
                            placeholder="Enter your email address..."
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            className="flex-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-500"
                        />
                        <button
                            type="submit"
                            disabled={isSubmittingAuth}
                            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-sm transition-all shadow-soft flex items-center justify-center gap-2">
                            {isSubmittingAuth ? 'Unlocking...' : 'Unlock Report →'}
                        </button>
                    </form>

                    <p className="text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                        <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                        <span>100% Free • No spam • Saved directly to your account</span>
                    </p>
                </div>
            ) : (
                /* 3. Full Unlocked Scorecard Report */
                <div className="space-y-6 animate-slide-up">

                    {/* Timeline Pace Calculator Box */}
                    <div className="rounded-3xl p-6 bg-gradient-to-r from-secondary-900/30 via-neutral-900 to-primary-950 border border-secondary-500/30 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-secondary-400 text-xs font-bold uppercase tracking-wider">
                                <ClockIcon className="w-4 h-4" />
                                <span>Interview Timeline Pace Calculator</span>
                            </div>
                            <h3 className="font-display font-bold text-xl">
                                {scoreData.timeline_pace.pace_headline}
                            </h3>
                            <p className="text-xs text-neutral-300">
                                Target Timeline: <strong className="text-white">{timelineDays} Days</strong> • Target Readiness: <strong className="text-white">85%+</strong>
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-black/40 px-5 py-3 rounded-2xl border border-neutral-800 text-center">
                            <div>
                                <p className="font-display font-bold text-2xl text-secondary-400">
                                    {scoreData.timeline_pace.sessions_per_day}x
                                </p>
                                <p className="text-[10px] text-neutral-400 font-medium uppercase">Sessions / Day</p>
                            </div>
                            <div className="w-px h-8 bg-neutral-800" />
                            <div>
                                <p className="font-display font-bold text-2xl text-primary-400">
                                    {scoreData.timeline_pace.minutes_per_day}m
                                </p>
                                <p className="text-[10px] text-neutral-400 font-medium uppercase">Mins / Day</p>
                            </div>
                        </div>
                    </div>

                    {/* 5-Pillar Score Grid */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
                        <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                            <TrendingUpIcon className="w-5 h-5 text-primary-500" />
                            <span>5-Pillar Evaluation Breakdown</span>
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { name: 'STAR Structure Completeness', score: scoreData.pillar_scores.star_structure },
                                { name: 'Conciseness & Clarity', score: scoreData.pillar_scores.conciseness_clarity },
                                { name: 'Domain Keyword Coverage', score: scoreData.pillar_scores.domain_keywords },
                                { name: 'Delivery Confidence & Vocal Rhythm', score: scoreData.pillar_scores.delivery_confidence },
                                { name: 'Executive Impact & Ownership', score: scoreData.pillar_scores.executive_impact },
                            ].map((pillar, i) => (
                                <div key={i} className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700/60 space-y-2">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-neutral-700 dark:text-neutral-300">{pillar.name}</span>
                                        <span className="text-primary-600 dark:text-primary-400 font-bold">{pillar.score}%</span>
                                    </div>
                                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                                            style={{ width: `${pillar.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quote Rewrites Carousel Card */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
                        <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                            <RefreshCwIcon className="w-5 h-5 text-secondary-500" />
                            <span>FAANG Recruiter Quote Rewrites</span>
                        </h3>

                        <div className="space-y-3">
                            {scoreData.quote_rewrites.map((qr, idx) => (
                                <div key={idx} className="bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-3">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">What You Said</span>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 italic mt-0.5 font-mono">
                                            "{qr.user_said}"
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">FAANG Recruiter Rewrite</span>
                                        <p className="text-xs text-neutral-800 dark:text-neutral-200 font-medium mt-0.5">
                                            "{qr.recruiter_rewrite}"
                                        </p>
                                    </div>

                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-200 dark:border-neutral-700">
                                        💡 <strong>Rationale:</strong> {qr.rationale}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Red Flags & Next Step Paywall CTA */}
                    <div className="bg-neutral-900 text-white rounded-3xl p-8 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider">
                                <AlertTriangleIcon className="w-4 h-4" />
                                <span>Detected Areas to Fix ({scoreData.red_flags.length} Red Flags)</span>
                            </div>
                            <h3 className="font-display font-bold text-2xl">
                                Ready to bridge your 85% readiness gap?
                            </h3>
                            <p className="text-xs text-neutral-400 max-w-lg">
                                PrepMirrors will schedule your daily {scoreData.timeline_pace.sessions_per_day}x practice sessions and send AI reminders so you're ready before {scoreData.timeline_pace.target_ready_date}.
                            </p>
                        </div>

                        <button
                            onClick={onProceedToPaywall}
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold rounded-2xl shadow-glow transition-all text-base whitespace-nowrap">
                            <span>Activate My Practice Schedule</span>
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default DiagnosticScorecard;
