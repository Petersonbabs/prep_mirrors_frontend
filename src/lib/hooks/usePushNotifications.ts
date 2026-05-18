// frontend/src/lib/hooks/usePushNotifications.ts
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { pushApi } from '../api/push';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export function usePushNotifications() {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);

      if (supported && user?.id) {
        await checkSubscriptionStatus();
      }
      setLoading(false);
    };

    checkSupport();
  }, [user]);

  const checkSubscriptionStatus = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
    setPermission(Notification.permission as NotificationPermission);
  };

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  };

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.log('Push notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission as NotificationPermission);

      if (permission === 'granted') {
        const registration = await registerServiceWorker();
        if (registration) {
          await subscribeToPush(registration);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }, [isSupported]);

  const subscribeToPush = async (registration: ServiceWorkerRegistration) => {
    try {
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: VAPID_PUBLIC_KEY,
        });
      }

      const response = await pushApi.subscribe(
        subscription.toJSON(),
        navigator.userAgent
      );

      if (response.success) {
        setIsSubscribed(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return false;
    }
  };

  const unsubscribeFromPush = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      await pushApi.unsubscribe(subscription.endpoint);
      setIsSubscribed(false);
    }
  };

  const showTestNotification = () => {
    if (permission === 'granted') {
      new Notification('PrepMirrors Test', {
        body: 'This is a test notification from PrepMirrors!',
        icon: '/icon-192.png',
        badge: '/badge-72x72.png',
        // vibrate: [200, 100, 200],
      });
    }
  };

  return {
    isSupported,
    isSubscribed,
    permission,
    loading,
    requestPermission,
    unsubscribeFromPush,
    showTestNotification,
  };
}