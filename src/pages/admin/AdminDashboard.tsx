// frontend/src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import {
    Users, Calendar, Target, Award, TrendingUp,
    ArrowUp, ArrowDown, Loader2, Mail, MessageSquare,
    CheckCircle, Clock, Star, Zap, Crown
} from 'lucide-react';

interface DashboardStats {
    stats: {
        users: { total: number; thisWeek: number; today: number };
        interviews: { total: number; today: number };
        subscriptions: { pro: number; trialing: number };
        waitlist: { total: number; thisWeek: number };
    };
    recentUsers: Array<{ id: string; full_name: string; email: string; created_at: string; subscription_tier: string }>;
    recentWaitlist: Array<{ id: string; email: string; created_at: string; role: string }>;
}

interface GrowthData {
    date: string;
    signups: number;
}

export function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [growthData, setGrowthData] = useState<GrowthData[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const [statsRes, growthRes] = await Promise.all([
                fetch('/api/admin/dashboard/stats'),
                fetch('/api/admin/dashboard/growth'),
            ]);

            const statsData = await statsRes.json();
            const growthData = await growthRes.json();

            setStats(statsData);
            setGrowthData(growthData.data || []);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    const totalActive = (stats?.stats.subscriptions.pro || 0) + (stats?.stats.subscriptions.trialing || 0);
    const conversionRate = stats?.stats.users.total
        ? ((totalActive / stats.stats.users.total) * 100).toFixed(1)
        : '0';

    return (
        <div className="min-h-screen bg-neutral-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-neutral-400 mt-1">Track PrepMirrors growth and user activity</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Total Users */}
                    <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
                        <div className="flex items-center justify-between mb-3">
                            <Users className="w-5 h-5 text-blue-400" />
                            <span className="text-xs text-neutral-500">All time</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{formatNumber(stats?.stats.users.total || 0)}</div>
                        <div className="flex items-center gap-2 mt-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-emerald-400">+{stats?.stats.users.thisWeek || 0} this week</span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-2">Total signups</div>
                    </div>

                    {/* Interviews */}
                    <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
                        <div className="flex items-center justify-between mb-3">
                            <Target className="w-5 h-5 text-purple-400" />
                            <span className="text-xs text-neutral-500">All time</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{formatNumber(stats?.stats.interviews.total || 0)}</div>
                        <div className="text-sm text-neutral-400 mt-2">+{stats?.stats.interviews.today || 0} today</div>
                        <div className="text-xs text-neutral-500 mt-2">Interview sessions completed</div>
                    </div>

                    {/* Pro Users */}
                    <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
                        <div className="flex items-center justify-between mb-3">
                            <Crown className="w-5 h-5 text-yellow-400" />
                            <span className="text-xs text-neutral-500">Active</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats?.stats.subscriptions.pro || 0}</div>
                        <div className="text-sm text-neutral-400 mt-2">+{stats?.stats.subscriptions.trialing || 0} on trial</div>
                        <div className="text-xs text-neutral-500 mt-2">Paying customers</div>
                    </div>

                    {/* Waitlist */}
                    <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
                        <div className="flex items-center justify-between mb-3">
                            <Mail className="w-5 h-5 text-emerald-400" />
                            <span className="text-xs text-neutral-500">Waiting</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{formatNumber(stats?.stats.waitlist.total || 0)}</div>
                        <div className="flex items-center gap-2 mt-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-emerald-400">+{stats?.stats.waitlist.thisWeek || 0} this week</span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-2">Waitlist signups</div>
                    </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Today's Activity */}
                    <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary-400" />
                            Today's Activity
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">New signups</span>
                                <span className="text-white font-bold">{stats?.stats.users.today || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Interviews completed</span>
                                <span className="text-white font-bold">{stats?.stats.interviews.today || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Waitlist joins</span>
                                <span className="text-white font-bold">{stats?.stats.waitlist.thisWeek || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Conversion Metrics */}
                    <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary-400" />
                            Conversion Metrics
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Pro conversion rate</span>
                                <span className="text-white font-bold">{conversionRate}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Active trials</span>
                                <span className="text-white font-bold">{stats?.stats.subscriptions.trialing || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Waitlist to signup</span>
                                <span className="text-white font-bold">--</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity - Two Column */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Signups */}
                    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                        <div className="p-4 border-b border-neutral-800">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary-400" />
                                Recent Signups
                            </h3>
                        </div>
                        <div className="divide-y divide-neutral-800">
                            {stats?.recentUsers.map((user) => (
                                <div key={user.id} className="p-4 hover:bg-neutral-800/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-medium">{user.full_name || 'Anonymous'}</p>
                                            <p className="text-sm text-neutral-500">{user.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded-full ${user.subscription_tier === 'pro'
                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                    : 'bg-neutral-700 text-neutral-400'
                                                }`}>
                                                {user.subscription_tier === 'pro' ? 'Pro' : 'Free'}
                                            </span>
                                            <p className="text-xs text-neutral-600 mt-1">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                                <div className="p-8 text-center text-neutral-500">No signups yet</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Waitlist */}
                    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                        <div className="p-4 border-b border-neutral-800">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary-400" />
                                Recent Waitlist
                            </h3>
                        </div>
                        <div className="divide-y divide-neutral-800">
                            {stats?.recentWaitlist.map((entry) => (
                                <div key={entry.id} className="p-4 hover:bg-neutral-800/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-medium">{entry.email}</p>
                                            {entry.role && (
                                                <p className="text-sm text-neutral-500">Target: {entry.role}</p>
                                            )}
                                        </div>
                                        <p className="text-xs text-neutral-600">
                                            {new Date(entry.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(!stats?.recentWaitlist || stats.recentWaitlist.length === 0) && (
                                <div className="p-8 text-center text-neutral-500">No waitlist entries yet</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Growth Chart Placeholder */}
                <div className="mt-6 bg-neutral-900 rounded-xl p-5 border border-neutral-800">
                    <h3 className="text-white font-semibold mb-4">User Growth</h3>
                    {growthData.length > 0 ? (
                        <div className="h-64 flex items-end gap-1">
                            {growthData.slice(-30).map((point, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-primary-500/50 hover:bg-primary-500 transition-all rounded-t"
                                        style={{ height: `${Math.max(4, (point.signups / Math.max(...growthData.map(d => d.signups))) * 100)}%` }}
                                    />
                                    <span className="text-xs text-neutral-600 rotate-45 mt-2 hidden md:block">
                                        {new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-neutral-500">
                            No growth data yet. Signups will appear here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}