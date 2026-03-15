// frontend/src/contexts/PaddleContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import toast from 'react-hot-toast';

interface PaddleContextType {
  paddle: Paddle | null;
  billingCycle: 'month' | 'year';
  setBillingCycle: (cycle: 'month' | 'year') => void;
  openCheckout: (options?: any) => void;
  startFreeTrial: (profileId: string) => Promise<boolean>;
  isLoading: boolean;
}

const PaddleContext = createContext<PaddleContextType | null>(null);

export const usePaddle = () => {
  const context = useContext(PaddleContext);
  if (!context) {
    throw new Error('usePaddle must be used within a PaddleProvider');
  }
  return context;
};

interface PaddleProviderProps {
  children: ReactNode;
  userId?: string; // profile ID
  userEmail?: string;
}

const PaddleProvider: React.FC<PaddleProviderProps> = ({
  children,
  userId,
  userEmail
}) => {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('year');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    const environment = import.meta.env.VITE_PADDLE_ENV || 'sandbox';

    initializePaddle({
      environment,
      token,
    }).then((paddleInstance) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
      setIsLoading(false);
    });
  }, []);

  const openCheckout = (options?: any) => {
    if (!paddle) {
      console.error('Paddle not initialized');
      return;
    }

    // If options already contains items, use that, otherwise use the billing cycle
    const checkoutOptions = options?.items ? options : {
      items: [{
        priceId: billingCycle === 'month'
          ? import.meta.env.VITE_PADDLE_MONTHLY_PRICE_ID
          : import.meta.env.VITE_PADDLE_ANNUALLY_PRICE_ID,
        quantity: 1
      }],
      customer: {
        email: userEmail,
      },
      customData: {
        profileId: userId,
      },
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        successUrl: `${window.location.origin}/payment-success`,
      },
      ...options,
    };

    paddle.Checkout.open(checkoutOptions);
  };

  const startFreeTrial = async (profileId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/start-trial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start trial');
      }

      const data = await response.json();
      console.log('Trial started:', data);
      return true;
    } catch (error: any) {
      toast.error(error.message)
      console.error('Error starting trial:', error.message);
      return false;
    }
  };

  const value = {
    paddle,
    billingCycle,
    setBillingCycle,
    openCheckout,
    startFreeTrial,
    isLoading,
  };

  return (
    <PaddleContext.Provider value={value}>
      {children}
    </PaddleContext.Provider>
  );
};

export default PaddleProvider;