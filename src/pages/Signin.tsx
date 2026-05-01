import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Provider } from '@supabase/supabase-js';
import { UnderDevelopmentComponent } from '../utils/utils';
import { useAuth } from '../lib/hooks/useAuth';
import toast from 'react-hot-toast';

const Signin = () => {
    const { user, profile, isLoading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [submittingEmail, setSubmittingEmail] = useState(false);

    useEffect(() => {
        if (!isLoading && user) {
            if (profile?.onboarding_completed) {
                navigate('/dashboard', { replace: true });
            } else if (profile) {
                const step = profile.last_onboarding_step || 0;
                navigate('/onboarding', { state: { step }, replace: true });
            }
        }
    }, [user, profile, isLoading, navigate]);

    
    if (isLoading || (user && !profile)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
        );
    }

    const onBack = () => {
        navigate(-1);
    };

    const onContinue = async (provider: Provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    const handleEmailSubmit = async (e: any) => {
        e.preventDefault()
        if (!email.includes('@')) {
            toast.error("Use a valid email")
            return};
        setSubmittingEmail(true)
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
            alert('Check your email for the login link!');
        } catch (error) {
            console.error('Error sending magic link:', error);
            alert('Failed to send magic link. Please try again.');
        } finally {
            setSubmittingEmail(false)
        }
    };

    return (
        <div className='px-6 py-6 max-w-xl m-auto'>
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
                    Welcome Back.
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm text-center mt-2">
                    Let's resume your journey to your dream job!
                </p>
            </div>

            <div className="space-y-3">
                {/* Google */}
                <button
                    onClick={() => {
                        onContinue("google")
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


                <UnderDevelopmentComponent>
                    {/* LinkedIn */}
                    <button
                        onClick={() => {
                            onContinue("linkedin")
                        }}
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
                        // onClick={()=>}
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
                    <form
                        className="space-y-2.5"
                        onSubmit={handleEmailSubmit}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3.5 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 transition-colors text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit(e)} />

                        <button

                            disabled={!email.includes('@') || submittingEmail}
                            className={`w-full flex items-center justify-center py-3.5 rounded-2xl font-bold text-sm transition-all ${email.includes('@') ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-soft ' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'}`}>

                            {submittingEmail ? <Loader2 className='animate-spin' /> : 'Continue with Email'}
                        </button>
                    </form>
                </UnderDevelopmentComponent>

            </div>
        </div>
    )
}

export default Signin