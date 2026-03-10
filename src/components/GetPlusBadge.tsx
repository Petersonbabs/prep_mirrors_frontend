import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from 'lucide-react';
interface GetPlusBadgeProps {
  compact?: boolean;
}
export function GetPlusBadge({ compact = false }: GetPlusBadgeProps) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/pricing')}
      className={`shimmer-badge group flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 dark:from-amber-500 dark:via-yellow-400 dark:to-amber-600 text-amber-900 dark:text-amber-950 font-semibold rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${compact ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'}`}
      aria-label="Upgrade to Plus">

      <SparklesIcon
        className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} transition-transform group-hover:rotate-12`} />

      <span className="font-display font-bold tracking-tight">
        {compact ? 'Plus' : 'Get Plus'}
      </span>
    </button>);

}