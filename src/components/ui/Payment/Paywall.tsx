// src/components/Paywall.tsx
import React, { useState, useEffect } from 'react';
import { usePaddle } from '../../../contexts/PaddleContext';
import { plans, subscription } from '../../../data/pricing';
import { useAuth } from '../../../lib/hooks/useAuth';


interface PricePreview {
    monthly: string | null;
    annual: string | null;
}

const Paywall: React.FC = () => {
    // ✅ FIXED: Get user from auth context instead of prop
    const { user } = useAuth(); // Assuming you have an auth context
    const { paddle, billingCycle, setBillingCycle, openCheckout, isLoading, startFreeTrial } = usePaddle();
    const [prices, setPrices] = useState<PricePreview>({
        monthly: null,
        annual: null,
    });
    const [loadingPrices, setLoadingPrices] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Price IDs from environment
    const PRICE_IDS = {
        monthly: import.meta.env.VITE_PADDLE_MONTHLY_PRICE_ID,
        annual: import.meta.env.VITE_PADDLE_ANNUALLY_PRICE_ID,
    };

    // Fetch localized prices
    useEffect(() => {
        const fetchPrices = async () => {
            if (!paddle) return;

            setLoadingPrices(true);

            try {
                // Fetch both prices in parallel for better performance
                const [monthlyPreview, annualPreview] = await Promise.all([
                    paddle.PricePreview({
                        items: [{ priceId: PRICE_IDS.monthly, quantity: 1 }],
                    }),
                    paddle.PricePreview({
                        items: [{ priceId: PRICE_IDS.annual, quantity: 1 }],
                    })
                ]);

                setPrices({
                    monthly: monthlyPreview?.data?.details?.lineItems?.[0]?.formattedTotals?.total || null,
                    annual: annualPreview?.data?.details?.lineItems?.[0]?.formattedTotals?.total || null,
                });
            } catch (error) {
                console.error('Error fetching prices:', error);
            } finally {
                setLoadingPrices(false);
            }
        };

        fetchPrices();
    }, [paddle]);

    const handleSubscribe = async () => {
        if (!user?.email) {
            console.error('No user email found');
            return;
        }

        setIsProcessing(true);

        try {
            // ✅ FIXED: Use the trial approach you prefer
            // Option 1: Self-managed trial (no card required)
            // const success = await startFreeTrial(user.id);
            // if (success) {
            //     window.location.href = '/dashboard';
            // }

            // Option 2: Paddle-managed trial (card required)
            openCheckout({
                customer: { email: user.email },
            });

            // Note: on success, user will be redirected to /payment-success
            // The webhook will update their profile
        } catch (error) {
            console.error('Error during subscription:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const currentPlan = plans.find(p => p.id === (billingCycle === 'month' ? 'monthly' : 'annual'));

    // ✅ FIXED: Disable button if no user email
    const isDisabled = loadingPrices || isLoading || isProcessing || !user?.email;

    return (
        <div className="paywall-container">
            {/* Billing toggle */}
            <div className="billing-toggle">
                <button
                    className={billingCycle === 'month' ? 'active' : ''}
                    onClick={() => setBillingCycle('month')}
                    disabled={isProcessing}
                >
                    Monthly
                </button>
                <button
                    className={billingCycle === 'year' ? 'active' : ''}
                    onClick={() => setBillingCycle('year')}
                    disabled={isProcessing}
                >
                    Annual <span className="save-badge">Save {subscription.pro.percentageOff}%</span>
                </button>
            </div>

            {/* Pricing card */}
            <div className="pricing-card">
                <h3>Pro Plan</h3>

                <div className="price">
                    {loadingPrices ? (
                        <span className="loading">Loading...</span>
                    ) : (
                        <>
                            <span className="amount">
                                {billingCycle === 'month'
                                    ? prices.monthly || `$${subscription.pro.price.monthly}`
                                    : prices.annual || `$${subscription.pro.price.annually}`}
                            </span>
                            <span className="period">/month</span>
                        </>
                    )}
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
                    {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        `Start Free Trial — ${subscription.pro.trialDays} Days`
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