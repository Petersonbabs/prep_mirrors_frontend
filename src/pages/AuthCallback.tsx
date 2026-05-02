// frontend/src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session?.user) {
                console.error('Auth error:', error);
                navigate('/signin');
                return;
            }

            const userId = session.user.id;
            const userEmail = session.user.email;
            const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
            const userAvatar = session.user.user_metadata?.avatar_url; // Google profile picture

            // Check if profile exists
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError || !profile) {
                // Create new profile with avatar
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: userId,
                        email: userEmail,
                        full_name: userName,
                        avatar_url: userAvatar, // Save the profile picture
                        onboarding_completed: false,
                    });

                if (insertError) {
                    console.error('Error creating profile:', insertError);
                }

                navigate('/onboarding');
                return;
            }

            // Update avatar if it changed
            if (profile.avatar_url !== userAvatar) {
                await supabase
                    .from('profiles')
                    .update({ avatar_url: userAvatar })
                    .eq('id', userId);
            }

            // Redirect based on onboarding status
            if (!profile?.onboarding_completed) {
                navigate('/onboarding');
            } else {
                navigate('/dashboard');
            }
        };

        handleCallback();
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