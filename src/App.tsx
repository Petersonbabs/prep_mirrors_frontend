import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate
} from
  'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';
import { PricingPage } from './pages/PricingPage';
import Signin from './pages/Signin';
import { Toaster } from 'sonner';

export type Theme = 'light' | 'dark' | 'system';
export type Page = 'dashboard' | 'progress' | 'pricing' | 'account' | 'settings';
export interface InterviewData {
  id: string;
  company: string;
  role: string;
  salary: string;
  jobType: string;
  location: string;
  phase: 'technical' | 'behavioral';
  difficulty: string;
  logo: string;
}
// Pages that hide the navbar
const HIDDEN_NAVBAR_PATHS = ['/onboarding', '/auth', '/admin'];
// Pages that show the sidebar (logged-in dashboard area)
const SIDEBAR_PATHS = [
  '/dashboard',
  '/dashboard/interview-script',
  '/dashboard/interview-session',
  '/dashboard/feedback',
  '/dashboard/coach',
  '/dashboard/progress',
  '/dashboard/account',
  '/dashboard/billing',
  '/dashboard/settings',
  '/dashboard/support'
];

// Supabase client is imported from ./lib/supabase

import { useAuth } from './lib/hooks/useAuth';
import PublicLayout from './components/provider/PublicLayout';
import DashboardLayout from './components/provider/DashboardLayout';
import Paywall from './components/ui/Payment/Paywall';
import PaymentSuccess from './pages/SuccessPage';
import AuthCallback from './pages/AuthCallback';
import OnboardingProvider from './pages/onboarding/components/OnboardingProvider';
import { LemonSqueezyProvider } from './contexts/LemonSqueezyContext';

export function App() {
  const { user, profile: userProfile, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>('system');

  const [showWalkthrough, setShowWalkthrough] = useState(false);
  // Apply theme to html element
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else if (theme === 'light') {
      html.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      prefersDark ? html.classList.add('dark') : html.classList.remove('dark');
    }
  }, [theme]);
  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      e.matches ?
        document.documentElement.classList.add('dark') :
        document.documentElement.classList.remove('dark');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);
  const handleOnboardingComplete = async () => {
    await refreshProfile();
    setShowWalkthrough(true);
    navigate('/dashboard');
  };

  const showNavbar = !HIDDEN_NAVBAR_PATHS.includes(location.pathname);
  const showSidebar = !!userProfile && SIDEBAR_PATHS.includes(location.pathname);
  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-900 transition-colors duration-300 font-body">
      <LemonSqueezyProvider>
        <Toaster
          closeButton
          richColors
          position='top-right'
        />
        {showNavbar &&
          <Navbar
            theme={theme}
            onThemeChange={setTheme}
            showSidebar={showSidebar} />
        }

        {showSidebar && <Sidebar />}

        <main
          className={`${showNavbar ? 'pt-16' : ''} ${showSidebar ? 'md:pl-56' : ''}`}>

          <Routes>
            <Route
              path="/*"
              element={
                <PublicLayout />
              } />

            <Route
              path="/dashboard/*"
              element={
                <DashboardLayout />
              } />

            <Route
              path="/signin"
              element={
                <Signin />
              }
            />

            <Route
              path="/auth"
              element={
                <AuthPage
                  onContinue={() => navigate('/onboarding')}
                  onBack={() => navigate('/')} />

              } />

            <Route path='/auth/callback' element={<AuthCallback />} />

            <Route
              path="/onboarding"
              element={
                (!isLoading && !user) ? <Navigate to="/auth" replace /> :
                  <OnboardingProvider>
                    <OnboardingPage
                      onComplete={handleOnboardingComplete}
                      onBack={() => navigate('/auth')} />
                  </OnboardingProvider>
              }
            />

            <Route path="/payment-success" element={<PaymentSuccess />} />


            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/paywall" element={<Paywall />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />


            <Route path="/admin" element={<AdminPage />} />
            {/* Catch-all → home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </LemonSqueezyProvider>
    </div>);

}