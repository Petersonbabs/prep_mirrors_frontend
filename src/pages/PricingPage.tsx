import React, { useEffect, useState, useRef, createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShieldCheckIcon
} from
  'lucide-react';
import { ExitIntentModal } from '../components/ExitIntentModal';
import { subscription } from '../data/pricing';
import { UnderDevelopmentComponent } from '../utils/utils';
// Replace with your real public key from your payment dashboard
const PAYMENT_PUBLIC_KEY = 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxx-X';
const FREE_FEATURES = subscription.free.features;
const PRO_FEATURES = subscription.pro.features;



const COMPARISON_ROWS = [
  {
    feature: 'Mock Interviews',
    free: 3,
    pro: 'Unlimited'
  },
  {
    feature: 'AI Feedback',
    free: 'Basic',
    pro: 'Advanced'
  },
  {
    feature: 'Question Bank',
    free: 'Limited',
    pro: 'Full access'
  },
  {
    feature: 'Progress Tracking',
    free: true,
    pro: true
  },
  {
    feature: 'Performance Analytics',
    free: false,
    pro: true
  },
  {
    feature: 'Interview Templates',
    free: false,
    pro: true
  },
  {
    feature: 'AI Personal Coaching',
    free: false,
    pro: true
  },
  {
    feature: 'Interview script templates',
    free: false,
    pro: true
  },
  // {
  //   feature: 'Real Company Scenarios',
  //   free: "3 companies",
  //   pro: "50+ companies"
  // },
  {
    feature: 'Dedicated Support',
    free: false,
    pro: true
  }];

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, cancel from your account settings at any time. No questions asked, no cancellation fees.'
  },
  {
    q: 'What happens after my free trial?',
    a: "Your account will be upgr. Your data, sessions, and progress are always saved regardless of plan."
  },
  // {
  //   q: 'Is there a student discount?',
  //   a: 'Yes! Email us at hello@prepmirrors.com with your .edu address for 50% off any plan.'
  // },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards, bank transfers, and mobile money. Your payment info is always secure and encrypted.'
  },
  // {
  //   q: 'Can I switch between annual and monthly?',
  //   a: 'Yes, you can change your billing cycle anytime from your account settings. Changes take effect at the next billing date.'
  // }
];

export function PricingPage() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  // Exit intent state
  const [showExitModal, setShowExitModal] = useState(false);
  const hasShownExitModal = useRef(false);
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves the top of the viewport
      if (e.clientY <= 0 && !hasShownExitModal.current) {
        hasShownExitModal.current = true;
        setShowExitModal(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  const proMonthlyUSD = 19.99;
  const proAnnualUSD = 9.99; // per month, billed annually
  const proPrice = isAnnual ? `$${proAnnualUSD}` : `$${proMonthlyUSD}`;
  const proAmount = isAnnual ? proAnnualUSD * 12 : proMonthlyUSD;
  const handleCheckout = () => {
    setPayLoading(true);
    const txRef = `pm_${new Date().getTime()}`;
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.onload = () => {
      // @ts-ignore
      window.FlutterwaveCheckout({
        public_key: PAYMENT_PUBLIC_KEY,
        tx_ref: txRef,
        amount: proAmount,
        currency: 'USD',
        payment_options: 'card,banktransfer,ussd,mobilemoney',
        customer: {
          email: 'user@example.com' // Replace with actual user email
        },
        customizations: {
          title: 'PrepMirrors Pro',
          description: isAnnual ? 'Pro Plan — Annual' : 'Pro Plan — Monthly',
          logo: "/[favicon]-Prep-mirror-white-bg.png"
        },
        callback: (response: { transaction_id: string; status: string; }) => {
          setPayLoading(false);
          if (response.status === 'successful') {
            navigate('/dashboard');
          }
        },
        onclose: () => {
          setPayLoading(false);
        }
      });
    };
    script.onerror = () => setPayLoading(false);
    document.body.appendChild(script);
  };
  const handleExitFeedbackSubmit = (reason: string, otherText?: string) => {
    console.log('Exit intent feedback:', {
      reason,
      otherText
    });
    // In a real app, you would send this to your analytics or backend
  };
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* ── Hero ── */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-500 mb-3">
            Pricing
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-neutral-900 dark:text-white mb-4 leading-tight">
            One plan. Everything you need.
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto mb-8">
            Start free, upgrade when you're ready. No hidden fees.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-2xl p-1.5 border border-neutral-200 dark:border-neutral-700 shadow-card">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${!isAnnual ? 'bg-primary-500 text-white shadow-soft' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>

              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isAnnual ? 'bg-primary-500 text-white shadow-soft' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>

              Annual
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${isAnnual ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>

                Save {subscription.pro.percentageOff}%
              </span>
            </button>
          </div>
        </div>

        {/* ── Pricing cards ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-700 shadow-card flex flex-col">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 rounded-full mb-4">
                Free forever
              </span>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display font-bold text-5xl text-neutral-900 dark:text-white">
                  $0
                </span>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Get started with the basics
              </p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {FREE_FEATURES.map((f) =>
                <li key={f} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {f}
                  </span>
                </li>
              )}
            </ul>
            <button
              onClick={() => navigate('/auth')}
              className="w-full py-3.5 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all">

              Get Started Free
            </button>
          </div>

          {/* Pro */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border-2 border-primary-500 shadow-soft flex flex-col relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-primary-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-soft whitespace-nowrap">
                ✦ Most Popular
              </span>
            </div>
            <div className="mb-6">
              <p className='line-through text-neutral-500 dark:text-neutral-400 text-xl'>
                {isAnnual &&
                  `$${subscription.pro.proFormerAnnually.toFixed(2)}`
                }
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display font-bold text-5xl text-neutral-900 dark:text-white">
                  ${isAnnual ? subscription.pro.price.annually : subscription.pro.price.monthly}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                  /mo
                </span>
              </div>
              {isAnnual &&
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                  Billed annually · ${(subscription.pro.price.annually * 12).toFixed(0)}/year
                </p>
              }
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Everything you need to land the job
              </p>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {PRO_FEATURES.map((f) =>
                <li key={f} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {f}
                  </span>
                </li>
              )}
            </ul>
            <button
              onClick={handleCheckout}
              disabled={payLoading}
              className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors shadow-soft mb-2">

              {payLoading ? 'Loading...' : 'Start 7-Day Free Trial →'}
            </button>
            <UnderDevelopmentComponent>
              <p className="text-center text-xs text-neutral-400 mb-1">
                No credit card required
              </p>
            </UnderDevelopmentComponent>
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>Secure checkout · Cards, Bank Transfer & USSD</span>
            </div>
          </div>
        </div>

        {/* ── Comparison table ── */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-card mb-16">
          <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700">
            <h2 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
              Full comparison
            </h2>
          </div>
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-700/50">
              <tr>
                <th className="text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 px-6 py-3">
                  Feature
                </th>
                <th className="text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 px-6 py-3">
                  Free
                </th>
                <th className="text-center text-xs font-semibold text-primary-500 px-6 py-3">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map(({ feature, free, pro }, i) =>
                <tr
                  key={feature}
                  className={`border-t border-neutral-100 dark:border-neutral-700/50 ${i % 2 === 0 ? '' : 'bg-neutral-50/50 dark:bg-neutral-700/20'}`}>

                  <td className="px-6 py-3.5 text-sm text-neutral-700 dark:text-neutral-300">
                    {feature}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    {typeof free === 'boolean' ?
                      free ?
                        <CheckIcon className="w-4 h-4 text-emerald-500 mx-auto" /> :

                        <span className="text-neutral-300 dark:text-neutral-600 text-lg">
                          —
                        </span> :


                      <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                        {free}
                      </span>
                    }
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    {typeof pro === 'boolean' ?
                      pro ?
                        <CheckIcon className="w-4 h-4 text-primary-500 mx-auto" /> :

                        <span className="text-neutral-300 dark:text-neutral-600 text-lg">
                          —
                        </span> :


                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                        {pro}
                      </span>
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── FAQ ── */}
        <div className="mb-16">
          <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQS.map(({ q, a }, i) =>
              <div
                key={i}
                className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">

                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left">

                  <span className="font-semibold text-sm text-neutral-900 dark:text-white">
                    {q}
                  </span>
                  {openFaq === i ?
                    <ChevronUpIcon className="w-4 h-4 text-neutral-400 flex-shrink-0" /> :

                    <ChevronDownIcon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i &&
                  <div className="px-5 pb-4 border-t border-neutral-100 dark:border-neutral-700 pt-3">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {a}
                    </p>
                  </div>
                }
              </div>
            )}
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-6 border-t border-neutral-200 dark:border-neutral-700">
          {[
            {
              iconSrc: 'https://cdn.lordicon.com/lupuorrc.json',
              text: 'Secure payments'
            },
            {
              iconSrc: 'https://cdn.lordicon.com/hbkftmgg.json',
              text: 'Cards, Bank Transfer & USSD'
            },
            {
              iconSrc: 'https://cdn.lordicon.com/rmgwdhlk.json',
              text: 'Cancel anytime'
            },
            {
              iconSrc: 'https://cdn.lordicon.com/dqjjoysy.json',
              text: 'Student discounts available'
            }].
            map(({ iconSrc, text }) =>
              <div
                key={text}
                className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">

                <lord-icon
                  src={iconSrc}
                  trigger="hover"
                  colors="primary:#6366f1,secondary:#a5b4fc"
                  style={
                    {
                      width: '22px',
                      height: '22px',
                      flexShrink: 0
                    } as React.CSSProperties
                  } />

                <span>{text}</span>
              </div>
            )}
        </div>
      </div>

      <ExitIntentModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onSubmit={handleExitFeedbackSubmit} />

    </div>);

}