import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, MailIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Provider } from '@supabase/supabase-js';

interface AuthPageProps {
  onContinue: () => void;
  onBack: () => void;
}
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const [domainName, ...tld] = domain.split('.');
  const maskedLocal =
    local.length <= 2 ?
      local[0] + '*' :
      local[0] +
      '*'.repeat(Math.min(local.length - 2, 5)) +
      local[local.length - 1];
  const maskedDomain =
    domainName.length <= 2 ?
      domainName[0] + '*' :
      domainName[0] +
      '*'.repeat(Math.min(domainName.length - 2, 3)) +
      domainName[domainName.length - 1];
  return `${maskedLocal}@${maskedDomain}.${tld.join('.')}`;
}
// ─── OTP Screen ───────────────────────────────────────────────────────────────
function OTPScreen({
  email,
  onVerified,
  onBack




}: { email: string; onVerified: () => void; onBack: () => void; }) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);
  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  const handleChange = (index: number, value: string) => {
    // Handle paste
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      const newDigits = [...digits];
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 6) newDigits[index + i] = pasted[i];
      }
      setDigits(newDigits);
      setError(false);
      const nextIndex = Math.min(index + pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError(false);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
      }
    }
    if (e.key === 'ArrowLeft' && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5)
      inputRefs.current[index + 1]?.focus();
  };
  const handleVerify = () => {
    const code = digits.join('');
    if (code.length < 6) return;
    // Simulate verification — any 6-digit code works in demo
    onVerified();
  };
  const handleResend = () => {
    if (!canResend) return;
    setDigits(Array(6).fill(''));
    setError(false);
    setCanResend(false);
    setResendCountdown(30);
    inputRefs.current[0]?.focus();
  };
  const isFilled = digits.every((d) => d !== '');
  return (
    <div className="w-full max-w-sm animate-slide-up">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-10">

        <ArrowLeftIcon className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-5">
          <MailIcon className="w-7 h-7 text-primary-500" />
        </div>
        <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white text-center mb-2">
          Check your email
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm text-center leading-relaxed">
          We sent a 6-digit code to
        </p>
        <p className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm mt-0.5">
          {maskEmail(email)}
        </p>
      </div>

      {/* OTP boxes */}
      <div className="flex gap-2.5 justify-center mb-6">
        {digits.map((digit, i) =>
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            className={`w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 transition-all duration-200 outline-none bg-neutral-50 dark:bg-neutral-800
              ${error ? 'border-red-400 dark:border-red-500 text-red-600 dark:text-red-400 shake' : digit ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:border-primary-400 dark:focus:border-primary-500'}`} />

        )}
      </div>

      {error &&
        <p className="text-center text-sm text-red-500 dark:text-red-400 mb-4 animate-fade-in">
          Incorrect code. Please try again.
        </p>
      }

      {/* Resend */}
      <div className="text-center mb-6">
        {canResend ?
          <button
            onClick={handleResend}
            className="text-sm font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">

            Resend code
          </button> :

          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            Resend code in{' '}
            <span className="font-semibold text-neutral-600 dark:text-neutral-300 tabular-nums">
              {resendCountdown}s
            </span>
          </p>
        }
      </div>

      {/* Verify button */}
      <button
        onClick={handleVerify}
        disabled={!isFilled}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${isFilled ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-soft' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'}`}>

        Verify & Continue
      </button>

      <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 mt-4 leading-relaxed">
        Didn't receive it? Check your spam folder.
      </p>
    </div>);

}
// ─── Main Auth Page ────────────────────────────────────────────────────────────
export function AuthPage({ onContinue, onBack }: AuthPageProps) {
  const [view, setView] = useState<'main' | 'otp'>('main');
  const [email, setEmail] = useState('');
  const handleEmailSubmit = () => {
    if (!email.includes('@')) return;
    setView('otp');
  };

  const handleContinueWithGoogle = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/onboarding`
        }
      })

      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-900 flex flex-col items-center justify-center px-6 py-12">
      {view === 'otp' ?
        <OTPScreen
          email={email}
          onVerified={onContinue}
          onBack={() => setView('main')} /> :


        <div className="w-full max-w-sm animate-slide-up">
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-10">

            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Logo + headline */}
          <div className="flex flex-col items-center mb-8">
            <Link
              to="/">
              <img
                src="/[favicon]-Prep-mirror-white-bg.png"
                alt="PrepMirrors"
                className="w-14 h-14 rounded-2xl shadow-card mb-5" />
            </Link>
            <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white text-center">
              Create your free account
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm text-center mt-2">
              Save your progress and access your personalized plan
            </p>
          </div>

          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={()=>{
                handleContinueWithGoogle("google")
              }}
              className="w-full flex items-center gap-4 px-5 py-4 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm transition-all group">

              <div className="w-5 h-5 flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4" />

                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853" />

                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05" />

                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335" />

                </svg>
              </div>
              <span className="font-semibold text-neutral-700 dark:text-neutral-200 flex-1 text-left text-sm">
                Continue with Google
              </span>
              <ArrowRightIcon className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors" />
            </button>

            {/* LinkedIn */}
            <button
              onClick={onContinue}
              className="w-full flex items-center gap-4 px-5 py-4 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm transition-all group">

              <div className="w-5 h-5 flex-shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                  fill="#0A66C2">

                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <span className="font-semibold text-neutral-700 dark:text-neutral-200 flex-1 text-left text-sm">
                Continue with LinkedIn
              </span>
              <ArrowRightIcon className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors" />
            </button>

            {/* TikTok */}
            <button
              onClick={onContinue}
              className="w-full flex items-center gap-4 px-5 py-4 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm transition-all group">

              <div className="w-5 h-5 flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"
                    className="fill-neutral-900 dark:fill-white" />

                </svg>
              </div>
              <span className="font-semibold text-neutral-700 dark:text-neutral-200 flex-1 text-left text-sm">
                Continue with TikTok
              </span>
              <ArrowRightIcon className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors" />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                or continue with email
              </span>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
            </div>

            {/* Email form — inline, always visible */}
            <div className="space-y-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 transition-colors text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()} />

              <button
                onClick={handleEmailSubmit}
                disabled={!email.includes('@')}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${email.includes('@') ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-soft' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'}`}>

                Continue with Email
              </button>
            </div>

            {/* Skip */}
            <button
              onClick={onContinue}
              className="w-full py-2.5 text-neutral-400 dark:text-neutral-500 text-sm font-medium hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">

              Skip for now, continue as guest →
            </button>
          </div>

          {/* Legal */}
          <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 mt-6 leading-relaxed">
            By continuing, you agree to our{' '}
            <a
              href="#"
              className="underline hover:text-neutral-600 dark:hover:text-neutral-300">

              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="underline hover:text-neutral-600 dark:hover:text-neutral-300">

              Privacy Policy
            </a>
            .
          </p>
        </div>
      }
    </div>);

}