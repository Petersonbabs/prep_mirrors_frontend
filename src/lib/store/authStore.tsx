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
    subscription_tier?: 'free' | 'pro'
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
                    next_billing_date: data.next_billing_date,
                    subscription_tier: data.subscription_tier
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
        setIsLoading(true)
        await supabase.auth.signOut();
        setIsLoading(false)
        setSession(null);
        setProfile(null);
    };

    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();

                if (!mounted) return;
                setSession(initialSession);
                setIsLoading(false);

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
            setSession(currentSession);

            if (currentSession?.user) {
                fetchProfile(currentSession.user.id);
            } else {
                setProfile(null);
            }
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
