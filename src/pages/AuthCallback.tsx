// src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
    const navigate = useNavigate();
    console.log('Current URL:', window.location.href);
    console.log('Origin:', window.location.origin);
    console.log('Hash:', window.location.hash);
    console.log('Search:', window.location.search);

    useEffect(() => {
        const handleAuthCallback = async () => {
            // Get the session from the URL hash/query params
            const { data: { session }, error } = await supabase.auth.getSession();
            console.log('Session:', session);
            console.log('Error:', error);

            if (error || !session?.user) {
                console.error('Auth error:', error);
                navigate('/signin');
                return;
            }

            const userId = session.user.id;
            const userEmail = session.user.email;

            // Check if profile exists and onboarding is completed
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select("*")
                .eq('id', userId)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
                navigate('/onboarding');
                return;
            }


            // Redirect based on onboarding status
            if (!profile?.onboarding_completed || profile.subscription_tier === "free") {
                navigate('/onboarding');
            } else {
                navigate('/dashboard');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-neutral-600">Completing sign in...</p>
            </div>
        </div>
    );
}