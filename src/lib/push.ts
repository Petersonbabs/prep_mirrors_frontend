// frontend/src/lib/push.ts
import { apiClient } from './api/client';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered');
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

export async function subscribeToPush(registration: ServiceWorkerRegistration): Promise<boolean> {
  try {
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return false;
    }
    
    // Get subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });
    }
    
    // Send to backend
    await apiClient.post('/api/push/subscribe', {
      subscription: subscription.toJSON(),
      userAgent: navigator.userAgent,
    });
    
    console.log('Push subscription saved');
    return true;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return false;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  
  if (subscription) {
    await subscription.unsubscribe();
    await apiClient.post('/api/push/unsubscribe', {
      endpoint: subscription.endpoint,
    });
    console.log('Unsubscribed from push');
    return true;
  }
  
  return false;
}