import React, { useState, useEffect } from 'react';
import {
    CheckIcon,
    SparklesIcon,
    CoffeeIcon,
    ShieldCheckIcon,
    XIcon,
    ZapIcon,
    ArrowRightIcon,
    GiftIcon,
    ClockIcon
} from 'lucide-react';
import { subscription } from '../../data/pricing';

interface AnchoredPaywallModalProps {
    role: string;
    company: string;
    targetDate: string;
    onClose: () => void;
    onSelectPlan: (plan: string, discountCode?: string) => void;
}

export const AnchoredPaywallModal: React.FC<AnchoredPaywallModalProps> = ({
    role,
    company,
    targetDate,
    onClose,
    onSelectPlan
}) => {
    const [showExitDiscount, setShowExitDiscount] = useState(false);
    const [hasTriggeredExit, setHasTriggeredExit] = useState(false);

    // Exit-intent mouseleave detection
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 10 && !hasTriggeredExit) {
                setShowExitDiscount(true);
                setHasTriggeredExit(true);
            }
        };
        window.addEventListener('mouseleave', handleMouseLeave);
        return () => window.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasTriggeredExit]);

    const handleApplyDiscount = () => {
        onSelectPlan('pro_discount', 'DISCOUNT20');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto font-sans">

            {/* Exit Intent Discount Modal Overlay */}
            {showExitDiscount ? (
                <div className="relative w-full max-w-lg bg-neutral-900 border-2 border-accent-500 rounded-3xl p-8 text-white shadow-2xl animate-slide-up text-center space-y-6">
                    <button
                        onClick={() => setShowExitDiscount(false)}
                        className="absolute top-4 right-4 text-neutral-400 hover:text-white">
                        <XIcon className="w-5 h-5" />
                    </button>

                    <div className="w-16 h-16 rounded-full bg-accent-500/20 border border-accent-500/40 text-accent-400 flex items-center justify-center mx-auto">
                        <GiftIcon className="w-8 h-8 animate-bounce" />
                    </div>

                    <div className="space-y-2">
                        <span className="bg-accent-500 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                            Exclusive Exit Discount
                        </span>
                        <h3 className="font-display font-bold text-3xl">
                            Don't lose your {role} Prep Schedule!
                        </h3>
                        <p className="text-sm text-neutral-300">
                            Claim <strong className="text-accent-400">20% OFF</strong> your first month of PrepMirrors Pro. Hit your 85% readiness target for just <strong className="text-white">$0.49 / day</strong>.
                        </p>
                    </div>

                    <div className="bg-black/40 p-4 rounded-2xl border border-neutral-800 flex items-center justify-between text-left">
                        <div>
                            <p className="text-xs text-neutral-400">Pro Plan + Daily Reminders</p>
                            <p className="font-bold text-lg text-white">$15.20 <span className="text-xs text-neutral-400 line-through">$19.00</span> /mo</p>
                        </div>
                        <button
                            onClick={handleApplyDiscount}
                            className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm rounded-xl transition-all shadow-glow flex items-center gap-1.5">
                            <span>Claim 20% OFF</span>
                            <ArrowRightIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowExitDiscount(false)}
                        className="text-xs text-neutral-500 hover:underline">
                        No thanks, I'll risk missing my interview prep timeline.
                    </button>
                </div>
            ) : (
                /* Main Anchored Paywall Container */
                <div className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 text-neutral-900 dark:text-white shadow-2xl animate-slide-up space-y-6">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                        <XIcon className="w-6 h-6" />
                    </button>

                    {/* Header */}
                    <div className="text-center space-y-2 max-w-xl mx-auto">
                        <div className="inline-flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3.5 py-1 rounded-full text-xs font-semibold">
                            <SparklesIcon className="w-3.5 h-3.5" />
                            <span>Target Readiness Deadline: {targetDate}</span>
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900 dark:text-white">
                            Unlock Your Full Interview Prep System
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Stay accountable with daily automated practice reminders and unlimited AI voice mock sessions.
                        </p>
                    </div>

                    {/* Coffee Comparison Card */}
                    <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700/60 grid md:grid-cols-3 gap-4 text-center">

                        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-1">
                            <p className="text-xs text-neutral-500 font-medium">Human Career Coach</p>
                            <p className="font-display font-bold text-2xl text-neutral-900 dark:text-white">$250.00</p>
                            <p className="text-[10px] text-neutral-400">per 1-hr session</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-1">
                            <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-bold">
                                <CoffeeIcon className="w-3.5 h-3.5" />
                                <span>Starbucks Latte</span>
                            </div>
                            <p className="font-display font-bold text-2xl text-neutral-900 dark:text-white">$5.50</p>
                            <p className="text-[10px] text-neutral-400">per single day</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-glow space-y-1 relative overflow-hidden">
                            <span className="absolute top-1 right-2 text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">BEST VALUE</span>
                            <p className="text-xs font-medium text-white/90">PrepMirrors Pro</p>
                            <p className="font-display font-bold text-3xl text-white">$0.63</p>
                            <p className="text-[10px] text-white/80">per day ($19/mo)</p>
                        </div>

                    </div>

                    {/* Feature Checklist */}
                    <div className="space-y-3 max-w-lg mx-auto">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-center">
                            Everything Included in Your Pro Plan:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {[
                                'Unlimited AI Voice Mock Sessions',
                                'Role-Specific Scenarios (Google, Meta, Stripe)',
                                'Daily Automated Practice Reminders',
                                'FAANG Recruiter Quote Rewrites',
                                'Full Progress Analytics & Streaks',
                                'Cancel Anytime with 1-Click'
                            ].map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                    <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action CTA */}
                    <div className="text-center space-y-3 pt-2">
                        <button
                            onClick={() => onSelectPlan('pro')}
                            className="w-full max-w-md py-4 bg-gradient-to-r from-primary-500 via-indigo-600 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold rounded-2xl shadow-glow transition-all text-base flex items-center justify-center gap-2 mx-auto">
                            <span>Activate Pro & Lock In $0.63 / Day</span>
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                        <p className="text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                            <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                            <span>30-Day Money-Back Guarantee • Instant Access</span>
                        </p>
                    </div>

                </div>
            )}
        </div>
    );
};

export default AnchoredPaywallModal;
