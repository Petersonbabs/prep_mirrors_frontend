const formerPrice = 10
const proMonthly = 7.99
const proAnnually = 4.99
const proFormerAnnually = proMonthly
const monthlyYearCost = proMonthly * 12
const annualYearCost = proAnnually * 12

export const subscription = {
    free: {
        features: [
            '3 mock interviews/month',
            'Basic AI feedback',
            'Technical & behavioral prep',
            'Progress tracking'
        ],
        price: {
            monthly: 0,
            annually: 0
        }
    },
    pro: {
        features: [
            'Unlimited interviews',
            'Advanced AI feedback',
            'AI Personal Coach',
            'Full question bank access',
            'Detailed performance analytics',
            'Interview script templates',
            // '50+ company scenarios',
            // 'Voice analysis',
            'Priority support',
            "Cancel anytime"
        ],
        price: {
            monthly: proMonthly,
            annually: proAnnually
        },
        priceIds: {
            monthly: "pri_01kkmpxhr6ynqm05dtffzmz3sc",
            annual: "pri_01kkmq1b7r3vkmxt92hhw9265v"
        },
        trialDays: 3,
        percentageOff: ((monthlyYearCost - annualYearCost) / monthlyYearCost * 100).toFixed(0),
        proFormerAnnually
    }
}
export type PlanId = 'annual' | 'monthly'
export type Plan = 'free' | 'pro'

export const plans = [
    {
        id: 'annual',
        label: 'Annual Plan',
        price: `$${subscription.pro.price.annually}`,
        period: '/month',
        note: `Billed $${subscription.pro.price.annually * 12}/year`,
        badge: 'BEST VALUE',
        saving: `${subscription.pro.percentageOff}% OFF`
    },
    {
        id: 'monthly',
        label: 'Monthly Plan',
        price: `$${subscription.pro.price.monthly}`,
        period: '/month',
        note: 'Cancel anytime'
    }
]

export const messages = {

    twoDaysBeforeTrialEnd: {
        title: "Your trial ends in 2 days",
        message: "You will be automatically charged for the Pro plan. You can cancel anytime before then."
    },
    oneDayBeforeTrialEnd: {
        title: "Your trial ends in 24 hours",
        message: "You will be automatically charged for the Pro plan. You can cancel anytime before then."
    },
    trialConvertedToPro: {
        title: "Welcome to Pro!",
        message: "Congratulations! Your trial has ended and you've been upgraded to Pro. Enjoy unlimited interviews and advanced AI feedback!"
    }
}