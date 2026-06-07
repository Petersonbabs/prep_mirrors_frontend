// frontend/src/hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Subscription, subscriptionApi } from '../api/subscription';
import { progressApi } from '../api/progress';
import type { UserStats } from './useProgressData';

export function useDashboardData() {
    const { user, profile } = useAuth();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        interviewsDone: 0,
        questionsAnswered: 0,
        skillsImproved: 0,
        badgesEarned: 0,
    });

    useEffect(() => {
        if (user?.id) {
            Promise.all([
                loadSubscription(),
                loadStats()
            ]).finally(() => setLoading(false));
        }
    }, [user]);

    const loadSubscription = async () => {
        const response = await subscriptionApi.getStatus(user?.id as string);
        if (response.success) {
            setSubscription(response.data as any ?? null);
        }
    };

    const loadStats = async () => {
        try {
            const response = await progressApi.getStats();
            if (response.success && response.data) {
                const statsData = response.data;
                setStats({
                    interviewsDone: statsData.total_sessions || 0,
                    questionsAnswered: statsData.total_questions || 0,
                    skillsImproved: statsData.skills_improved || 0,
                    badgesEarned: statsData.badges_earned || 0,
                });
            }
        } catch (error) {
            
        }
    };

    return {
        subscription,
        loading,
        stats,
        firstName: profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there',
    };
}