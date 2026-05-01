// frontend/src/components/dashboard/RefreshCompaniesButton.tsx
import { useState } from 'react';
import { RefreshCwIcon, LockIcon } from 'lucide-react';
import { companiesApi } from '../../lib/api/companies';
import { useAuth } from '../../lib/hooks/useAuth';

interface Props {
    onRefresh: () => void;
    subscriptionTier: string;
}

export function RefreshCompaniesButton({ onRefresh, subscriptionTier }: Props) {
    const [refreshing, setRefreshing] = useState(false);
    const { user, profile } = useAuth();

    const handleRefresh = async () => {
        if (subscriptionTier !== 'pro') return;

        setRefreshing(true);
        const response = await companiesApi.refreshCompanies(
            user?.id as string,
            profile?.targetRole || 'Software Engineer',
            profile?.level || 'junior'
        );
        if (response.success) {
            onRefresh();
        }
        setRefreshing(false);
    };

    if (subscriptionTier !== 'pro') {
        return (
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-400 cursor-not-allowed" disabled>
                <LockIcon className="w-4 h-4" />
                <span>Upgrade to refresh</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
            <RefreshCwIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Job Listings'}</span>
        </button>
    );
}