

interface WaitlistRedirectProps {
  children: React.ReactNode;
}

const APP_READY = import.meta.env.VITE_APP_READY === 'true';

export function WaitlistRedirect({ children }: WaitlistRedirectProps) {
  const isWaitlistPage = window.location.pathname === 'https://waitlist.prepmirrors.com';
  const isProd = import.meta.env.VITE_ENVIRONMENT === "production"

  // If app is not ready and not already on waitlist page, redirect
  if (!APP_READY && !isWaitlistPage && isProd) {
    return window.location.href = "https://waitlist.prepmirrors.com"
  }

  return <>{children}</>;
}