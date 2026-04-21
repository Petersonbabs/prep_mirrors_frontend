import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/dashboard');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>

                <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-3">
                    Welcome to Pro! 🎉
                </h1>

                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Your subscription has been activated. You now have unlimited access to all PrepMirrors features.
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Redirecting to dashboard in {countdown} seconds...</span>
                </div>
            </div>
        </div>
    );
}