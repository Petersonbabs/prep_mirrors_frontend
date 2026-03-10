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
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { InterviewScriptPage } from './pages/InterviewScriptPage';
import { InterviewSessionPage } from './pages/InterviewSessionPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { CoachPage } from './pages/CoachPage';
import { AdminPage } from './pages/AdminPage';
import { ProgressPage } from './pages/ProgressPage';
import { PricingPage } from './pages/PricingPage';
import { AccountPage } from './pages/AccountPage';
import { SettingsPage } from './pages/SettingsPage';
import Signin from './pages/Signin';

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
  '/interview/script',
  '/interview/session',
  '/feedback',
  '/coach',
  '/progress',
  '/account',
  '/pricing',
  '/settings'];

// Supabase client is imported from ./lib/supabase

import { useAuth } from './lib/hooks/useAuth';

export function App() {
  const { user, profile: userProfile, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>('system');
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewData | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'technical' | 'behavioral'>(
    'technical'
  );
  const [feedbackData, setFeedbackData] = useState<{
    question: string;
    answer: string;
  } | null>(null);
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
  const handleWalkthroughComplete = () => {
    setShowWalkthrough(false);
  };
  const handleStartInterview = (interview: InterviewData) => {
    setSelectedInterview(interview);
    setCurrentPhase('technical');
    navigate('/interview/script');
  };
  const handleScriptComplete = () => {
    navigate('/interview/session');
  };
  const handleSessionComplete = (data: {
    question: string;
    answer: string;
  }) => {
    setFeedbackData(data);
    navigate('/feedback');
  };
  const handleImproveWithCoach = () => {
    navigate('/coach');
  };
  const handleNextPhase = () => {
    if (currentPhase === 'technical') {
      setCurrentPhase('behavioral');
      navigate('/interview/script');
    } else {
      navigate('/dashboard');
    }
  };
  const showNavbar = !HIDDEN_NAVBAR_PATHS.includes(location.pathname);
  const showSidebar = !!userProfile && SIDEBAR_PATHS.includes(location.pathname);
  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-900 transition-colors duration-300 font-body">
      {/* <ul>
        {instruments.map((instrument) => (
          <li key={instrument.name}>{instrument.name}</li>
        ))}
      </ul> */}
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
            path="/"
            element={
              <HomePage
                onGetStarted={() => navigate('/auth')}
                onSignIn={() => navigate('/dashboard')} />

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

          <Route
            path="/onboarding"
            element={
              (!isLoading && !user) ? <Navigate to="/signin" replace /> :
                <OnboardingPage
                  onComplete={handleOnboardingComplete}
                  onBack={() => navigate('/auth')} />
            } />

          <Route
            path="/dashboard"
            element={
              (!isLoading && !user) ? <Navigate to="/signin" replace /> :
                <DashboardPage
                  onStartInterview={handleStartInterview}
                  onNavigate={(page) => navigate(`/${page}`)}
                  showWalkthrough={showWalkthrough}
                  onWalkthroughComplete={handleWalkthroughComplete} />
            } />

          <Route
            path="/interview/script"
            element={
              selectedInterview ?
                <InterviewScriptPage
                  interview={selectedInterview}
                  phase={currentPhase}
                  onContinue={handleScriptComplete}
                  onBack={() => navigate('/dashboard')} /> :


                <Navigate to="/dashboard" replace />

            } />

          <Route
            path="/interview/session"
            element={
              selectedInterview ?
                <InterviewSessionPage
                  interview={selectedInterview}
                  phase={currentPhase}
                  onComplete={handleSessionComplete}
                  onBack={() => navigate('/interview/script')} /> :


                <Navigate to="/dashboard" replace />

            } />

          <Route
            path="/feedback"
            element={
              feedbackData && selectedInterview ?
                <FeedbackPage
                  interview={selectedInterview}
                  phase={currentPhase}
                  feedbackData={feedbackData}
                  onImprove={handleImproveWithCoach}
                  onNextPhase={handleNextPhase}
                  onDashboard={() => navigate('/dashboard')} /> :


                <Navigate to="/dashboard" replace />

            } />

          <Route
            path="/coach"
            element={
              feedbackData ?
                <CoachPage
                  feedbackData={feedbackData}
                  onBack={() => navigate('/feedback')}
                  onDashboard={() => navigate('/dashboard')} /> :


                <Navigate to="/dashboard" replace />

            } />

          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>);

}