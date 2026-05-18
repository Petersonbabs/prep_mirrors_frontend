// frontend/src/components/NotificationDropdown.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  BellIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  SparklesIcon,
  InfoIcon,
  FlameIcon,
  AwardIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'score' | 'tip' | 'system' | 'achievement' | 'streak';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  data?: any;
}

const NOTIFICATION_ICONS: Record<Notification['type'], React.ReactNode> = {
  score: <TrendingUpIcon className="w-4 h-4 text-primary-500" />,
  tip: <SparklesIcon className="w-4 h-4 text-accent-500" />,
  system: <InfoIcon className="w-4 h-4 text-neutral-500" />,
  achievement: <AwardIcon className="w-4 h-4 text-secondary-500" />,
  streak: <FlameIcon className="w-4 h-4 text-orange-500" />,
};

export function NotificationDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false);

    if (notification.type === 'score' && notification.data?.sessionId) {
      navigate(`/feedback/${notification.data.sessionId}`);
    } else if (notification.type === 'streak') {
      navigate('/dashboard/progress');
    } else if (notification.type === 'achievement') {
      navigate('/dashboard/progress');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="relative">
        <button className="relative p-2 rounded-lg text-neutral-500 dark:text-neutral-400">
          <BellIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-label="Notifications"
      >
        <BellIcon className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-2xl shadow-card border border-neutral-100 dark:border-neutral-700 overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-neutral-900 dark:text-white text-sm">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <BellIcon className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${!notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                    }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {NOTIFICATION_ICONS[notification.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm font-medium truncate ${!notification.read
                            ? 'text-neutral-900 dark:text-white'
                            : 'text-neutral-700 dark:text-neutral-300'
                          }`}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-700">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              className="w-full py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}