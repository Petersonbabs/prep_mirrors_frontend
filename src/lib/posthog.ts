// frontend/src/lib/posthog.ts
import posthog from 'posthog-js';

let isInitialized = false;

export const initPostHog = () => {
  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

  if (!apiKey) {
    
    return;
  }

  if (isInitialized) return;
  
  
  
  try {
    posthog.init(apiKey, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: false,
      persistence: 'localStorage',
      loaded: (ph) => {
        
        isInitialized = true;
        (window as any).posthog = ph;
      },
    });
  } catch (error) {
    
  }
};

export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  
  
  // If PostHog is not ready, still log it (but don't queue endlessly)
  if (!isInitialized) {
    
    return;
  }
  
  try {
    posthog.capture(eventName, properties);
    
  } catch (error) {
    
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (!isInitialized) {
    
    // Wait for PostHog to be ready
    const checkInterval = setInterval(() => {
      if (isInitialized) {
        clearInterval(checkInterval);
        identifyUser(userId, properties);
      }
    }, 500);
    return;
  }
  
  try {
    posthog.identify(userId, properties);
    
  } catch (error) {
    
  }
};

export const resetUser = () => {
    if (typeof window !== 'undefined' && posthog) {
        posthog.reset();
    }
};