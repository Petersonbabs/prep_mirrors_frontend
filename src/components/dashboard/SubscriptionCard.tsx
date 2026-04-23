
export function SubscriptionCard({ subscription }: { subscription: any }) {
    if (!subscription) return null;

    if (subscription.tier === 'pro' && subscription.status === 'trialing') {
        const trialEndsAt = new Date(subscription.trialEndsAt);
        const now = new Date();
        const daysLeft = Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return (
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-5 text-white">
                <p className="text-sm opacity-90">✨ Free Trial Active</p>
                <p className="text-2xl font-bold">{daysLeft} days remaining</p>
                <p className="text-xs opacity-80 mt-2">No charges until trial ends</p>
            </div>
        );
    }

    if (subscription.tier === 'pro' && subscription.status === 'active') {
        return (
            <div className="bg-emerald-500 rounded-2xl p-5 text-white">
                <p className="text-sm opacity-90">💎 Pro Member</p>
                <p className="text-2xl font-bold">Active</p>
                <p className="text-xs opacity-80 mt-2">Unlimited interviews</p>
            </div>
        );
    }

    // Free tier or expired
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Free Plan</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {subscription.interviewsRemaining ?? 3} interviews left
            </p>
            <p className="text-xs text-neutral-400 mt-1">Resets monthly</p>
            <button className="mt-3 text-primary-500 text-sm font-medium hover:underline">
                Upgrade to Pro →
            </button>
        </div>
    );
}