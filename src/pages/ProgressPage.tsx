import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUpIcon,
  ArrowLeftIcon,
  ZapIcon,
  ChevronDownIcon,
  ChevronUpIcon } from
'lucide-react';
type DateRange = '7d' | '30d' | 'all';
const SESSIONS = [
{
  id: 1,
  company: 'Google',
  role: 'Software Engineer',
  phase: 'Technical',
  score: 62,
  date: 'Jan 12',
  logo: 'G',
  logoColor: 'bg-blue-500',
  areas: [58, 60, 55, 70, 67]
},
{
  id: 2,
  company: 'Stripe',
  role: 'Software Engineer',
  phase: 'Behavioral',
  score: 68,
  date: 'Jan 14',
  logo: 'S',
  logoColor: 'bg-indigo-500',
  areas: [65, 70, 60, 72, 73]
},
{
  id: 3,
  company: 'Airbnb',
  role: 'Frontend Engineer',
  phase: 'Technical',
  score: 71,
  date: 'Jan 17',
  logo: 'A',
  logoColor: 'bg-rose-500',
  areas: [68, 72, 65, 75, 75]
},
{
  id: 4,
  company: 'Meta',
  role: 'Software Engineer',
  phase: 'Technical',
  score: 75,
  date: 'Jan 20',
  logo: 'M',
  logoColor: 'bg-blue-600',
  areas: [72, 76, 68, 78, 81]
},
{
  id: 5,
  company: 'Notion',
  role: 'Software Engineer',
  phase: 'Behavioral',
  score: 79,
  date: 'Jan 23',
  logo: 'N',
  logoColor: 'bg-neutral-800',
  areas: [76, 80, 72, 81, 86]
},
{
  id: 6,
  company: 'Google',
  role: 'Software Engineer',
  phase: 'Technical',
  score: 82,
  date: 'Jan 27',
  logo: 'G',
  logoColor: 'bg-blue-500',
  areas: [80, 83, 78, 84, 85]
},
{
  id: 7,
  company: 'Airbnb',
  role: 'Frontend Engineer',
  phase: 'Behavioral',
  score: 88,
  date: 'Jan 31',
  logo: 'A',
  logoColor: 'bg-rose-500',
  areas: [85, 88, 84, 90, 93]
}];

const AREA_LABELS = [
'Answer Structure',
'Communication Clarity',
'Confidence & Delivery',
'Content Depth',
'Engagement & Energy'];

const AREA_BEFORE = [58, 65, 52, 72, 61];
const AREA_AFTER = [74, 79, 71, 83, 76];
const CONFIDENCE_DATA = [
{
  pre: 1,
  post: 3
},
{
  pre: 2,
  post: 4
},
{
  pre: 2,
  post: 4
},
{
  pre: 3,
  post: 4
},
{
  pre: 2,
  post: 5
},
{
  pre: 3,
  post: 5
},
{
  pre: 3,
  post: 5
}];

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
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const maxScore = 100;
  const gridLines = [60, 70, 80, 90];
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors mb-2">

              <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white flex items-center gap-2">
              <TrendingUpIcon className="w-7 h-7 text-primary-500" />
              Your Progress
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">
              Track your improvement across every session
            </p>
          </div>
          <div className="flex gap-1 bg-white dark:bg-neutral-800 rounded-xl p-1 border border-neutral-100 dark:border-neutral-700 w-fit">
            {(['7d', '30d', 'all'] as DateRange[]).map((r) =>
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${dateRange === r ? 'bg-primary-500 text-white shadow-sm' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}>

                {r === 'all' ? 'All time' : r}
              </button>
            )}
          </div>
        </div>

        {/* ── Summary stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
          {
            label: 'Sessions Completed',
            value: '7',
            sub: 'Total practice sessions',
            icon: '🎤'
          },
          {
            label: 'Avg Score',
            value: '78/100',
            sub: '↑4 pts from first session',
            icon: '📊'
          },
          {
            label: 'Best Score',
            value: '88/100',
            sub: 'Airbnb · Behavioral',
            icon: '🏆'
          },
          {
            label: 'Confidence Gain',
            value: '+2.3 pts',
            sub: '😰 → 🙂 avg improvement',
            icon: '💪'
          }].
          map(({ label, value, sub, icon }) =>
          <div
            key={label}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-700 shadow-card">

              <span className="text-xl mb-2 block">{icon}</span>
              <p className="font-display font-bold text-xl text-neutral-900 dark:text-white">
                {value}
              </p>
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">
                {label}
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                {sub}
              </p>
            </div>
          )}
        </div>

        {/* ── Score Trend Chart ── */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 shadow-card mb-6">
          <h2 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-5">
            Score Over Time
          </h2>
          <div
            className="relative"
            style={{
              height: '180px'
            }}>

            {/* Gridlines */}
            {gridLines.map((g) =>
            <div
              key={g}
              className="absolute w-full border-t border-dashed border-neutral-100 dark:border-neutral-700 flex items-center"
              style={{
                bottom: `${g / maxScore * 100}%`
              }}>

                <span className="text-xs text-neutral-300 dark:text-neutral-600 pr-2 -translate-y-1/2 w-6 text-right flex-shrink-0">
                  {g}
                </span>
              </div>
            )}
            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-2 pl-8">
              {SESSIONS.map((s, i) =>
              <div
                key={s.id}
                className="flex-1 flex flex-col items-center gap-1">

                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                    {s.score}
                  </span>
                  <div
                  className={`w-full rounded-t-lg ${scoreColor(s.score)} transition-all duration-500`}
                  style={{
                    height: `${s.score / maxScore * 140}px`
                  }} />

                  <span className="text-xs text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
                    S{i + 1}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
            {[
            {
              color: 'bg-red-400',
              label: 'Below 65'
            },
            {
              color: 'bg-amber-400',
              label: '65–79'
            },
            {
              color: 'bg-emerald-500',
              label: '80+'
            }].
            map(({ color, label }) =>
            <div key={label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${color}`} />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Skills + Confidence ── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Skill Improvement */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 shadow-card">
            <h2 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-5">
              Skill Improvement
            </h2>
            <div className="space-y-4">
              {AREA_LABELS.map((label, i) => {
                const delta = AREA_AFTER[i] - AREA_BEFORE[i];
                const isBest =
                delta ===
                Math.max(...AREA_BEFORE.map((b, j) => AREA_AFTER[j] - b));
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-semibold ${isBest ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-400'}`}>

                        {label} {isBest && '⭐'}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${isBest ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>

                        +{delta}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400 w-10">
                          Before
                        </span>
                        <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neutral-300 dark:bg-neutral-600 rounded-full"
                            style={{
                              width: `${AREA_BEFORE[i]}%`
                            }} />

                        </div>
                        <span className="text-xs font-semibold text-neutral-500 w-6 text-right">
                          {AREA_BEFORE[i]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400 w-10">
                          After
                        </span>
                        <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isBest ? 'bg-primary-500' : 'bg-indigo-400'}`}
                            style={{
                              width: `${AREA_AFTER[i]}%`
                            }} />

                        </div>
                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 w-6 text-right">
                          {AREA_AFTER[i]}
                        </span>
                      </div>
                    </div>
                  </div>);

              })}
            </div>
          </div>

          {/* Confidence Journey */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 shadow-card">
            <h2 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-5">
              Confidence Journey
            </h2>
            <div className="space-y-3 mb-5">
              {CONFIDENCE_DATA.map(({ pre, post }, i) => {
                const delta = post - pre;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-neutral-400 w-16 flex-shrink-0">
                      Session {i + 1}
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-base">{EMOJIS[pre - 1]}</span>
                      <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-400 rounded-full"
                          style={{
                            width: `${post / 5 * 100}%`
                          }} />

                      </div>
                      <span className="text-base">{EMOJIS[post - 1]}</span>
                    </div>
                    <span
                      className={`text-xs font-bold w-8 text-right ${delta > 0 ? 'text-emerald-500' : 'text-neutral-400'}`}>

                      {delta > 0 ? `+${delta}` : '0'}
                    </span>
                  </div>);

              })}
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 border border-primary-100 dark:border-primary-800">
              <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                You started at 😰 and now consistently rate 😄
              </p>
              <p className="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                Average confidence gain: +2.3 points per session
              </p>
            </div>
          </div>
        </div>

        {/* ── Session History ── */}
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
                  {['#', 'Company', 'Role', 'Phase', 'Score', 'Date', ''].map(
                    (h) =>
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 px-4 py-3">

                        {h}
                      </th>

                  )}
                </tr>
              </thead>
              <tbody>
                {SESSIONS.map((s) =>
                <Fragment key={s.id}>
                    <tr
                    onClick={() =>
                    setExpandedRow(expandedRow === s.id ? null : s.id)
                    }
                    className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors border-t border-neutral-100 dark:border-neutral-700/50">

                      <td className="px-4 py-3 text-sm text-neutral-400">
                        {s.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                          className={`w-7 h-7 rounded-lg ${s.logoColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>

                            {s.logo}
                          </div>
                          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {s.company}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                        {s.role}
                      </td>
                      <td className="px-4 py-3">
                        <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.phase === 'Technical' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'}`}>

                          {s.phase}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreBadge(s.score)}`}>

                          {s.score}/100
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-400">
                        {s.date}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-neutral-400 border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 rounded-lg opacity-50 cursor-not-allowed">
                            View Feedback
                          </button>
                          {expandedRow === s.id ?
                        <ChevronUpIcon className="w-4 h-4 text-neutral-400" /> :

                        <ChevronDownIcon className="w-4 h-4 text-neutral-400" />
                        }
                        </div>
                      </td>
                    </tr>
                    {expandedRow === s.id &&
                  <tr className="bg-neutral-50 dark:bg-neutral-700/20 border-t border-neutral-100 dark:border-neutral-700/50">
                        <td colSpan={7} className="px-6 py-4">
                          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
                            Area Breakdown
                          </p>
                          <div className="grid grid-cols-5 gap-3">
                            {AREA_LABELS.map((label, i) =>
                        <div key={label}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                    {label.split(' ')[0]}
                                  </span>
                                  <span
                              className={`text-xs font-bold ${s.areas[i] >= 80 ? 'text-emerald-500' : s.areas[i] >= 65 ? 'text-amber-500' : 'text-red-500'}`}>

                                    {s.areas[i]}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden">
                                  <div
                              className={`h-full rounded-full ${scoreColor(s.areas[i])}`}
                              style={{
                                width: `${s.areas[i]}%`
                              }} />

                                </div>
                              </div>
                        )}
                          </div>
                        </td>
                      </tr>
                  }
                  </Fragment>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-white text-lg">
              Ready for your next session?
            </p>
            <p className="text-white/80 text-sm mt-0.5">
              Keep the momentum going — your next breakthrough is one session
              away.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors whitespace-nowrap flex-shrink-0">

            <ZapIcon className="w-4 h-4" />
            Quick Start
          </button>
        </div>
      </div>
    </div>);

}