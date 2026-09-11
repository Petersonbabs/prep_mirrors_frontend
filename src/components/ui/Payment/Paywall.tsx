// src/components/Paywall.tsx
import React, { useState } from 'react';
import { useLemonSqueezy } from '../../../contexts/LemonSqueezyContext';
import { plans, subscription } from '../../../data/pricing';
import { useAuth } from '../../../lib/hooks/useAuth';

const Paywall: React.FC = () => {
    const { user } = useAuth();
    const { checkout, isLoading } = useLemonSqueezy();
    const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');

    const handleSubscribe = async () => {
        if (!user?.email || !user?.id) {
            console.error('User auth required for subscription');
            return;
        }

        const variantId = billingCycle === 'month'
            ? import.meta.env.VITE_LEMONSQUEEZY_MONTHLY_VARIANT_ID
            : import.meta.env.VITE_LEMONSQUEEZY_ANNUAL_VARIANT_ID;

        await checkout(variantId, user.email, user.id);
    };

    const currentPlan = plans.find(p => p.id === (billingCycle === 'month' ? 'monthly' : 'annual'));
    const isDisabled = isLoading || !user?.email;

    return (
        <div className="paywall-container">
            {/* Billing toggle */}
            <div className="billing-toggle">
                <button
                    className={billingCycle === 'month' ? 'active' : ''}
                    onClick={() => setBillingCycle('month')}
                    disabled={isLoading}
                >
                    Monthly
                </button>
                <button
                    className={billingCycle === 'year' ? 'active' : ''}
                    onClick={() => setBillingCycle('year')}
                    disabled={isLoading}
                >
                    Annual <span className="save-badge">Save {subscription.pro.percentageOff}%</span>
                </button>
            </div>

            {/* Pricing card */}
            <div className="pricing-card">
                <h3>Pro Plan</h3>

                <div className="price">
                    <span className="amount">
                        {billingCycle === 'month'
                            ? `$${subscription.pro.price.monthly}`
                            : `$${subscription.pro.price.annually}`}
                    </span>
                    <span className="period">/month</span>
                </div>

                {billingCycle === 'year' && currentPlan && 'note' in currentPlan && (
                    <p className="billing-note">{currentPlan.note}</p>
                )}

                <ul className="features">
                    {subscription.pro.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>

                <button
                    onClick={handleSubscribe}
                    disabled={isDisabled}
                    className="cta-button"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        `Start Pro Subscription — ${subscription.pro.trialDays} Days Free`
                    )}
                </button>

                <p className="trial-note">
                    Try Pro free for 7 days. Cancel anytime.
                </p>

                {!user?.email && (
                    <p className="text-red-500 text-xs mt-2">
                        Please log in to subscribe
                    </p>
                )}
            </div>
        </div>
    );
};

export default Paywall;