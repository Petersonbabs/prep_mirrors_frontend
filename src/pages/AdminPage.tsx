import React, { useState, Component } from 'react';
import {
  LayoutDashboardIcon,
  UsersIcon,
  MessageSquareIcon,
  VideoIcon,
  SettingsIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  FilterIcon,
  DownloadIcon,
  RefreshCwIcon,
  ShieldIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  AlertCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  BarChart2Icon,
  DollarSignIcon,
  MousePointerClickIcon,
  GlobeIcon,
  ZapIcon,
  RepeatIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon } from
'lucide-react';
// ─── Types ────────────────────────────────────────────────────────────────────
type AdminSection =
'overview' |
'users' |
'responses' |
'sessions' |
'analytics' |
'content' |
'settings';
interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  level: string;
  joined: string;
  sessions: number;
  avgScore: number;
  confidencePre: number;
  confidencePost: number;
  outcome: 'offer' | 'in-process' | 'preparing' | null;
  status: 'free' | 'paid';
  challenge: string;
  timeline: string;
}
// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS: MockUser[] = [
{
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.j@gmail.com',
  role: 'Software Engineer',
  level: '2–5 years',
  joined: 'Jan 12, 2025',
  sessions: 8,
  avgScore: 81,
  confidencePre: 2,
  confidencePost: 4,
  outcome: 'offer',
  status: 'paid',
  challenge: 'Nerves',
  timeline: 'This week'
},
{
  id: '2',
  name: 'Maria Chen',
  email: 'mchen@outlook.com',
  role: 'Product Manager',
  level: '5+ years',
  joined: 'Jan 14, 2025',
  sessions: 5,
  avgScore: 74,
  confidencePre: 3,
  confidencePost: 4,
  outcome: 'in-process',
  status: 'paid',
  challenge: 'Structure',
  timeline: 'This month'
},
{
  id: '3',
  name: 'James Okafor',
  email: 'jokafor@yahoo.com',
  role: 'Data Scientist',
  level: '0–2 years',
  joined: 'Jan 15, 2025',
  sessions: 3,
  avgScore: 68,
  confidencePre: 1,
  confidencePost: 3,
  outcome: 'preparing',
  status: 'free',
  challenge: 'Technical',
  timeline: 'This month'
},
{
  id: '4',
  name: 'Priya Sharma',
  email: 'priya.s@gmail.com',
  role: 'UX/UI Designer',
  level: '2–5 years',
  joined: 'Jan 16, 2025',
  sessions: 6,
  avgScore: 77,
  confidencePre: 2,
  confidencePost: 4,
  outcome: 'offer',
  status: 'paid',
  challenge: 'Confidence',
  timeline: 'This week'
},
{
  id: '5',
  name: 'Tom Williams',
  email: 'tomw@gmail.com',
  role: 'Software Engineer',
  level: 'Student',
  joined: 'Jan 17, 2025',
  sessions: 12,
  avgScore: 85,
  confidencePre: 3,
  confidencePost: 5,
  outcome: 'offer',
  status: 'paid',
  challenge: 'Behavioral',
  timeline: 'This week'
},
{
  id: '6',
  name: 'Sarah Kim',
  email: 'skim@proton.me',
  role: 'Marketing',
  level: '2–5 years',
  joined: 'Jan 18, 2025',
  sessions: 2,
  avgScore: 65,
  confidencePre: 2,
  confidencePost: 3,
  outcome: null,
  status: 'free',
  challenge: 'Structure',
  timeline: 'Exploring'
},
{
  id: '7',
  name: 'David Park',
  email: 'dpark@gmail.com',
  role: 'Finance',
  level: '5+ years',
  joined: 'Jan 19, 2025',
  sessions: 4,
  avgScore: 72,
  confidencePre: 3,
  confidencePost: 4,
  outcome: 'in-process',
  status: 'paid',
  challenge: 'Nerves',
  timeline: 'This month'
},
{
  id: '8',
  name: 'Emma Torres',
  email: 'emma.t@icloud.com',
  role: 'Software Engineer',
  level: '0–2 years',
  joined: 'Jan 20, 2025',
  sessions: 7,
  avgScore: 79,
  confidencePre: 1,
  confidencePost: 4,
  outcome: 'in-process',
  status: 'paid',
  challenge: 'Technical',
  timeline: 'This week'
},
{
  id: '9',
  name: 'Liam Brown',
  email: 'lbrown@gmail.com',
  role: 'Product Manager',
  level: '2–5 years',
  joined: 'Jan 21, 2025',
  sessions: 3,
  avgScore: 70,
  confidencePre: 2,
  confidencePost: 3,
  outcome: 'preparing',
  status: 'free',
  challenge: 'Behavioral',
  timeline: 'This month'
},
{
  id: '10',
  name: 'Aisha Patel',
  email: 'aisha.p@gmail.com',
  role: 'Data Scientist',
  level: '5+ years',
  joined: 'Jan 22, 2025',
  sessions: 9,
  avgScore: 83,
  confidencePre: 3,
  confidencePost: 5,
  outcome: 'offer',
  status: 'paid',
  challenge: 'Confidence',
  timeline: 'This week'
},
{
  id: '11',
  name: 'Noah Garcia',
  email: 'ngarcia@outlook.com',
  role: 'Software Engineer',
  level: '2–5 years',
  joined: 'Jan 23, 2025',
  sessions: 5,
  avgScore: 76,
  confidencePre: 2,
  confidencePost: 4,
  outcome: 'in-process',
  status: 'paid',
  challenge: 'Structure',
  timeline: 'This month'
},
{
  id: '12',
  name: 'Olivia Lee',
  email: 'olee@gmail.com',
  role: 'UX/UI Designer',
  level: '0–2 years',
  joined: 'Jan 24, 2025',
  sessions: 1,
  avgScore: 61,
  confidencePre: 1,
  confidencePost: 2,
  outcome: null,
  status: 'free',
  challenge: 'Nerves',
  timeline: 'Exploring'
},
{
  id: '13',
  name: 'Ethan Wilson',
  email: 'ewilson@yahoo.com',
  role: 'Sales',
  level: '2–5 years',
  joined: 'Jan 25, 2025',
  sessions: 6,
  avgScore: 80,
  confidencePre: 3,
  confidencePost: 5,
  outcome: 'offer',
  status: 'paid',
  challenge: 'Confidence',
  timeline: 'This week'
},
{
  id: '14',
  name: 'Fatima Hassan',
  email: 'fhassan@gmail.com',
  role: 'Finance',
  level: 'Student',
  joined: 'Jan 26, 2025',
  sessions: 4,
  avgScore: 69,
  confidencePre: 2,
  confidencePost: 3,
  outcome: 'preparing',
  status: 'free',
  challenge: 'Technical',
  timeline: 'This month'
},
{
  id: '15',
  name: 'Ryan Nguyen',
  email: 'rnguyen@gmail.com',
  role: 'Software Engineer',
  level: '5+ years',
  joined: 'Jan 27, 2025',
  sessions: 11,
  avgScore: 88,
  confidencePre: 4,
  confidencePost: 5,
  outcome: 'offer',
  status: 'paid',
  challenge: 'Behavioral',
  timeline: 'This week'
},
{
  id: '16',
  name: 'Zoe Martinez',
  email: 'zmartinez@icloud.com',
  role: 'Marketing',
  level: '0–2 years',
  joined: 'Jan 28, 2025',
  sessions: 2,
  avgScore: 63,
  confidencePre: 1,
  confidencePost: 2,
  outcome: null,
  status: 'free',
  challenge: 'Structure',
  timeline: 'Exploring'
},
{
  id: '17',
  name: 'Marcus Thompson',
  email: 'mthompson@gmail.com',
  role: 'Product Manager',
  level: '5+ years',
  joined: 'Jan 29, 2025',
  sessions: 7,
  avgScore: 78,
  confidencePre: 3,
  confidencePost: 4,
  outcome: 'in-process',
  status: 'paid',
  challenge: 'Nerves',
  timeline: 'This month'
},
{
  id: '18',
  name: 'Isabella Clark',
  email: 'iclark@outlook.com',
  role: 'Data Scientist',
  level: '2–5 years',
  joined: 'Jan 30, 2025',
  sessions: 5,
  avgScore: 73,
  confidencePre: 2,
  confidencePost: 4,
  outcome: 'in-process',
  status: 'paid',
  challenge: 'Technical',
  timeline: 'This week'
},
{
  id: '19',
  name: 'Lucas White',
  email: 'lwhite@gmail.com',
  role: 'Software Engineer',
  level: 'Student',
  joined: 'Jan 31, 2025',
  sessions: 3,
  avgScore: 67,
  confidencePre: 1,
  confidencePost: 3,
  outcome: 'preparing',
  status: 'free',
  challenge: 'Confidence',
  timeline: 'This month'
},
{
  id: '20',
  name: 'Amara Diallo',
  email: 'adiallo@gmail.com',
  role: 'UX/UI Designer',
  level: '2–5 years',
  joined: 'Feb 1, 2025',
  sessions: 8,
  avgScore: 82,
  confidencePre: 2,
  confidencePost: 5,
  outcome: 'offer',
  status: 'paid',
  challenge: 'Behavioral',
  timeline: 'This week'
}];

const SIGNUP_DATA = [
{
  day: 'Mon',
  value: 45
},
{
  day: 'Tue',
  value: 62
},
{
  day: 'Wed',
  value: 38
},
{
  day: 'Thu',
  value: 71
},
{
  day: 'Fri',
  value: 89
},
{
  day: 'Sat',
  value: 54
},
{
  day: 'Sun',
  value: 67
}];

const CONFIDENCE_DELTA_DATA = [
{
  label: 'No change (0)',
  value: 89,
  color: 'bg-slate-400'
},
{
  label: '+1 point',
  value: 213,
  color: 'bg-indigo-300'
},
{
  label: '+2 points',
  value: 387,
  color: 'bg-indigo-400'
},
{
  label: '+3 points',
  value: 412,
  color: 'bg-indigo-500'
},
{
  label: '+4 points',
  value: 183,
  color: 'bg-indigo-600'
}];

// ─── Shared Components ────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  change,
  positive,
  icon






}: {label: string;value: string;change: string;positive: boolean;icon: React.ReactNode;}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${positive ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>

          {positive ?
          <ArrowUpIcon className="w-3 h-3" /> :

          <ArrowDownIcon className="w-3 h-3" />
          }
          {change}
        </span>
      </div>
      <p className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-0.5">
        {value}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>);

}
function SectionHeader({
  title,
  subtitle,
  action




}: {title: string;subtitle?: string;action?: React.ReactNode;}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle &&
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        }
      </div>
      {action}
    </div>);

}
function OutcomeBadge({ outcome }: {outcome: MockUser['outcome'];}) {
  if (!outcome) return <span className="text-xs text-slate-400">—</span>;
  const map = {
    offer: {
      label: 'Got offer',
      color:
      'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
      icon: '🎉'
    },
    'in-process': {
      label: 'In process',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
      icon: '🔄'
    },
    preparing: {
      label: 'Preparing',
      color:
      'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
      icon: '📚'
    }
  };
  const { label, color, icon } = map[outcome];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>

      <span>{icon}</span>
      {label}
    </span>);

}
function StatusBadge({ status }: {status: 'free' | 'paid';}) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status === 'paid' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>

      {status === 'paid' ? 'Pro' : 'Free'}
    </span>);

}
function ConfidenceDelta({ pre, post }: {pre: number;post: number;}) {
  const delta = post - pre;
  const emojis = ['😰', '😟', '😐', '🙂', '😄'];
  if (delta > 0)
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <ArrowUpIcon className="w-3 h-3" />+{delta} ({emojis[pre - 1]}→
        {emojis[post - 1]})
      </span>);

  if (delta === 0)
  return (
    <span className="flex items-center gap-1 text-xs text-slate-400">
        <MinusIcon className="w-3 h-3" />0
      </span>);

  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-red-500">
      <ArrowDownIcon className="w-3 h-3" />
      {delta}
    </span>);

}
// ─── Overview Section ─────────────────────────────────────────────────────────
function OverviewSection() {
  const maxSignup = Math.max(...SIGNUP_DATA.map((d) => d.value));
  const maxDelta = Math.max(...CONFIDENCE_DELTA_DATA.map((d) => d.value));
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value="1,284"
          change="12% this week"
          positive={true}
          icon={<UsersIcon className="w-4 h-4" />} />

        <StatCard
          label="Active Today"
          value="89"
          change="5% vs yesterday"
          positive={true}
          icon={<TrendingUpIcon className="w-4 h-4" />} />

        <StatCard
          label="Avg Confidence Δ"
          value="+1.8 pts"
          change="0.2 pts vs last week"
          positive={true}
          icon={<ArrowUpIcon className="w-4 h-4" />} />

        <StatCard
          label="Paid Conversions"
          value="23%"
          change="3% this month"
          positive={true}
          icon={<CheckCircleIcon className="w-4 h-4" />} />

      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Signups bar chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <SectionHeader
            title="Signups This Week"
            subtitle="New user registrations by day" />

          <div className="flex items-end gap-2 h-36">
            {SIGNUP_DATA.map(({ day, value }) =>
            <div
              key={day}
              className="flex-1 flex flex-col items-center gap-1.5">

                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {value}
                </span>
                <div
                className="w-full rounded-t-md bg-indigo-500 dark:bg-indigo-400 transition-all"
                style={{
                  height: `${value / maxSignup * 100}px`
                }} />

                <span className="text-xs text-slate-400">{day}</span>
              </div>
            )}
          </div>
        </div>

        {/* Confidence delta distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <SectionHeader
            title="Confidence Delta Distribution"
            subtitle="How much users improved pre→post mock" />

          <div className="space-y-3">
            {CONFIDENCE_DELTA_DATA.map(({ label, value, color }) =>
            <div key={label} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 w-24 flex-shrink-0">
                  {label}
                </span>
                <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                  className={`h-full rounded-full ${color} transition-all`}
                  style={{
                    width: `${value / maxDelta * 100}%`
                  }} />

                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-8 text-right">
                  {value}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Role breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <SectionHeader title="Users by Role" />
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="text-left text-xs font-semibold text-slate-400 pb-2">
                  Role
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 pb-2">
                  Users
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 pb-2">
                  Avg Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {[
              {
                role: 'Software Engineer',
                users: 487,
                score: 74
              },
              {
                role: 'Product Manager',
                users: 203,
                score: 71
              },
              {
                role: 'Data Scientist',
                users: 156,
                score: 69
              },
              {
                role: 'UX/UI Designer',
                users: 98,
                score: 76
              },
              {
                role: 'Other',
                users: 340,
                score: 72
              }].
              map((row) =>
              <tr key={row.role}>
                  <td className="py-2.5 text-sm text-slate-700 dark:text-slate-300">
                    {row.role}
                  </td>
                  <td className="py-2.5 text-sm text-right font-semibold text-slate-900 dark:text-white">
                    {row.users.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right">
                    <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.score >= 75 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'}`}>

                      {row.score}/100
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Outcome tracker summary */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <SectionHeader
            title="Outcome Tracker"
            subtitle="Self-reported interview outcomes" />

          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-800">
              <span className="text-2xl">🎉</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300">
                  Got the offer
                </p>
                <div className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-800 rounded-full mt-1.5">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: '11%'
                    }} />

                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-lg text-emerald-700 dark:text-emerald-300">
                  142
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  11%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/15 border border-blue-100 dark:border-blue-800">
              <span className="text-2xl">🔄</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-blue-700 dark:text-blue-300">
                  Still in process
                </p>
                <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-800 rounded-full mt-1.5">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: '30%'
                    }} />

                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-lg text-blue-700 dark:text-blue-300">
                  389
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">30%</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <span className="text-2xl">📚</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Still preparing
                </p>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full mt-1.5">
                  <div
                    className="h-full bg-slate-500 rounded-full"
                    style={{
                      width: '59%'
                    }} />

                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-lg text-slate-700 dark:text-slate-300">
                  753
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  59%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
// ─── Analytics & Marketing Section ───────────────────────────────────────────
const TRAFFIC_SOURCES = [
{
  source: 'TikTok',
  icon: '🎵',
  users: 2863,
  pct: 34,
  color: 'bg-pink-500',
  trend: '+12%',
  positive: true
},
{
  source: 'Google Search',
  icon: '🔍',
  users: 2358,
  pct: 28,
  color: 'bg-blue-500',
  trend: '+8%',
  positive: true
},
{
  source: 'Direct / Typed',
  icon: '🔗',
  users: 1516,
  pct: 18,
  color: 'bg-slate-500',
  trend: '+2%',
  positive: true
},
{
  source: 'Instagram',
  icon: '📸',
  users: 926,
  pct: 11,
  color: 'bg-purple-500',
  trend: '-3%',
  positive: false
},
{
  source: 'Twitter / X',
  icon: '🐦',
  users: 421,
  pct: 5,
  color: 'bg-sky-500',
  trend: '+1%',
  positive: true
},
{
  source: 'Other',
  icon: '🌐',
  users: 337,
  pct: 4,
  color: 'bg-slate-300',
  trend: '0%',
  positive: true
}];

const FUNNEL_STEPS = [
{
  label: 'Visited Landing Page',
  count: 8420,
  pct: 100,
  dropPct: null,
  color: 'bg-indigo-500'
},
{
  label: 'Started Onboarding',
  count: 3847,
  pct: 46,
  dropPct: 54,
  color: 'bg-indigo-500'
},
{
  label: 'Completed Onboarding',
  count: 2104,
  pct: 55,
  dropPct: 45,
  color: 'bg-indigo-400'
},
{
  label: 'Started Free Trial',
  count: 1284,
  pct: 61,
  dropPct: 39,
  color: 'bg-violet-500'
},
{
  label: 'Converted to Paid',
  count: 295,
  pct: 23,
  dropPct: 77,
  color: 'bg-emerald-500'
}];

const ONBOARDING_STEPS = [
{
  step: 'Welcome screen',
  completed: 3847,
  dropOff: 0,
  pct: 100
},
{
  step: 'Name entry',
  completed: 3612,
  dropOff: 235,
  pct: 94
},
{
  step: 'Role selection',
  completed: 3401,
  dropOff: 211,
  pct: 94
},
{
  step: 'Level selection',
  completed: 3198,
  dropOff: 203,
  pct: 94
},
{
  step: 'Challenge selection',
  completed: 2876,
  dropOff: 322,
  pct: 90
},
{
  step: 'Timeline selection',
  completed: 2541,
  dropOff: 335,
  pct: 88
},
{
  step: 'Insight / social proof',
  completed: 2310,
  dropOff: 231,
  pct: 91
},
{
  step: 'Mock interview',
  completed: 2104,
  dropOff: 206,
  pct: 91
},
{
  step: 'Feedback screen',
  completed: 1893,
  dropOff: 211,
  pct: 90
},
{
  step: 'Feature showcase',
  completed: 1521,
  dropOff: 372,
  pct: 80
},
{
  step: 'Commitment screen',
  completed: 1380,
  dropOff: 141,
  pct: 91
},
{
  step: 'Paywall shown',
  completed: 1284,
  dropOff: 96,
  pct: 93
}];

const EVENTS = [
{
  event: 'page_view',
  count: 42180,
  users: 8420,
  pct: 100,
  trend: '+14%',
  positive: true
},
{
  event: 'onboarding_started',
  count: 3847,
  users: 3847,
  pct: 46,
  trend: '+11%',
  positive: true
},
{
  event: 'role_selected',
  count: 3401,
  users: 3401,
  pct: 40,
  trend: '+9%',
  positive: true
},
{
  event: 'mock_interview_started',
  count: 2310,
  users: 2310,
  pct: 27,
  trend: '+18%',
  positive: true
},
{
  event: 'mock_interview_completed',
  count: 2104,
  users: 2104,
  pct: 25,
  trend: '+16%',
  positive: true
},
{
  event: 'feedback_viewed',
  count: 1893,
  users: 1893,
  pct: 22,
  trend: '+15%',
  positive: true
},
{
  event: 'paywall_shown',
  count: 1284,
  users: 1284,
  pct: 15,
  trend: '+12%',
  positive: true
},
{
  event: 'trial_started',
  count: 1284,
  users: 1284,
  pct: 15,
  trend: '+12%',
  positive: true
},
{
  event: 'ai_coach_opened',
  count: 876,
  users: 743,
  pct: 10,
  trend: '+22%',
  positive: true
},
{
  event: 'paid_converted',
  count: 295,
  users: 295,
  pct: 3.5,
  trend: '+8%',
  positive: true
},
{
  event: 'session_abandoned',
  count: 612,
  users: 589,
  pct: 7,
  trend: '-4%',
  positive: false
},
{
  event: 'paywall_dismissed',
  count: 989,
  users: 989,
  pct: 12,
  trend: '+3%',
  positive: false
}];

const MRR_DATA = [
{
  month: 'Sep',
  value: 1240
},
{
  month: 'Oct',
  value: 2180
},
{
  month: 'Nov',
  value: 3920
},
{
  month: 'Dec',
  value: 6340
},
{
  month: 'Jan',
  value: 9870
},
{
  month: 'Feb',
  value: 12847
}];

function AnalyticsSection() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>(
    '30d'
  );
  const [activeEventTab, setActiveEventTab] = useState<
    'all' | 'conversion' | 'drop'>(
    'all');
  const maxMRR = Math.max(...MRR_DATA.map((d) => d.value));
  const maxFunnel = FUNNEL_STEPS[0].count;
  const filteredEvents = EVENTS.filter((e) => {
    if (activeEventTab === 'conversion')
    return [
    'trial_started',
    'paid_converted',
    'mock_interview_completed',
    'onboarding_started'].
    includes(e.event);
    if (activeEventTab === 'drop')
    return ['session_abandoned', 'paywall_dismissed'].includes(e.event);
    return true;
  });
  return (
    <div className="space-y-6">
      {/* Header with date range */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Analytics & Marketing
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Traffic, revenue, funnel, and event data
          </p>
        </div>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1">
          {(['7d', '30d', '90d', 'all'] as const).map((r) =>
          <button
            key={r}
            onClick={() => setDateRange(r)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${dateRange === r ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>

              {r === 'all' ? 'All time' : r}
            </button>
          )}
        </div>
      </div>

      {/* Revenue KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        {[
        {
          label: 'MRR',
          value: '$12,847',
          change: '+30%',
          positive: true,
          icon: <DollarSignIcon className="w-4 h-4" />,
          sub: 'Monthly recurring'
        },
        {
          label: 'LTV',
          value: '$47.20',
          change: '+$4.10',
          positive: true,
          icon: <RepeatIcon className="w-4 h-4" />,
          sub: 'Avg lifetime value'
        },
        {
          label: 'ARPU',
          value: '$9.99',
          change: 'Stable',
          positive: true,
          icon: <DollarSignIcon className="w-4 h-4" />,
          sub: 'Revenue per user'
        },
        {
          label: 'Onboard → Trial',
          value: '68%',
          change: '+3%',
          positive: true,
          icon: <ZapIcon className="w-4 h-4" />,
          sub: 'Conversion rate'
        },
        {
          label: 'Trial → Paid',
          value: '23%',
          change: '+2%',
          positive: true,
          icon: <CheckCircleIcon className="w-4 h-4" />,
          sub: 'Paid conversion'
        }].
        map(({ label, value, change, positive, icon, sub }) =>
        <div
          key={label}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">

            <div className="flex items-start justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                {icon}
              </div>
              <span
              className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${positive ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>

                {change}
              </span>
            </div>
            <p className="font-display font-bold text-xl text-slate-900 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {label}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        )}
      </div>

      {/* MRR chart + Traffic sources */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* MRR bar chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white">
                Monthly Recurring Revenue
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
              +935% growth
            </span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {MRR_DATA.map(({ month, value }) =>
            <div
              key={month}
              className="flex-1 flex flex-col items-center gap-1.5">

                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  ${(value / 1000).toFixed(1)}k
                </span>
                <div
                className="w-full rounded-t-md bg-indigo-500 dark:bg-indigo-400 transition-all relative group"
                style={{
                  height: `${value / maxMRR * 130}px`
                }}>

                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    ${value.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-slate-400">{month}</span>
              </div>
            )}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white">
                Traffic Sources
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Where users come from
              </p>
            </div>
            <span className="text-xs text-slate-400">8,421 total</span>
          </div>
          <div className="space-y-3">
            {TRAFFIC_SOURCES.map(
              ({ source, icon, users, pct, color, trend, positive }) =>
              <div key={source} className="flex items-center gap-3">
                  <span className="text-base w-5 flex-shrink-0">{icon}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-28 flex-shrink-0">
                    {source}
                  </span>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                    className={`h-full rounded-full ${color}`}
                    style={{
                      width: `${pct}%`
                    }} />

                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-8 text-right">
                    {pct}%
                  </span>
                  <span
                  className={`text-xs font-semibold w-10 text-right ${positive ? 'text-emerald-500' : 'text-red-500'}`}>

                    {trend}
                  </span>
                </div>

            )}
          </div>
          <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
            💡 TikTok is your #1 source and growing fastest — consider doubling
            down on short-form content.
          </p>
        </div>
      </div>

      {/* User Journey Funnel + Onboarding drop-off */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Funnel */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="mb-5">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">
              User Journey Funnel
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visitor → Paid conversion path
            </p>
          </div>
          <div className="space-y-2">
            {FUNNEL_STEPS.map(({ label, count, pct, dropPct, color }, i) =>
            <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {count.toLocaleString()}
                    </span>
                    {dropPct !== null &&
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${dropPct > 50 ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : dropPct > 30 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>

                        -{dropPct}% drop
                      </span>
                  }
                  </div>
                </div>
                <div className="h-7 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden relative">
                  <div
                  className={`h-full ${color} rounded-lg flex items-center justify-end pr-2 transition-all`}
                  style={{
                    width: `${count / maxFunnel * 100}%`
                  }}>

                    <span className="text-xs font-bold text-white">
                      {i === 0 ? '100%' : `${pct}%`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <AlertCircleIcon className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Biggest drop:{' '}
              <span className="font-semibold text-red-500">
                Landing → Onboarding (54%)
              </span>{' '}
              — optimize the homepage CTA.
            </p>
          </div>
        </div>

        {/* Onboarding step drop-off */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="mb-5">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">
              Onboarding Bounce Points
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Where users drop off during onboarding
            </p>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {ONBOARDING_STEPS.map(({ step, completed, dropOff, pct }, i) => {
              const isWorst =
              dropOff === Math.max(...ONBOARDING_STEPS.map((s) => s.dropOff));
              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isWorst ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>

                  <span className="text-xs text-slate-400 w-4 flex-shrink-0">
                    {i + 1}
                  </span>
                  <span
                    className={`text-xs flex-1 ${isWorst ? 'font-semibold text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>

                    {step}
                  </span>
                  <div className="flex items-center gap-2">
                    {dropOff > 0 &&
                    <span
                      className={`text-xs font-semibold ${isWorst ? 'text-red-600' : dropOff > 200 ? 'text-amber-600' : 'text-slate-400'}`}>

                        -{dropOff}
                      </span>
                    }
                    <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 92 ? 'bg-emerald-400' : pct >= 88 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{
                          width: `${pct}%`
                        }} />

                    </div>
                    <span
                      className={`text-xs font-bold w-8 text-right ${pct >= 92 ? 'text-emerald-600' : pct >= 88 ? 'text-amber-600' : 'text-red-500'}`}>

                      {pct}%
                    </span>
                  </div>
                  {isWorst &&
                  <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                      ⚠
                    </span>
                  }
                </div>);

            })}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-400">
              💡{' '}
              <span className="font-semibold text-amber-600">
                Feature showcase
              </span>{' '}
              has the highest drop-off (80%). Consider shortening from 5 screens
              to 3.
            </p>
          </div>
        </div>
      </div>

      {/* Event breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">
              Event Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              All tracked user events
            </p>
          </div>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1">
            {[
            {
              id: 'all' as const,
              label: 'All'
            },
            {
              id: 'conversion' as const,
              label: 'Conversion'
            },
            {
              id: 'drop' as const,
              label: 'Drop-off'
            }].
            map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveEventTab(tab.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${activeEventTab === tab.id ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>

                {tab.label}
              </button>
            )}
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              {[
              'Event',
              'Total Count',
              'Unique Users',
              '% of Visitors',
              'Trend'].
              map((h) =>
              <th
                key={h}
                className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3">

                  {h}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filteredEvents.map(
              ({ event, count, users, pct, trend, positive }) =>
              <tr
                key={event}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">

                  <td className="px-5 py-3">
                    <code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                      {event}
                    </code>
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                    {count.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {users.toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-indigo-400 rounded-full"
                        style={{
                          width: `${Math.min(pct, 100)}%`
                        }} />

                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                    className={`flex items-center gap-1 text-xs font-semibold w-fit px-2 py-0.5 rounded-full ${positive ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>

                      {positive ?
                    <ArrowUpIcon className="w-3 h-3" /> :

                    <ArrowDownIcon className="w-3 h-3" />
                    }
                      {trend}
                    </span>
                  </td>
                </tr>

            )}
          </tbody>
        </table>
      </div>
    </div>);

}
// ─── Users Section ────────────────────────────────────────────────────────────
function UsersSection() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch =
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchOutcome = outcomeFilter === 'all' || u.outcome === outcomeFilter;
    return matchSearch && matchRole && matchStatus && matchOutcome;
  });
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 min-w-0">
        <SectionHeader
          title="Users"
          subtitle={`${filtered.length} of 1,284 users`}
          action={
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <DownloadIcon className="w-3.5 h-3.5" /> Export CSV
            </button>
          } />


        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-48">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors" />

          </div>
          {[
          {
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
            'all',
            'Software Engineer',
            'Product Manager',
            'Data Scientist',
            'UX/UI Designer',
            'Marketing',
            'Finance',
            'Sales'],

            label: 'Role'
          },
          {
            value: statusFilter,
            onChange: setStatusFilter,
            options: ['all', 'free', 'paid'],
            label: 'Status'
          },
          {
            value: outcomeFilter,
            onChange: setOutcomeFilter,
            options: ['all', 'offer', 'in-process', 'preparing'],
            label: 'Outcome'
          }].
          map(({ value, onChange, options, label }) =>
          <div key={label} className="relative">
              <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer">

                {options.map((o) =>
              <option key={o} value={o}>
                    {o === 'all' ? `All ${label}s` : o}
                  </option>
              )}
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {[
                  'Name',
                  'Role',
                  'Level',
                  'Joined',
                  'Sessions',
                  'Avg Score',
                  'Conf. Δ',
                  'Outcome',
                  'Status'].
                  map((h) =>
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3 whitespace-nowrap">

                      {h}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {paginated.map((user) =>
                <tr
                  key={user.id}
                  onClick={() =>
                  setSelectedUser(
                    selectedUser?.id === user.id ? null : user
                  )
                  }
                  className={`cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>

                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {user.role}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {user.level}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {user.joined}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">
                      {user.sessions}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${user.avgScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : user.avgScore >= 70 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>

                        {user.avgScore}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ConfidenceDelta
                      pre={user.confidencePre}
                      post={user.confidencePost} />

                    </td>
                    <td className="px-4 py-3">
                      <OutcomeBadge outcome={user.outcome} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, filtered.length)} of 1,284 users
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">

                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * perPage >= filtered.length}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">

                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User detail panel */}
      {selectedUser &&
      <div className="w-72 flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 animate-slide-in-right self-start sticky top-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-display font-bold text-slate-900 dark:text-white">
                {selectedUser.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedUser.email}
              </p>
            </div>
            <button
            onClick={() => setSelectedUser(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">

              <XIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <StatusBadge status={selectedUser.status} />
              <OutcomeBadge outcome={selectedUser.outcome} />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Onboarding Answers
              </p>
              {[
            {
              label: 'Role',
              value: selectedUser.role
            },
            {
              label: 'Level',
              value: selectedUser.level
            },
            {
              label: 'Challenge',
              value: selectedUser.challenge
            },
            {
              label: 'Timeline',
              value: selectedUser.timeline
            }].
            map(({ label, value }) =>
            <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    {label}
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {value}
                  </span>
                </div>
            )}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-3 space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Confidence Scores
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Pre-interview
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {
                ['😰', '😟', '😐', '🙂', '😄'][
                selectedUser.confidencePre - 1]

                }{' '}
                  {selectedUser.confidencePre}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Post-interview
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {
                ['😰', '😟', '😐', '🙂', '😄'][
                selectedUser.confidencePost - 1]

                }{' '}
                  {selectedUser.confidencePost}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Delta
                </span>
                <ConfidenceDelta
                pre={selectedUser.confidencePre}
                post={selectedUser.confidencePost} />

              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-3 space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Session History
              </p>
              {[
            {
              label: 'Total sessions',
              value: selectedUser.sessions
            },
            {
              label: 'Avg score',
              value: `${selectedUser.avgScore}/100`
            },
            {
              label: 'Joined',
              value: selectedUser.joined
            }].
            map(({ label, value }) =>
            <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    {label}
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {value}
                  </span>
                </div>
            )}
            </div>
          </div>
        </div>
      }
    </div>);

}
// ─── Responses Section ────────────────────────────────────────────────────────
function ResponsesSection() {
  const [subTab, setSubTab] = useState<'confidence' | 'outcomes'>('confidence');
  const confidenceUsers = MOCK_USERS.filter(
    (u) => u.confidencePre && u.confidencePost
  );
  const outcomeUsers = MOCK_USERS.filter((u) => u.outcome !== null);
  return (
    <div>
      <SectionHeader
        title="Responses"
        subtitle="Data collected from in-product surveys" />


      {/* Sub-tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1 w-fit mb-5">
        {[
        {
          id: 'confidence' as const,
          label: 'Confidence Ratings',
          count: confidenceUsers.length
        },
        {
          id: 'outcomes' as const,
          label: 'Outcome Tracker',
          count: outcomeUsers.length
        }].
        map((tab) =>
        <button
          key={tab.id}
          onClick={() => setSubTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${subTab === tab.id ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>

            {tab.label}
            <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${subTab === tab.id ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-500'}`}>

              {tab.count}
            </span>
          </button>
        )}
      </div>

      {subTab === 'confidence' &&
      <div className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
          {
            label: 'Avg pre-confidence',
            value: '2.1 / 5',
            sub: '😟 Nervous'
          },
          {
            label: 'Avg post-confidence',
            value: '3.9 / 5',
            sub: '🙂 Fairly confident'
          },
          {
            label: 'Avg delta',
            value: '+1.8 pts',
            sub: 'Across all users'
          }].
          map(({ label, value, sub }) =>
          <div
            key={label}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {label}
                </p>
                <p className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  {value}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
              </div>
          )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {[
                'User',
                'Role',
                'Pre-confidence',
                'Post-confidence',
                'Delta',
                'Date'].
                map((h) =>
                <th
                  key={h}
                  className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3">

                      {h}
                    </th>
                )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {confidenceUsers.map((user) => {
                const emojis = ['😰', '😟', '😐', '🙂', '😄'];
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">

                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {user.role}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">
                          {emojis[user.confidencePre - 1]}{' '}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {user.confidencePre}/5
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">
                          {emojis[user.confidencePost - 1]}{' '}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {user.confidencePost}/5
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ConfidenceDelta
                        pre={user.confidencePre}
                        post={user.confidencePost} />

                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {user.joined}
                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        </div>
      }

      {subTab === 'outcomes' &&
      <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
          {
            emoji: '🎉',
            label: 'Got the offer',
            count: outcomeUsers.filter((u) => u.outcome === 'offer').length,
            color: 'text-emerald-600 dark:text-emerald-400'
          },
          {
            emoji: '🔄',
            label: 'In process',
            count: outcomeUsers.filter((u) => u.outcome === 'in-process').
            length,
            color: 'text-blue-600 dark:text-blue-400'
          },
          {
            emoji: '📚',
            label: 'Still preparing',
            count: outcomeUsers.filter((u) => u.outcome === 'preparing').
            length,
            color: 'text-slate-600 dark:text-slate-400'
          }].
          map(({ emoji, label, count, color }) =>
          <div
            key={label}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">

                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className={`font-display font-bold text-xl ${color}`}>
                    {count}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {label}
                  </p>
                </div>
              </div>
          )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {[
                'User',
                'Role',
                'Outcome',
                'Sessions',
                'Avg Score',
                'Conf. Δ',
                'Status'].
                map((h) =>
                <th
                  key={h}
                  className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3">

                      {h}
                    </th>
                )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {outcomeUsers.map((user) =>
              <tr
                key={user.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">

                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {user.role}
                    </td>
                    <td className="px-4 py-3">
                      <OutcomeBadge outcome={user.outcome} />
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">
                      {user.sessions}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${user.avgScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'}`}>

                        {user.avgScore}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ConfidenceDelta
                    pre={user.confidencePre}
                    post={user.confidencePost} />

                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>);

}
// ─── Sessions Section ─────────────────────────────────────────────────────────
function SessionsSection() {
  const recentSessions = [
  {
    user: 'Alex Johnson',
    role: 'Software Engineer',
    company: 'Google',
    score: 81,
    duration: '24 min',
    date: 'Today, 2:14 PM',
    phase: 'Technical'
  },
  {
    user: 'Emma Torres',
    role: 'Software Engineer',
    company: 'Stripe',
    score: 79,
    duration: '31 min',
    date: 'Today, 11:02 AM',
    phase: 'Behavioral'
  },
  {
    user: 'Aisha Patel',
    role: 'Data Scientist',
    company: 'Meta',
    score: 83,
    duration: '28 min',
    date: 'Today, 9:45 AM',
    phase: 'Technical'
  },
  {
    user: 'Ryan Nguyen',
    role: 'Software Engineer',
    company: 'Airbnb',
    score: 88,
    duration: '22 min',
    date: 'Yesterday, 4:30 PM',
    phase: 'Technical'
  },
  {
    user: 'Marcus Thompson',
    role: 'Product Manager',
    company: 'Notion',
    score: 78,
    duration: '35 min',
    date: 'Yesterday, 2:15 PM',
    phase: 'Behavioral'
  },
  {
    user: 'Priya Sharma',
    role: 'UX/UI Designer',
    company: 'Linear',
    score: 77,
    duration: '26 min',
    date: 'Yesterday, 10:00 AM',
    phase: 'Technical'
  },
  {
    user: 'Tom Williams',
    role: 'Software Engineer',
    company: 'Google',
    score: 85,
    duration: '29 min',
    date: 'Jan 30, 3:45 PM',
    phase: 'Behavioral'
  },
  {
    user: 'Isabella Clark',
    role: 'Data Scientist',
    company: 'Stripe',
    score: 73,
    duration: '33 min',
    date: 'Jan 30, 1:20 PM',
    phase: 'Technical'
  }];

  const areaScores = [
  {
    label: 'Answer Structure',
    avg: 71,
    icon: '🏗️'
  },
  {
    label: 'Communication Clarity',
    avg: 74,
    icon: '🗣️'
  },
  {
    label: 'Confidence & Delivery',
    avg: 64,
    icon: '💪'
  },
  {
    label: 'Content Depth',
    avg: 78,
    icon: '🧠'
  },
  {
    label: 'Engagement & Energy',
    avg: 72,
    icon: '⚡'
  }];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Sessions"
        subtitle="All mock interview sessions across users" />


      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Sessions"
          value="3,847"
          change="18% this week"
          positive={true}
          icon={<VideoIcon className="w-4 h-4" />} />

        <StatCard
          label="Avg Session Length"
          value="27 min"
          change="2 min vs last week"
          positive={false}
          icon={<ClockIcon className="w-4 h-4" />} />

        <StatCard
          label="Avg Overall Score"
          value="74/100"
          change="2 pts this week"
          positive={true}
          icon={<TrendingUpIcon className="w-4 h-4" />} />

      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Avg scores by area */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <SectionHeader title="Avg Score by Feedback Area" />
          <div className="space-y-3">
            {areaScores.map(({ label, avg, icon }) =>
            <div key={label} className="flex items-center gap-3">
                <span className="text-base w-6">{icon}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                  {label}
                </span>
                <div className="w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                  className={`h-full rounded-full ${avg >= 75 ? 'bg-emerald-400' : avg >= 65 ? 'bg-amber-400' : 'bg-red-400'}`}
                  style={{
                    width: `${avg}%`
                  }} />

                </div>
                <span
                className={`text-xs font-bold w-8 text-right ${avg >= 75 ? 'text-emerald-600' : avg >= 65 ? 'text-amber-600' : 'text-red-500'}`}>

                  {avg}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
            💡 Confidence & Delivery is the lowest-scoring area — consider
            adding more coaching prompts here.
          </p>
        </div>

        {/* Phase breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <SectionHeader title="Session Phase Breakdown" />
          <div className="space-y-4">
            {[
            {
              phase: 'Technical',
              sessions: 2104,
              pct: 55,
              avg: 76,
              color: 'bg-indigo-400'
            },
            {
              phase: 'Behavioral',
              sessions: 1743,
              pct: 45,
              avg: 72,
              color: 'bg-violet-400'
            }].
            map(({ phase, sessions, pct, avg, color }) =>
            <div
              key={phase}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">

                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                    {phase}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {sessions.toLocaleString()} sessions
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full mb-2">
                  <div
                  className={`h-full rounded-full ${color}`}
                  style={{
                    width: `${pct}%`
                  }} />

                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{pct}% of all sessions</span>
                  <span>
                    Avg score:{' '}
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {avg}/100
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent sessions table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-display font-semibold text-slate-900 dark:text-white text-sm">
            Recent Sessions
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              {[
              'User',
              'Role',
              'Company',
              'Phase',
              'Score',
              'Duration',
              'Date'].
              map((h) =>
              <th
                key={h}
                className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3">

                  {h}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {recentSessions.map((s, i) =>
            <tr
              key={i}
              className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">

                <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                  {s.user}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                  {s.role}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {s.company}
                </td>
                <td className="px-4 py-3">
                  <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.phase === 'Technical' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'}`}>

                    {s.phase}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.score >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'}`}>

                    {s.score}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                  {s.duration}
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">{s.date}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}
// ─── Content Manager Section ──────────────────────────────────────────────────
interface Question {
  id: string;
  text: string;
  type: 'behavioral' | 'technical' | 'system-design';
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  active: boolean;
}
interface Company {
  id: string;
  name: string;
  logo: string;
  logoColor: string;
  roles: string[];
  active: boolean;
}
const MOCK_QUESTIONS: Question[] = [
{
  id: 'q1',
  text: 'Tell me about a time you had to work under pressure.',
  type: 'behavioral',
  role: 'All',
  difficulty: 'Easy',
  active: true
},
{
  id: 'q2',
  text: 'Describe a situation where you disagreed with your manager.',
  type: 'behavioral',
  role: 'All',
  difficulty: 'Medium',
  active: true
},
{
  id: 'q3',
  text: 'Design a URL shortening service like bit.ly.',
  type: 'system-design',
  role: 'Software Engineer',
  difficulty: 'Hard',
  active: true
},
{
  id: 'q4',
  text: 'Implement a function to reverse a linked list.',
  type: 'technical',
  role: 'Software Engineer',
  difficulty: 'Medium',
  active: true
},
{
  id: 'q5',
  text: 'How would you prioritize features for a new product?',
  type: 'behavioral',
  role: 'Product Manager',
  difficulty: 'Medium',
  active: true
},
{
  id: 'q6',
  text: 'Design a notification system for a social media app.',
  type: 'system-design',
  role: 'Software Engineer',
  difficulty: 'Hard',
  active: false
},
{
  id: 'q7',
  text: 'Walk me through how you would analyze a drop in DAU.',
  type: 'behavioral',
  role: 'Product Manager',
  difficulty: 'Hard',
  active: true
},
{
  id: 'q8',
  text: 'Explain the difference between SQL and NoSQL databases.',
  type: 'technical',
  role: 'Data Scientist',
  difficulty: 'Easy',
  active: true
},
{
  id: 'q9',
  text: 'How do you handle conflicting stakeholder priorities?',
  type: 'behavioral',
  role: 'All',
  difficulty: 'Medium',
  active: true
},
{
  id: 'q10',
  text: 'Implement a binary search algorithm.',
  type: 'technical',
  role: 'Software Engineer',
  difficulty: 'Easy',
  active: true
},
{
  id: 'q11',
  text: 'Design a user research study for a new feature.',
  type: 'behavioral',
  role: 'UX/UI Designer',
  difficulty: 'Medium',
  active: true
},
{
  id: 'q12',
  text: 'How would you improve the onboarding experience of Spotify?',
  type: 'behavioral',
  role: 'Product Manager',
  difficulty: 'Hard',
  active: false
}];

const MOCK_COMPANIES: Company[] = [
{
  id: 'c1',
  name: 'Google',
  logo: 'G',
  logoColor: 'bg-blue-500',
  roles: ['Software Engineer II', 'Senior SWE', 'Staff Engineer'],
  active: true
},
{
  id: 'c2',
  name: 'Stripe',
  logo: 'S',
  logoColor: 'bg-indigo-500',
  roles: ['Software Engineer', 'Backend Engineer'],
  active: true
},
{
  id: 'c3',
  name: 'Airbnb',
  logo: 'A',
  logoColor: 'bg-rose-500',
  roles: ['Frontend Engineer', 'Full Stack Engineer'],
  active: true
},
{
  id: 'c4',
  name: 'Meta',
  logo: 'M',
  logoColor: 'bg-blue-600',
  roles: ['Software Engineer', 'Research Engineer'],
  active: true
},
{
  id: 'c5',
  name: 'Notion',
  logo: 'N',
  logoColor: 'bg-neutral-800',
  roles: ['Software Engineer', 'Product Engineer'],
  active: true
},
{
  id: 'c6',
  name: 'Linear',
  logo: 'L',
  logoColor: 'bg-purple-500',
  roles: ['Full Stack Engineer', 'Frontend Engineer'],
  active: true
},
{
  id: 'c7',
  name: 'Figma',
  logo: 'F',
  logoColor: 'bg-pink-500',
  roles: ['Software Engineer', 'Design Engineer'],
  active: false
},
{
  id: 'c8',
  name: 'Vercel',
  logo: 'V',
  logoColor: 'bg-slate-800',
  roles: ['Software Engineer', 'DevRel Engineer'],
  active: true
}];

function ContentManagerSection() {
  const [subTab, setSubTab] = useState<'questions' | 'companies'>('questions');
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [qSearch, setQSearch] = useState('');
  const [qTypeFilter, setQTypeFilter] = useState('all');
  const [qDiffFilter, setQDiffFilter] = useState('all');
  const [editingQ, setEditingQ] = useState<string | null>(null);
  const [editingQText, setEditingQText] = useState('');
  const filteredQ = questions.filter((q) => {
    const matchSearch = q.text.toLowerCase().includes(qSearch.toLowerCase());
    const matchType = qTypeFilter === 'all' || q.type === qTypeFilter;
    const matchDiff = qDiffFilter === 'all' || q.difficulty === qDiffFilter;
    return matchSearch && matchType && matchDiff;
  });
  const toggleQActive = (id: string) =>
  setQuestions((qs) =>
  qs.map((q) =>
  q.id === id ?
  {
    ...q,
    active: !q.active
  } :
  q
  )
  );
  const toggleCompanyActive = (id: string) =>
  setCompanies((cs) =>
  cs.map((c) =>
  c.id === id ?
  {
    ...c,
    active: !c.active
  } :
  c
  )
  );
  const startEditQ = (q: Question) => {
    setEditingQ(q.id);
    setEditingQText(q.text);
  };
  const saveEditQ = (id: string) => {
    setQuestions((qs) =>
    qs.map((q) =>
    q.id === id ?
    {
      ...q,
      text: editingQText
    } :
    q
    )
    );
    setEditingQ(null);
  };
  const typeBadge = (type: Question['type']) => {
    if (type === 'behavioral')
    return 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400';
    if (type === 'technical')
    return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400';
    return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
  };
  const diffBadge = (d: Question['difficulty']) => {
    if (d === 'Easy')
    return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
    if (d === 'Medium')
    return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
    return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
  };
  return (
    <div>
      <SectionHeader
        title="Content Manager"
        subtitle="Manage interview questions and companies"
        action={
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
            <PlusIcon className="w-3.5 h-3.5" /> Add New
          </button>
        } />


      {/* Sub-tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1 w-fit mb-5">
        {[
        {
          id: 'questions' as const,
          label: 'Questions',
          count: questions.length
        },
        {
          id: 'companies' as const,
          label: 'Companies',
          count: companies.length
        }].
        map((tab) =>
        <button
          key={tab.id}
          onClick={() => setSubTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${subTab === tab.id ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>

            {tab.label}
            <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${subTab === tab.id ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-500'}`}>

              {tab.count}
            </span>
          </button>
        )}
      </div>

      {subTab === 'questions' &&
      <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-48">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
              type="text"
              placeholder="Search questions..."
              value={qSearch}
              onChange={(e) => setQSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors" />

            </div>
            {[
          {
            value: qTypeFilter,
            onChange: setQTypeFilter,
            options: ['all', 'behavioral', 'technical', 'system-design'],
            label: 'Type'
          },
          {
            value: qDiffFilter,
            onChange: setQDiffFilter,
            options: ['all', 'Easy', 'Medium', 'Hard'],
            label: 'Difficulty'
          }].
          map(({ value, onChange, options, label }) =>
          <div key={label} className="relative">
                <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer">

                  {options.map((o) =>
              <option key={o} value={o}>
                      {o === 'all' ? `All ${label}s` : o}
                    </option>
              )}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
          )}
            <div className="text-xs text-slate-400 flex items-center">
              {filteredQ.length} questions
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {[
                'Question',
                'Type',
                'Role',
                'Difficulty',
                'Status',
                'Actions'].
                map((h) =>
                <th
                  key={h}
                  className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3">

                      {h}
                    </th>
                )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredQ.map((q) =>
              <tr
                key={q.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">

                    <td className="px-4 py-3 max-w-xs">
                      {editingQ === q.id ?
                  <div className="flex items-center gap-2">
                          <input
                      value={editingQText}
                      onChange={(e) => setEditingQText(e.target.value)}
                      className="flex-1 text-sm px-2 py-1 border border-indigo-400 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none" />

                          <button
                      onClick={() => saveEditQ(q.id)}
                      className="text-emerald-500 hover:text-emerald-600">

                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                      onClick={() => setEditingQ(null)}
                      className="text-slate-400 hover:text-slate-600">

                            <XIcon className="w-4 h-4" />
                          </button>
                        </div> :

                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                          {q.text}
                        </p>
                  }
                    </td>
                    <td className="px-4 py-3">
                      <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${typeBadge(q.type)}`}>

                        {q.type.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                      {q.role}
                    </td>
                    <td className="px-4 py-3">
                      <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diffBadge(q.difficulty)}`}>

                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                    onClick={() => toggleQActive(q.id)}
                    className={`relative w-9 h-5 rounded-full transition-colors ${q.active ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}>

                        <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${q.active ? 'translate-x-4' : 'translate-x-0'}`} />

                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                      onClick={() => startEditQ(q)}
                      className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">

                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                      onClick={() =>
                      setQuestions((qs) =>
                      qs.filter((x) => x.id !== q.id)
                      )
                      }
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">

                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      }

      {subTab === 'companies' &&
      <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                {companies.filter((c) => c.active).length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active companies
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                {companies.reduce((acc, c) => acc + c.roles.length, 0)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total roles
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {companies.map((c) =>
          <div
            key={c.id}
            className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition-opacity ${c.active ? '' : 'opacity-50'}`}>

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                  className={`w-10 h-10 rounded-xl ${c.logoColor} flex items-center justify-center text-white font-display font-bold text-base flex-shrink-0`}>

                      {c.logo}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {c.roles.length} roles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                  onClick={() => toggleCompanyActive(c.id)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${c.active ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}>

                      <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${c.active ? 'translate-x-4' : 'translate-x-0'}`} />

                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.roles.map((r) =>
              <span
                key={r}
                className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">

                      {r}
                    </span>
              )}
                </div>
              </div>
          )}
          </div>
        </div>
      }
    </div>);

}
// ─── Settings Section ─────────────────────────────────────────────────────────
function SettingsSection() {
  const [settings, setSettings] = useState({
    showFirstPartyStats: false,
    collectConfidenceRatings: true,
    collectOutcomeData: true,
    showPaywall: true,
    enableAICoach: true,
    maintenanceMode: false
  });
  const toggle = (key: keyof typeof settings) =>
  setSettings((s) => ({
    ...s,
    [key]: !s[key]
  }));
  return (
    <div className="max-w-2xl space-y-6">
      <SectionHeader
        title="Settings"
        subtitle="Configure platform behavior and feature flags" />


      {/* Onboarding copy */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1">
          Onboarding Copy
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Control which claims appear in the onboarding flow
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Show first-party stats
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                e.g. "89% of our PM users pass their first round"
              </p>
            </div>
            <button
              onClick={() => toggle('showFirstPartyStats')}
              className="flex-shrink-0">

              {settings.showFirstPartyStats ?
              <ToggleRightIcon className="w-8 h-8 text-indigo-500" /> :

              <ToggleLeftIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              }
            </button>
          </div>
          {!settings.showFirstPartyStats &&
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/15 rounded-lg border border-amber-200 dark:border-amber-800">
              <AlertCircleIcon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                First-party stats are hidden. Third-party research citations are
                showing instead.
              </p>
            </div>
          }
        </div>
      </div>

      {/* Data collection */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1">
          Data Collection
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Toggle in-product survey touchpoints
        </p>
        <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700">
          {[
          {
            key: 'collectConfidenceRatings' as const,
            label: 'Pre/post confidence ratings',
            desc: 'Shown before and after the mock interview'
          },
          {
            key: 'collectOutcomeData' as const,
            label: 'Outcome tracker',
            desc: 'Dashboard card asking about real interview results'
          }].
          map(({ key, label, desc }) =>
          <div key={key} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <button onClick={() => toggle(key)} className="flex-shrink-0">
                {settings[key] ?
              <ToggleRightIcon className="w-8 h-8 text-indigo-500" /> :

              <ToggleLeftIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              }
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feature flags */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1">
          Feature Flags
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Enable or disable platform features
        </p>
        <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-700">
          {[
          {
            key: 'showPaywall' as const,
            label: 'Paywall / upgrade flow',
            desc: 'Show the pricing screen at end of onboarding'
          },
          {
            key: 'enableAICoach' as const,
            label: 'AI Coach',
            desc: 'Allow users to access the AI coaching chat'
          },
          {
            key: 'maintenanceMode' as const,
            label: 'Maintenance mode',
            desc: 'Show maintenance page to all non-admin users'
          }].
          map(({ key, label, desc }) =>
          <div key={key} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <button onClick={() => toggle(key)} className="flex-shrink-0">
                {settings[key] ?
              <ToggleRightIcon
                className={`w-8 h-8 ${key === 'maintenanceMode' ? 'text-red-500' : 'text-indigo-500'}`} /> :


              <ToggleLeftIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              }
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1">
          Pricing Config
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Current plan pricing (read-only in this view)
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
          {
            plan: 'Annual',
            price: '$9.99/mo',
            billed: '$119/year',
            badge: 'Active'
          },
          {
            plan: 'Monthly',
            price: '$19.99/mo',
            billed: 'Monthly',
            badge: 'Active'
          }].
          map(({ plan, price, billed, badge }) =>
          <div
            key={plan}
            className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">

              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                  {plan}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium">
                  {badge}
                </span>
              </div>
              <p className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {price}
              </p>
              <p className="text-xs text-slate-400">{billed}</p>
            </div>
          )}
        </div>
      </div>
    </div>);

}
// ─── Main Admin Page ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
{
  id: 'overview' as AdminSection,
  label: 'Overview',
  icon: <LayoutDashboardIcon className="w-4 h-4" />
},
{
  id: 'analytics' as AdminSection,
  label: 'Analytics',
  icon: <BarChart2Icon className="w-4 h-4" />
},
{
  id: 'users' as AdminSection,
  label: 'Users',
  icon: <UsersIcon className="w-4 h-4" />
},
{
  id: 'responses' as AdminSection,
  label: 'Responses',
  icon: <MessageSquareIcon className="w-4 h-4" />
},
{
  id: 'sessions' as AdminSection,
  label: 'Sessions',
  icon: <VideoIcon className="w-4 h-4" />
},
{
  id: 'content' as AdminSection,
  label: 'Content',
  icon: <BookOpenIcon className="w-4 h-4" />
},
{
  id: 'settings' as AdminSection,
  label: 'Settings',
  icon: <SettingsIcon className="w-4 h-4" />
}];

export function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const sectionTitles: Record<AdminSection, string> = {
    overview: 'Overview',
    analytics: 'Analytics & Marketing',
    users: 'User Management',
    responses: 'Survey Responses',
    sessions: 'Interview Sessions',
    content: 'Content Manager',
    settings: 'Settings'
  };
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden font-body">
      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 bg-slate-900 dark:bg-slate-950 flex flex-col border-r border-slate-800">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <img
              src="/[favicon]-Prep-mirror-white-bg.png"
              alt="PrepMirrors"
              className="w-7 h-7 rounded-lg" />

            <div>
              <p className="font-display font-bold text-white text-sm leading-none">
                PrepMirrors
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ id, label, icon }) =>
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>

              {icon}
              {label}
            </button>
          )}
        </nav>

        {/* Admin user */}
        <div className="px-3 py-4 border-t border-slate-800">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <ShieldIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Admin</p>
              <p className="text-xs text-slate-500 truncate">
                admin@prepmirrors.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="font-display font-bold text-slate-900 dark:text-white">
              {sectionTitles[activeSection]}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              PrepMirrors Admin · Last updated just now
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <RefreshCwIcon className="w-3.5 h-3.5" /> Refresh
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <ShieldIcon className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div key={activeSection} className="animate-fade-in">
            {activeSection === 'overview' && <OverviewSection />}
            {activeSection === 'analytics' && <AnalyticsSection />}
            {activeSection === 'users' && <UsersSection />}
            {activeSection === 'responses' && <ResponsesSection />}
            {activeSection === 'sessions' && <SessionsSection />}
            {activeSection === 'content' && <ContentManagerSection />}
            {activeSection === 'settings' && <SettingsSection />}
          </div>
        </main>
      </div>
    </div>);

}