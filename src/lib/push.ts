// frontend/src/lib/push.ts
import { apiClient } from './api/client';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    
    return registration;
  } catch (error) {
    
    return null;
  }
}

export async function subscribeToPush(registration: ServiceWorkerRegistration): Promise<boolean> {
  try {
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      
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
    
    
    return true;
  } catch (error) {
    
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
    
    return true;
  }
  
  return false;
}