// frontend/src/components/admin/ActivationDashboard.tsx
import { useEffect, useState } from 'react';
import {
    TrendingUp, TrendingDown, Users, Target,
    Award, Calendar, Clock, BarChart3,
    ArrowUp, ArrowDown, Minus
} from 'lucide-react';

interface MetricCard {
    title: string;
    value: number;
    change: number;
    suffix?: string;
    icon: React.ReactNode;
    color: string;
}

interface FunnelStage {
    stage: string;
    count: number;
    percentage: number;
    dropOff: number;
}

export function ActivationDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [funnel, setFunnel] = useState<FunnelStage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        const response = await fetch('/api/admin/activation-metrics');
        const data = await response.json();
        setMetrics(data.metrics);
        setFunnel(data.funnel);
        setLoading(false);
    };

    const getChangeIcon = (change: number) => {
        if (change > 0) return <ArrowUp className="w-4 h-4 text-emerald-500" />;
        if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-neutral-500" />;
    };

    const getChangeColor = (change: number) => {
        if (change > 0) return 'text-emerald-600';
        if (change < 0) return 'text-red-600';
        return 'text-neutral-500';
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">Loading dashboard...</div>;
    }

    const metricCards: MetricCard[] = [
        {
            title: 'Total Signups',
            value: metrics.total_signups,
            change: metrics.signups_change,
            icon: <Users className="w-5 h-5" />,
            color: 'blue'
        },
        {
            title: 'First Value (Feedback Viewed)',
            value: metrics.first_value,
            change: metrics.first_value_change,
            suffix: ` (${metrics.first_value_rate}% of onboarding)`,
            icon: <Target className="w-5 h-5" />,
            color: 'green'
        },
        {
            title: 'Core Value (3+ Sessions/Week)',
            value: metrics.core_value,
            change: metrics.core_value_change,
            suffix: ` (${metrics.core_value_rate}% of first value)`,
            icon: <Award className="w-5 h-5" />,
            color: 'purple'
        },
        {
            title: 'Trial → Paid Conversion',
            value: metrics.trial_conversion_rate,
            change: 0,
            suffix: '%',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'orange'
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Activation Dashboard</h1>
                <p className="text-neutral-400">Track how users discover value and convert to paying customers</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricCards.map((card) => (
                    <div key={card.title} className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`text-${card.color}-400`}>{card.icon}</div>
                            <div className="flex items-center gap-1">
                                {getChangeIcon(card.change)}
                                <span className={`text-sm ${getChangeColor(card.change)}`}>
                                    {Math.abs(card.change).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {card.value.toLocaleString()}
                            {card.suffix && <span className="text-sm text-neutral-400 ml-1">{card.suffix}</span>}
                        </div>
                        <div className="text-sm text-neutral-500 mt-1">{card.title}</div>
                    </div>
                ))}
            </div>

            {/* Activation Funnel */}
            <div className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700">
                <h2 className="text-lg font-semibold text-white mb-4">Activation Funnel</h2>
                <div className="space-y-4">
                    {funnel.map((stage, index) => (
                        <div key={stage.stage}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-neutral-300">{stage.stage}</span>
                                <div className="flex gap-4">
                                    <span className="text-neutral-400">{stage.count.toLocaleString()} users</span>
                                    <span className="text-primary-400">{stage.percentage.toFixed(1)}%</span>
                                    {stage.dropOff > 0 && index > 0 && (
                                        <span className="text-red-400">-{stage.dropOff.toFixed(1)}% drop-off</span>
                                    )}
                                </div>
                            </div>
                            <div className="w-full bg-neutral-700 rounded-full h-2">
                                <div
                                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${stage.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Retention Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700">
                    <h2 className="text-lg font-semibold text-white mb-2">7-Day Retention by Activation</h2>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-emerald-400">✅ Activated users</span>
                                <span className="text-white font-bold">{metrics.day_7_retention_activated.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-neutral-700 rounded-full h-2">
                                <div
                                    className="bg-emerald-500 h-2 rounded-full"
                                    style={{ width: `${metrics.day_7_retention_activated}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-neutral-400">❌ Non-activated users</span>
                                <span className="text-white font-bold">{metrics.day_7_retention_non_activated.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-neutral-700 rounded-full h-2">
                                <div
                                    className="bg-neutral-500 h-2 rounded-full"
                                    style={{ width: `${metrics.day_7_retention_non_activated}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-4">
                        Activated users retain {((metrics.day_7_retention_activated / metrics.day_7_retention_non_activated) * 100).toFixed(0)}x better
                    </p>
                </div>

                {/* Bottlenecks */}
                <div className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700">
                    <h2 className="text-lg font-semibold text-white mb-2">Top Bottlenecks</h2>
                    <div className="space-y-2">
                        {funnel.slice(1).map((stage) => (
                            stage.dropOff > 20 && (
                                <div key={stage.stage} className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg">
                                    <span className="text-sm text-red-400">⚠️ {stage.stage}</span>
                                    <span className="text-sm text-red-400">{stage.dropOff.toFixed(1)}% drop-off</span>
                                </div>
                            )
                        ))}
                    </div>
                    <p className="text-xs text-neutral-500 mt-4">
                        Focus on reducing drop-offs at these stages to improve activation
                    </p>
                </div>
            </div>

            {/* Actionable Insights */}
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-primary-400 mb-2">📊 Key Insights</h2>
                <ul className="space-y-2 text-sm text-neutral-300">
                    <li>• {metrics.first_value_rate < 50 ? 'First value rate is low (<50%). Focus on helping users complete their first interview.' : 'First value rate is healthy. Now focus on getting users to return for 3+ sessions.'}</li>
                    <li>• {metrics.core_value_rate < 30 ? 'Core value rate needs improvement. Consider adding reminders or streaks.' : 'Core value rate is strong. Users are building habits!'}</li>
                    <li>• {metrics.day_7_retention_activated - metrics.day_7_retention_non_activated > 30 ? 'Activation has a massive impact on retention. Prioritize getting users to core value.' : 'Keep improving activation - every percentage point matters.'}</li>
                </ul>
            </div>
        </div>
    );
}