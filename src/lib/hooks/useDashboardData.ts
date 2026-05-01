// frontend/src/hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Subscription, subscriptionApi } from '../api/subscription';

export function useDashboardData() {
    const { user, profile } = useAuth();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [streak, setStreak] = useState(4);
    const [stats, setStats] = useState({
        interviewsDone: 7,
        questionsAnswered: 34,
        skillsImproved: 5,
        badgesEarned: 3,
    });


    useEffect(() => {
        if (user?.id) {
            loadSubscription();
        }
    }, [user]);

    const loadSubscription = async () => {
        const subscription = await subscriptionApi.getStatus(user?.id as string);
        setSubscription(subscription.data as any ?? null);
        setLoading(false);
    };

    return {
        subscription,
        loading,
        streak,
        stats,
        firstName: user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there',
    };
}