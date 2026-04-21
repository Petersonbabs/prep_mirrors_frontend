// frontend/src/components/PaywallScreen.tsx
import { useState } from "react";
import { PlanId, plans, subscription } from "../../../data/pricing";
import { CheckIcon } from "lucide-react";
import { useLemonSqueezy } from "../../../contexts/LemonSqueezyContext";
import { useAuth } from "../../../lib/hooks/useAuth";

function PaywallScreen({
  onUpgrade,
  onSkip
}: { onUpgrade: () => void; onSkip: () => void; }) {
  const [selected, setSelected] = useState<PlanId>('annual');
  const { checkout, isLoading } = useLemonSqueezy();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleUpgrade = async () => {
    if (!user?.email) {
      console.error('No user email found');
      return;
    }

    setIsProcessing(true);

    try {
      const variantId = selected === 'annual'
        ? import.meta.env.VITE_LEMONSQUEEZY_ANNUAL_VARIANT_ID
        : import.meta.env.VITE_LEMONSQUEEZY_MONTHLY_VARIANT_ID;

      // This will redirect to Lemon Squeezy checkout page
      await checkout(variantId, user.email, user.id);
      // Note: onUpgrade will be called after successful payment via webhook
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b">
      <div className="flex justify-end px-6 pt-6">
        <button
          onClick={onSkip}
          className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 hover:bg-neutral-300 transition-colors"
          aria-label="Close">
          ✕
        </button>
      </div>

      <div className="flex-1 border-2 border-gray-500 px-6 pt-4 rounded-lg pb-8 flex flex-col max-w-lg mx-auto w-full">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-full text-sm font-bold">
            <span>🔥</span>
            <span>Special offer</span>
            <span>🔥</span>
          </div>
        </div>

        <h2 className="font-display font-bold text-3xl text-neutral-900 dark:text-white text-center mb-2">
          Unlock Your Full{' '}
          <span className="text-primary-500">Interview Plan</span>
        </h2>

        <p className="text-neutral-500 dark:text-neutral-400 text-center text-sm mb-6">
          Everything you need to land your dream role
          <br />
          <span className="text-primary-500 font-medium">
            Early adopter pricing
          </span>
        </p>

        <div className="space-y-2.5 mb-8">
          {[
            'Unlimited interviews',
            'Advanced AI feedback',
            'AI Personal Coach',
            'Cancel Anytime',
          ].map((b) => (
            <div key={b} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-3 h-3 text-white dark:text-neutral-900" />
              </div>
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {b}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id as PlanId)}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${selected === plan.id
                ? 'border-primary-500 bg-white dark:bg-neutral-800 shadow-lg scale-[1.02]'
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                }`}
              disabled={isLoading || isProcessing}
            >
              {plan.badge && (
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-neutral-900 dark:text-white">
                    {plan.label}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{plan.note}</p>
                </div>

                <div className="flex items-center gap-3">
                  {'saving' in plan && plan.saving && (
                    <span className="bg-secondary-100 text-secondary-500 text-xs font-bold px-2 py-1 rounded-full">
                      {plan.saving}
                    </span>
                  )}

                  <div className="text-right">
                    <span className="line-through text-xs text-neutral-400 mr-1">
                      $10.00
                    </span>
                    <span className="font-display font-bold text-xl text-neutral-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {plan.period}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === plan.id
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-neutral-300'
                      }`}
                  >
                    {selected === plan.id && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleUpgrade}
          disabled={isLoading || isProcessing}
          className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors text-base shadow-soft mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Opening checkout...
            </span>
          ) : (
            `Start Free Trial — ${subscription.pro.trialDays} Days`
          )}
        </button>

        <button
          onClick={onSkip}
          disabled={isProcessing}
          className="w-full py-3 text-neutral-500 text-sm font-medium hover:text-neutral-700 transition-colors disabled:opacity-50"
        >
          Maybe later, continue free →
        </button>

        <p className="text-center text-xs text-neutral-400 mt-2">
          You'll not be charged · Cancel anytime
        </p>
      </div>
    </div>
  );
}

export default PaywallScreen;