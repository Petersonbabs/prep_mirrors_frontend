import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  TrendingUpIcon,
  CreditCardIcon,
  UserIcon,
  SettingsIcon,
  HelpCircle
} from
  'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';
import { ProfileAvatar } from './ui/ProfileAvatar';

interface SidebarProps {
}
interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}
const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboardIcon className="w-4 h-4" />
  },
  {
    id: 'progress',
    label: 'Progress',
    path: '/dashboard/progress',
    icon: <TrendingUpIcon className="w-4 h-4" />
  },
  {
    id: 'pricing',
    label: 'Billing',
    path: '/dashboard/billing',
    icon: <CreditCardIcon className="w-4 h-4" />
  },
  {
    id: 'account',
    label: 'Account',
    path: '/dashboard/account',
    icon: <UserIcon className="w-4 h-4" />
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/dashboard/settings',
    icon: <SettingsIcon className="w-4 h-4" />
  },

  {
    id: 'support',
    label: 'Help & Support',
    path: '/dashboard/support',
    icon: <HelpCircle className="w-4 h-4" />
  }
];

export function Sidebar({ }: SidebarProps) {
  const { profile: userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <aside className="hidden md:flex flex-col w-56 h-screen bg-white dark:bg-neutral-800 border-r border-neutral-100 dark:border-neutral-700 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-neutral-100 dark:border-neutral-700">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 group">

          <img
            src="/[favicon]-Prep-mirror-white-bg.png"
            alt="Prep Mirrors"
            className="w-8 h-8 rounded-lg" />

          <span className="font-display font-bold text-lg text-neutral-900 dark:text-white">
            Prep<span className="text-primary-500">Mirrors</span>
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) =>
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item.path) ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 hover:text-neutral-900 dark:hover:text-white'}`}>

            <span
              className={
                isActive(item.path) ?
                  'text-primary-500' :
                  'text-neutral-400 dark:text-neutral-500'
              }>

              {item.icon}
            </span>
            {item.label}
          </button>
        )}
      </nav>

      {/* User info at bottom */}
      {userProfile &&
        <div className="px-3 py-4 border-t border-neutral-100 dark:border-neutral-700">
          <button
            onClick={() => navigate('dashboard/account')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">

            {
              userProfile?.avatar_url ? (
                <ProfileAvatar avatarUrl={userProfile?.avatar_url} size='sm'/>
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )
            }
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {userProfile.name || 'User'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {userProfile.targetRole || 'Interview prep'}
              </p>
            </div>
          </button>
        </div>
      }
    </aside>);

}