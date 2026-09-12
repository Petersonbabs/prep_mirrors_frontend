import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { UserProfile } from '../types';



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
                    avatar_url: data.avatar_url || '',
                    targetRole: data.target_role || '',
                    level: data.experience_level || '',
                    // `goal` is the canonical column; `biggest_challenge` is the
                    // older name kept as a fallback for profiles not yet backfilled.
                    goal: data.goal || data.biggest_challenge || '',
                    hiring_timeline: data.hiring_timeline || '',
                    last_onboarding_step: data.last_onboarding_step || 0,
                    pre_first_interview_confidence: data.pre_first_interview_confidence,
                    post_first_interview_confidence: data.post_first_interview_confidence,
                    onboarding_completed: data.onboarding_completed,
                    email: data.email || '',
                    subscription_status: data.subscription_status || 'free',
                    // profiles has trial_ends_at; there are no plan_type or
                    // next_billing_date columns, so those mappings were always
                    // undefined. Tier comes from subscription_tier.
                    trial_end_date: data.trial_ends_at,
                    subscription_tier: data.subscription_tier,
                    has_seen_walkthrough: data.has_seen_walkthrough
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

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
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
