import { useEffect, useState } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { usePushNotifications } from '../../lib/hooks/usePushNotifications';

interface PushPermissionPromptProps {
    onClose?: () => void;
}

export function PushPermissionPrompt({ onClose }: PushPermissionPromptProps) {
    const { permission, requestPermission, isSubscribed, loading } = usePushNotifications();
    const [dismissed, setDismissed] = useState(false);

    // Don't show if already subscribed or permission denied or dismissed
    if (dismissed || isSubscribed || permission === 'denied' || loading) {
        return null;
    }

    // Don't show if already granted (user already allowed)
    if (permission === 'granted') {
        return null;
    }

    return (
        <div className="fixed w-[90vw] bottom-4 right-4 z-50 max-w-sm animate-slide-up">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-4">
                <div className="flex flex-col md:flex-row items-start gap-3">
                    <div className='flex justify-between w-full md:hidden'>
                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5 text-primary-500" />
                        </div>
                        <button
                            onClick={() => {
                                setDismissed(true);
                                onClose?.();
                            }}
                            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-neutral-400 " />
                        </button>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">
                            Get Daily Reminders
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Never miss a practice session. We'll send you a daily reminder to keep your streak alive.
                        </p>
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => {
                                    setDismissed(true);
                                    onClose?.();
                                }}
                                className="px-3 py-1.5 text-neutral-500 hover:text-neutral-700 text-xs font-medium rounded-lg transition-colors"
                            >
                                Maybe later
                            </button>
                            <button
                                onClick={async () => {
                                    await requestPermission();
                                }}
                                className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                                Enable Notifications
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setDismissed(true);
                            onClose?.();
                        }}
                        className="p-1 hidden md:inline hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-neutral-400 " />
                    </button>
                </div>
            </div>
        </div>
    );
}