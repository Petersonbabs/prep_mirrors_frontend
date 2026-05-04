

interface WaitlistRedirectProps {
  children: React.ReactNode;
}

const APP_READY = import.meta.env.VITE_APP_READY === 'true';

export function WaitlistRedirect({ children }: WaitlistRedirectProps) {
  const isWaitlistPage = window.location.pathname === 'https://waitlist.prepmirrors.com';
  const isProd = import.meta.env.VITE_ENVIRONMENT === "production"
  const isAdmin = localStorage.getItem("testKey") ?? null

  // If app is not ready and not already on waitlist page, redirect
  if (!APP_READY && !isWaitlistPage && isProd && isAdmin === '1234$#@!') {
    window.location.href = "https://waitlist.prepmirrors.com"
    return null 
  }

  return <>{children}</>;
}