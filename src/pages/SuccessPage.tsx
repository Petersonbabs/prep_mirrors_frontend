// src/pages/PaymentSuccess.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-3">
          Welcome to Pro! 🎉
        </h1>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Your subscription has been activated successfully. You now have unlimited access to all PrepMirrors features.
        </p>
        
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        
        <p className="text-sm text-neutral-500 mt-4">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;