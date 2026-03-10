import React, { useEffect, useState, useRef } from 'react';
import {
  BellIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  SparklesIcon,
  InfoIcon,
  XIcon } from
'lucide-react';
interface Notification {
  id: string;
  type: 'score' | 'tip' | 'system' | 'achievement';
  title: string;
  message: string;
  time: string;
  read: boolean;
}
const MOCK_NOTIFICATIONS: Notification[] = [
{
  id: '1',
  type: 'score',
  title: 'Interview Score Ready',
  message: 'Your Stripe Technical interview scored 82/100',
  time: '2h ago',
  read: false
},
{
  id: '2',
  type: 'tip',
  title: 'Daily Tip',
  message: 'Practice the STAR method for behavioral questions',
  time: '5h ago',
  read: false
},
{
  id: '3',
  type: 'achievement',
  title: 'Achievement Unlocked!',
  message: 'You earned the "First Streak" badge 🔥',
  time: '1d ago',
  read: true
},
{
  id: '4',
  type: 'system',
  title: 'New Companies Added',
  message: 'Linear and Figma interviews are now available',
  time: '2d ago',
  read: true
}];

const NOTIFICATION_ICONS: Record<Notification['type'], React.ReactNode> = {
  score: <TrendingUpIcon className="w-4 h-4 text-primary-500" />,
  tip: <SparklesIcon className="w-4 h-4 text-accent-500" />,
  system: <InfoIcon className="w-4 h-4 text-neutral-500" />,
  achievement: <CheckCircleIcon className="w-4 h-4 text-secondary-500" />
};
export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node))
      {
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
  const markAllAsRead = () => {
    setNotifications((prev) =>
    prev.map((n) => ({
      ...n,
      read: true
    }))
    );
  };
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
    prev.map((n) =>
    n.id === id ?
    {
      ...n,
      read: true
    } :
    n
    )
    );
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-label="Notifications">

        <BellIcon className="w-4 h-4" />
        {unreadCount > 0 &&
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        }
      </button>

      {isOpen &&
      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-2xl shadow-card border border-neutral-100 dark:border-neutral-700 overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-neutral-900 dark:text-white text-sm">
                Notifications
              </h3>
              {unreadCount > 0 &&
            <span className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full">
                  {unreadCount}
                </span>
            }
            </div>
            {unreadCount > 0 &&
          <button
            onClick={markAllAsRead}
            className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors">

                Mark all as read
              </button>
          }
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ?
          <div className="px-4 py-8 text-center">
                <BellIcon className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No notifications yet
                </p>
              </div> :

          notifications.map((notification) =>
          <button
            key={notification.id}
            onClick={() => markAsRead(notification.id)}
            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${!notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>

                  <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {NOTIFICATION_ICONS[notification.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                  className={`text-sm font-medium truncate ${!notification.read ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>

                        {notification.title}
                      </p>
                      {!notification.read &&
                <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />
                }
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </button>
          )
          }
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-700">
            <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">

              View all notifications
            </button>
          </div>
        </div>
      }
    </div>);

}