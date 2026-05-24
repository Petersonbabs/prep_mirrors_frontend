// frontend/src/pages/NotificationsPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, ArrowLeftIcon, CheckCircleIcon, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { apiClient } from '../../lib/api/client';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  data?: any;
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [read, setRead] = useState<string[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get(`/api/notifications?limit=20&offset=${page * 20}`);
      if (response.success) {
        if (page === 0) {
          setNotifications(response.data || []);
        } else {
          setNotifications(prev => [...prev, ...(response.data || [])]);
        }
        setHasMore(response.data?.length === 20);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setRead(prev => [...prev, id])
      await apiClient.post(`/api/notifications/${id}/read`, {});
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Notifications</h1>
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.type === 'score' && notification.data?.sessionId) {
                    navigate(`/feedback/${notification.data.sessionId}`);
                  }
                }}
                className={`p-4 rounded-xl cursor-pointer transition-colors ${
                  !notification.read && !read.includes(notification.id)
                    ? 'bg-primary-50 dark:bg-primary-100/30 border-l-4 border-primary-500'
                    : 'bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-400 mt-2">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {hasMore && notifications.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-4 py-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}