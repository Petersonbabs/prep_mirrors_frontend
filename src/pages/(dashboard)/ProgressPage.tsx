import { useState, Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUpIcon,
  ArrowLeftIcon,
  ZapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2
} from 'lucide-react';
import { useProgressData, useSessionHistory } from '../../lib/hooks/useProgressData';

type DateRange = '7d' | '30d' | 'all';

const AREA_LABELS = [
  'Answer Structure',
  'Communication Clarity',
  'Confidence & Delivery',
  'Content Depth',
  'Engagement & Energy'
];

const EMOJIS = ['😰', '😟', '😐', '🙂', '😄'];

function scoreColor(s: number) {
  if (s >= 80) return 'bg-emerald-500';
  if (s >= 65) return 'bg-amber-400';
  return 'bg-red-400';
}

function scoreBadge(s: number) {
  if (s >= 80)
    return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400';
  if (s >= 65)
    return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400';
  return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
}

export function ProgressPage() {
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useProgressData();
  const { sessions, hasMore, loadMore, loading: loadingSessionHistory } = useSessionHistory()
  console.log(sessions)
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);

  const maxScore = 100;
  const gridLines = [60, 70, 80, 90];

  // Update trend data when range changes
  useEffect(() => {
    if (data?.score_trend?.data) {
      // Filter by date range if needed (API already handles this)
      setTrendData(data.score_trend.data);
    }
  }, [data, dateRange]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading progress</p>
          <button onClick={refresh} className="text-primary-500">Try again</button>
        </div>
      </div>
    );
  }

  if (!data || data.stats.total_sessions === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className="text-center">
          <p className="text-neutral-500 mb-4">No data yet. Complete your first interview!</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-primary-500 text-white rounded-xl"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  const { stats, recent_sessions, skill_improvement, confidence_journey } = data;

  // Calculate summary stats from real data
  const avgScore = stats.avg_score;
  const firstSessionScore = recent_sessions[recent_sessions.length - 1]?.score || 0;
  const scoreImprovement = avgScore - firstSessionScore;

  const bestSession = stats.best_session;
  const confidenceGain = stats.confidence_gain;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors mb-2"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white flex items-center gap-2">
              <TrendingUpIcon className="w-7 h-7 text-primary-500" />
              Your Progress
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">
              Track your improvement across {stats.total_sessions} sessions
            </p>
          </div>
          <div className="flex gap-1 bg-white dark:bg-neutral-800 rounded-xl p-1 border border-neutral-100 dark:border-neutral-700 w-fit">
            {(['7d', '30d', 'all'] as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${dateRange === r ? 'bg-primary-500 text-white shadow-sm' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
              >
                {r === 'all' ? 'All time' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats - REAL DATA */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-700 shadow-card">
            <span className="text-xl mb-2 block">🎤</span>
            <p className="font-display font-bold text-xl text-neutral-900 dark:text-white">
              {stats.total_sessions}
            </p>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">
              Sessions Completed
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              Total practice sessions
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-700 shadow-card">
            <span className="text-xl mb-2 block">📊</span>
            <p className="font-display font-bold text-xl text-neutral-900 dark:text-white">
              {avgScore}/100
            </p>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">
              Avg Score
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              {scoreImprovement > 0 ? `↑${scoreImprovement} pts` : 'from first session'}
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-700 shadow-card">
            <span className="text-xl mb-2 block">🏆</span>
            <p className="font-display font-bold text-xl text-neutral-900 dark:text-white">
              {stats.best_score}/100
            </p>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">
              Best Score
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              {bestSession?.company || 'N/A'} · {bestSession?.phase || ''}
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-700 shadow-card">
            <span className="text-xl mb-2 block">💪</span>
            <p className="font-display font-bold text-xl text-neutral-900 dark:text-white">
              +{confidenceGain} pts
            </p>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">
              Confidence Gain
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              😰 → 🙂 avg improvement
            </p>
          </div>
        </div>

        {/* Score Trend Chart - REAL DATA */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 shadow-card mb-6">
          <h2 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-5">
            Score Over Time
          </h2>
          {trendData.length > 0 ? (
            <div className="relative" style={{ height: '180px' }}>
              {/* Gridlines */}
              {gridLines.map((g) => (
                <div
                  key={g}
                  className="absolute w-full border-t border-dashed border-neutral-100 dark:border-neutral-700 flex items-center"
                  style={{ bottom: `${g / maxScore * 100}%` }}
                >
                  <span className="text-xs text-neutral-300 dark:text-neutral-600 pr-2 -translate-y-1/2 w-6 text-right flex-shrink-0">
                    {g}
                  </span>
                </div>
              ))}
              {/* Bars */}
              <div className="absolute inset-0 flex items-end gap-2 pl-8">
                {trendData.map((point, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                      {point.score}
                    </span>
                    <div
                      className={`w-full rounded-t-lg ${scoreColor(point.score)} transition-all duration-500`}
                      style={{ height: `${point.score / maxScore * 140}px` }}
                    />
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
                      {point.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              Complete more interviews to see your score trend
            </div>
          )}
          <div className="flex gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
            {[
              { color: 'bg-red-400', label: 'Below 65' },
              { color: 'bg-amber-400', label: '65–79' },
              { color: 'bg-emerald-500', label: '80+' }
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${color}`} />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills + Confidence - REAL DATA */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Skill Improvement - REAL DATA */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 shadow-card">
            <h2 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-5">
              Skill Improvement
            </h2>
            {skill_improvement ? (
              <div className="space-y-4">
                {AREA_LABELS.map((label, i) => {
                  const areaKey = ['structure', 'clarity', 'confidence', 'depth', 'engagement'][i];
                  const before = skill_improvement.before[areaKey as keyof typeof skill_improvement.before] || 0;
                  const after = skill_improvement.after[areaKey as keyof typeof skill_improvement.after] || 0;
                  const delta = after - before;
                  const isBest = delta === Math.max(
                    skill_improvement.delta.structure,
                    skill_improvement.delta.clarity,
                    skill_improvement.delta.confidence,
                    skill_improvement.delta.depth,
                    skill_improvement.delta.engagement
                  );

                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-semibold ${isBest ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-400'}`}>
                          {label} {isBest && '⭐'}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isBest ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                          +{delta}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400 w-10">Before</span>
                          <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div className="h-full bg-neutral-300 dark:bg-neutral-600 rounded-full" style={{ width: `${before}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-neutral-500 w-6 text-right">{before}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400 w-10">After</span>
                          <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isBest ? 'bg-primary-500' : 'bg-indigo-400'}`} style={{ width: `${after}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 w-6 text-right">{after}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                Complete more interviews to see skill improvement
              </div>
            )}
          </div>

          {/* Confidence Journey - REAL DATA */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 shadow-card">
            <h2 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-5">
              Confidence Journey
            </h2>
            {confidence_journey?.entries && confidence_journey.entries.length > 0 ? (
              <div className="space-y-3 mb-5">
                {confidence_journey.entries.map((entry, i) => {
                  const delta = entry.post - entry.pre;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-neutral-400 w-16 flex-shrink-0">
                        Session {entry.session_number}
                      </span>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-base">{EMOJIS[entry.pre - 1] || '😐'}</span>
                        <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-400 rounded-full" style={{ width: `${entry.post / 5 * 100}%` }} />
                        </div>
                        <span className="text-base">{EMOJIS[entry.post - 1] || '😐'}</span>
                      </div>
                      <span className={`text-xs font-bold w-8 text-right ${delta > 0 ? 'text-emerald-500' : 'text-neutral-400'}`}>
                        {delta > 0 ? `+${delta}` : delta === 0 ? '0' : delta}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                Complete interviews to track confidence
              </div>
            )}
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 border border-primary-100 dark:border-primary-800">
              <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                Your confidence has improved by {confidence_journey?.average_gain || 0} points
              </p>
              <p className="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                Average confidence gain: +{confidence_journey?.average_gain || 0} points
              </p>
            </div>
          </div>
        </div>

        {/* Session History - REAL DATA */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-card overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700">
            <h2 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
              All Sessions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-700/50">
                <tr>
                  {['#', 'Company', 'Role', 'Phase', 'Score', 'Date', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent_sessions.map((s, idx) => (
                  <Fragment key={s.id}>
                    <tr
                      onClick={() => setExpandedRow(expandedRow === s.id ? null : s.id)}
                      className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors border-t border-neutral-100 dark:border-neutral-700/50"
                    >
                      <td className="px-4 py-3 text-sm text-neutral-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${s.logoColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {s.logo}
                          </div>
                          <span className="text-sm font-semibold text-neutral-900 dark:text-white">{s.company}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">{s.role}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.phase === 'Technical' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'}`}>
                          {s.phase}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreBadge(s.score)}`}>
                          {s.score}/100
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-400">{s.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/feedback/${s.id}`);
                            }}
                            className="text-xs text-primary-500 border border-primary-200 dark:border-primary-800 px-2.5 py-1 rounded-lg hover:bg-primary-50 transition-colors"
                          >
                            View Feedback
                          </button>
                          {expandedRow === s.id ? (
                            <ChevronUpIcon className="w-4 h-4 text-neutral-400" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-neutral-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedRow === s.id && (
                      <tr className="bg-neutral-50 dark:bg-neutral-700/20 border-t border-neutral-100 dark:border-neutral-700/50">
                        <td colSpan={7} className="px-6 py-4">
                          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
                            Area Breakdown
                          </p>
                          <div className="grid grid-cols-5 gap-3">
                            {AREA_LABELS.map((label, i) => (
                              <div key={label}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                    {label.split(' ')[0]}
                                  </span>
                                  <span className={`text-xs font-bold ${s.areas[i] >= 80 ? 'text-emerald-500' : s.areas[i] >= 65 ? 'text-amber-500' : 'text-red-500'}`}>
                                    {s.areas[i]}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${scoreColor(s.areas[i])}`} style={{ width: `${s.areas[i]}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-white text-lg">
              Ready for your next session?
            </p>
            <p className="text-white/80 text-sm mt-0.5">
              Keep the momentum going — your next breakthrough is one session away.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors whitespace-nowrap flex-shrink-0"
          >
            <ZapIcon className="w-4 h-4" />
            Quick Start
          </button>
        </div>
      </div>
    </div>
  );
}