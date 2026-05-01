// frontend/src/pages/BillingPage.tsx
import { useState } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';
import { useDashboardData } from '../../lib/hooks/useDashboardData';
import {
    CreditCard,
    ExternalLink,
    Loader2,
    Crown,
    Zap,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import { subscriptionApi } from '../../lib/api/subscription';
import { subscription as pricing } from '../../data/pricing'


export default function BillingPage() {
    const { user } = useAuth();
    const { subscription, loading } = useDashboardData();
    const [loadingPortal, setLoadingPortal] = useState(false);
    const [loadingUpgrade, setLoadingUpgrade] = useState(false);

    const handleManageSubscription = async () => {
        if (!user?.id) return;
        setLoadingPortal(true);

        try {
            const data = await subscriptionApi.getPortalUrl(user?.id)
            if (data.url) {
                window.open(data.url, '_blank');
            } else {
                console.error('No URL returned');
            }
        } catch (error) {
            console.error('Error getting portal URL:', error);
        } finally {
            setLoadingPortal(false);
        }
    };

    const handleUpgrade = async () => {
        if (!user?.id) return;
        setLoadingUpgrade(true);
        try {

            const variantId = import.meta.env.VITE_LEMONSQUEEZY_MONTHLY_VARIANT_ID;
            const data = await subscriptionApi.upgrade(user?.id, variantId)

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('No checkout URL returned');
            }
        } catch (error) {
            console.error('Error creating checkout:', error);
        } finally {
            setLoadingUpgrade(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    const isPro = subscription?.tier === 'pro';
    const isTrialing = subscription?.status === 'trialing';
    const trialEndsAt = subscription?.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
    const daysLeft = trialEndsAt ? Math.ceil((trialEndsAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Billing & Subscription</h1>
                <p className="text-neutral-500 mt-1">Manage your plan, payment methods, and billing information</p>
            </div>

            {/* Current Plan Card */}
            <div className={`rounded-2xl p-6 ${isPro
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
                }`}>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {isPro ? (
                                <Crown className="w-5 h-5" />
                            ) : (
                                <Zap className="w-5 h-5 text-neutral-400" />
                            )}
                            <h2 className="text-xl font-semibold">
                                {isPro ? 'Pro Plan' : 'Free Plan'}
                            </h2>
                        </div>
                        <p className={`text-sm ${isPro ? 'text-white/80' : 'text-neutral-500'} mb-4`}>
                            {isPro
                                ? 'You have unlimited interviews and advanced AI feedback.'
                                : 'Upgrade to Pro for unlimited interviews and advanced AI coaching.'}
                        </p>
                        {isTrialing && trialEndsAt && daysLeft > 0 && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg text-sm">
                                <span className="text-yellow-300">✨</span>
                                <span>Trial ends in {daysLeft} days</span>
                            </div>
                        )}
                        {isPro && !isTrialing && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg text-sm">
                                <CheckCircle className="w-4 h-4" />
                                <span>Active subscription</span>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">
                            {isPro ? '$7.99' : '$0'}
                            <span className="text-sm font-normal">/month</span>
                        </p>
                        {isPro && (
                            <button
                                onClick={handleManageSubscription}
                                disabled={loadingPortal}
                                className="mt-2 text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1 mx-auto"
                            >
                                {loadingPortal ? 'Loading...' : 'Manage subscription'}
                            </button>
                        )}
                    </div>
                </div>

                {!isPro && (
                    <button
                        onClick={handleUpgrade}
                        disabled={loadingUpgrade}
                        className="mt-4 w-full py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-neutral-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loadingUpgrade ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Start {pricing?.pro.trialDays || 3}-Day Free Trial - $0
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Features Comparison */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <div className="p-5 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-semibold">Plan Features</h3>
                </div>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {[
                        { feature: 'Number of interviews', free: '3 per month', pro: 'Unlimited' },
                        { feature: 'AI Feedback Quality', free: 'Basic', pro: 'Advanced + Voice Analysis' },
                        { feature: 'AI Personal Coach', free: '❌', pro: '✅' },
                        { feature: 'Company Avatar Listings', free: '6 companies', pro: '12 companies' },
                        { feature: 'Progress Tracking', free: 'Basic', pro: 'Detailed Analytics' },
                        { feature: 'Priority Support', free: '❌', pro: '✅' },
                        { feature: 'Cancel anytime', free: '✅', pro: '✅' },
                    ].map((item, idx) => (
                        <div key={idx} className="p-4 flex justify-between items-center">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.feature}</span>
                            <div className="flex gap-8 text-right">
                                <span className="text-sm w-24">{item.free}</span>
                                <span className="text-sm w-24 font-medium text-primary-600">{item.pro}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Manage Subscription Button */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <CreditCard className="w-8 h-8 text-primary-500" />
                    <h3 className="font-semibold text-lg">Everything is managed by Lemon Squeezy</h3>
                </div>
                <p className="text-sm text-neutral-500 mb-4">
                    Update payment methods, view invoices, change plans, or cancel your subscription
                </p>
                <button
                    onClick={handleManageSubscription}
                    disabled={loadingPortal}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                    {loadingPortal ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <ExternalLink className="w-4 h-4" />
                    )}
                    {loadingPortal ? 'Opening portal...' : 'Manage Subscription →'}
                </button>
                <p className="text-xs text-neutral-400 mt-3">
                    You'll be redirected to our secure billing portal powered by Lemon Squeezy
                </p>
            </div>

            {/* Support Section */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-5 text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Need help with billing? Contact us at{' '}
                    <a href="mailto:support@prepmirrors.com" className="text-primary-500 hover:underline">
                        support@prepmirrors.com
                    </a>
                </p>
            </div>
        </div>
    );
}