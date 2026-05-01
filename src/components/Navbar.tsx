import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MenuIcon, XIcon, SunIcon, MoonIcon, MonitorIcon } from 'lucide-react';
import { Theme } from '../App';
import { NotificationDropdown } from './NotificationDropdown';
import { GetPlusBadge } from './GetPlusBadge';
import { useAuth } from '../lib/hooks/useAuth';
import { useDashboardData } from '../lib/hooks/useDashboardData';

interface NavbarProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  showSidebar?: boolean;
}
export function Navbar({
  theme,
  onThemeChange,
  showSidebar = false
}: NavbarProps) {
  const { profile: userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const { subscription, loading } = useDashboardData();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);
  const isLoggedIn = !!userProfile;
  const isHome = location.pathname === '/';
  const ThemeIcon =
    theme === 'dark' ? MoonIcon : theme === 'light' ? SunIcon : MonitorIcon;
  return (
    <nav
      className={`fixed top-0 right-0 z-50 transition-all duration-300 ${showSidebar ? 'left-0 md:left-56' : 'left-0'} ${scrolled || !isHome ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm border-b border-neutral-100 dark:border-neutral-800' : 'bg-transparent'}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - hide on desktop when sidebar is showing */}
          <Link
            to="/"
            onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
            className={`flex items-center gap-2.5 group ${showSidebar ? 'md:hidden' : ''}`}>

            <img
              src="/[favicon]-Prep-mirror-white-bg.png"
              alt="Prep Mirrors"
              className="w-8 h-8 rounded-lg" />

            <span className="font-display font-bold text-lg text-neutral-900 dark:text-white hidden sm:inline">
              Prep<span className="text-primary-500">Mirrors</span>
            </span>
          </Link>

          {/* Desktop Nav - hide when sidebar is showing */}
          {!showSidebar &&
            <div className="hidden md:flex items-center gap-1">
              {!isLoggedIn ?
                <>
                  <a
                    href="/#how-it-works"
                    className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg">

                    How it works
                  </a>
                  <a
                    href="/#features"
                    className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg">

                    Features
                  </a>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg">

                    Pricing
                  </button>
                </> :

                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${location.pathname === '/dashboard' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400'}`}>

                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/progress')}
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${location.pathname === '/dashboard/progress' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400'}`}>

                    Progress
                  </button>
                  <button
                    onClick={() => navigate('/pricing')}
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${location.pathname === '/pricing' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400'}`}>

                    Pricing
                  </button>
                </>
              }
            </div>
          }

          {/* Center: Get Plus Badge (when logged in) */}
          {isLoggedIn && subscription?.tier !== "pro" ? (

            <div
              className={`flex items-center justify-center ${showSidebar ? 'flex-1' : ''}`}>

              <GetPlusBadge />
            </div>
          ) : (
            <div></div>
          )
          }

          {/* Spacer when sidebar is showing but no center badge needed */}
          {showSidebar && !isLoggedIn &&
            <div className="hidden md:block flex-1" />
          }

          {/* Right actions */}
          <div className="flex items-center gap-2">


            {/* Theme toggle */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 hidden md:block rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle theme">

                <ThemeIcon className="w-4 h-4" />
              </button>
              {themeMenuOpen &&
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-neutral-800 rounded-xl shadow-card border border-neutral-100 dark:border-neutral-700 py-1 z-50">
                  {(['light', 'dark', 'system'] as Theme[]).map((t) =>
                    <button
                      key={t}
                      onClick={() => {
                        onThemeChange(t);
                        setThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${theme === t ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}>

                      {t === 'light' && <SunIcon className="w-3.5 h-3.5" />}
                      {t === 'dark' && <MoonIcon className="w-3.5 h-3.5" />}
                      {t === 'system' &&
                        <MonitorIcon className="w-3.5 h-3.5" />
                      }
                      <span className="capitalize">{t}</span>
                    </button>
                  )}
                </div>
              }
            </div>

            {isLoggedIn ?
              <div className="flex items-center gap-2">
                <NotificationDropdown />
                <button
                  onClick={() => navigate('dashboard/account')}
                  className={`${subscription?.tier === "pro" ? "flex" : "hidden md:flex"} items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors`}>

                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                    {userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block">
                    {userProfile?.name?.split(' ')[0]}
                  </span>
                </button>
              </div> :

              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => navigate('/signin')}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">

                  Sign in
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors">

                  Get Started Free
                </button>
              </div>
            }

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">

              {mobileOpen ?
                <XIcon className="w-5 h-5" /> :

                <MenuIcon className="w-5 h-5" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen &&
        <div className="md:hidden bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 px-4 py-4 space-y-2 animate-fade-in">
          {/* Get Plus Badge in mobile menu */}
          {isLoggedIn &&
            <div className="flex justify-center pb-3 mb-2 border-b border-neutral-100 dark:border-neutral-800">
              <GetPlusBadge />
            </div>
          }

          {!isLoggedIn ?
            <>
              <a
                href="#how-it-works"
                className="block px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">

                How it works
              </a>
              <a
                href="#features"
                className="block px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">

                Features
              </a>
              <button
                onClick={() => navigate('/pricing')}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">

                Pricing
              </button>
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => navigate('/signin')}
                  className="w-full px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-xl">
                  Sign in
                </button>
                <button
                  onClick={() => navigate('/onboarding')}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors">
                  Get Started Free
                </button>
              </div>
            </> :

            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">

                Dashboard
              </button>
              <button
                onClick={() => navigate('/dashboard/progress')}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">

                Progress
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">

                Pricing
              </button>
              <button
                onClick={() => navigate('dashboard/account')}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">

                Account
              </button>
              <button
                onClick={() => navigate('/dashboard/settings')}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl">

                Settings
              </button>
            </>
          }
        </div>
      }
    </nav>);

}