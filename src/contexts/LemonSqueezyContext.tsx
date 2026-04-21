// frontend/src/contexts/LemonSqueezyContext.tsx
import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

interface LemonSqueezyContextType {
    isLoading: boolean;
    checkout: (variantId: string, email: string, userId: string) => Promise<void>;
}

const LemonSqueezyContext = createContext<LemonSqueezyContextType | null>(null);

export const useLemonSqueezy = () => {
    const context = useContext(LemonSqueezyContext);
    if (!context) {
        throw new Error('useLemonSqueezy must be used within LemonSqueezyProvider');
    }
    return context;
};

export const LemonSqueezyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const checkout = async (variantId: string, email: string, userId: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ variantId, email, userId }),
            });

            const data = await response.json();

            if (data.success && data.url) {
                // Redirect to Lemon Squeezy hosted checkout page
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to start checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LemonSqueezyContext.Provider value={{ isLoading, checkout }}>
            {children}
        </LemonSqueezyContext.Provider>
    );
};