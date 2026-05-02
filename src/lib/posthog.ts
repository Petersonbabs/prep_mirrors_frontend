// frontend/src/lib/posthog.ts
import posthog from 'posthog-js';

let isInitialized = false;

export const initPostHog = () => {
  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

  if (!apiKey) {
    console.error('❌ PostHog: Missing API key');
    return;
  }

  if (isInitialized) return;
  
  console.log('🔧 Initializing PostHog with key:', apiKey.substring(0, 10) + '...');
  
  try {
    posthog.init(apiKey, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: false,
      persistence: 'localStorage',
      loaded: (ph) => {
        console.log('✅ PostHog loaded successfully');
        isInitialized = true;
        (window as any).posthog = ph;
      },
    });
  } catch (error) {
    console.error('❌ PostHog init error:', error);
  }
};

export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`📤 Event: ${eventName}`, properties);
  
  // If PostHog is not ready, still log it (but don't queue endlessly)
  if (!isInitialized) {
    console.warn(`⚠️ PostHog not ready, event not sent: ${eventName}`);
    return;
  }
  
  try {
    posthog.capture(eventName, properties);
    console.log(`✅ Event sent: ${eventName}`);
  } catch (error) {
    console.error(`❌ Failed to send ${eventName}:`, error);
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (!isInitialized) {
    console.warn('⚠️ PostHog not ready, identification queued');
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
    console.log(`✅ User identified: ${userId}`);
  } catch (error) {
    console.error('Failed to identify user:', error);
  }
};

export const resetUser = () => {
    if (typeof window !== 'undefined' && posthog) {
        posthog.reset();
    }
};