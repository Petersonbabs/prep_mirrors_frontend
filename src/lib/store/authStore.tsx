import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export interface UserProfile {
    name: string;
    targetRole: string;
    level: string;
    goal: string;
    hiring_timeline: string;
    last_onboarding_step?: number;
    pre_first_interview_confidence?: number | null;
    post_first_interview_confidence?: number | null;
    onboarding_completed?: boolean;
    email?: string;
    plan_type?: 'free' | 'pro';
    subscription_status?: 'active' | 'trialing' | 'cancelled' | 'expired';
    trial_end_date?: string | null;
    next_billing_date?: string | null;
}

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    refreshProfile: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const user = session?.user ?? null;

    const fetchProfile = useCallback(async (userId: string) => {
        console.log('AuthProvider: Fetching profile for', userId);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code !== 'PGRST116') {
                    console.error('AuthProvider: Profile fetch error:', error);
                }
                setProfile(null);
                return;
            }

            if (data) {
                setProfile({
                    name: data.full_name || '',
                    targetRole: data.target_role || '',
                    level: data.experience_level || '',
                    goal: data.biggest_challenge || '',
                    hiring_timeline: data.hiring_timeline || '',
                    last_onboarding_step: data.last_onboarding_step || 0,
                    pre_first_interview_confidence: data.pre_first_interview_confidence,
                    post_first_interview_confidence: data.post_first_interview_confidence,
                    onboarding_completed: data.onboarding_completed,
                    email: data.email || '',
                    plan_type: data.plan_type || 'free',
                    subscription_status: data.subscription_status || 'free',
                    trial_end_date: data.trial_end_date,
                    next_billing_date: data.next_billing_date
                });
            } else {
                setProfile(null);
            }
        } catch (err) {
            console.error('AuthProvider: Unexpected error fetching profile:', err);
            setProfile(null);
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    }, [user, fetchProfile]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
    };

    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            try {
                // 1. Get current session immediately (very fast, usually local)
                const { data: { session: initialSession } } = await supabase.auth.getSession();

                if (!mounted) return;
                setSession(initialSession);

                // 2. Clear loading as soon as we know IF we have a user.
                // This allows the app to render the protected routes or signin page immediately.
                setIsLoading(false);
                console.log('AuthProvider: Initial session check done, loading cleared.');

                // 3. Fetch profile in the background if we have a user
                if (initialSession?.user) {
                    fetchProfile(initialSession.user.id);
                }
            } catch (err) {
                console.error('AuthProvider: Initialization error:', err);
                if (mounted) setIsLoading(false);
            }
        };

        initialize();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (!mounted) return;
            console.log('AuthProvider: Auth event:', event);

            setSession(currentSession);

            if (currentSession?.user) {
                // If it's a sign-in or token refresh, we update the profile.
                // We don't wait for it here to prevent blocking the UI.
                fetchProfile(currentSession.user.id);
            } else {
                setProfile(null);
            }

            // Fail-safe: always ensure loading is off after an auth event
            setIsLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    return (
        <AuthContext.Provider value={{ session, user, profile, isLoading, refreshProfile, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
