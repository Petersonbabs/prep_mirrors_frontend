# PrepMirrors Frontend 🚀

**PrepMirrors** is an AI-powered Mock Interview and Career Coaching Web Application. It enables job seekers to practice technical and behavioral interviews in real time with interactive AI voice agents, receive instant structured feedback, track performance over time, and consult an AI career coach.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite 5 (`@vitejs/plugin-react`)
- **Styling**: Tailwind CSS v3, PostCSS, Autoprefixer, Framer Motion, Lucide React
- **Voice AI Engine**: Vapi AI SDK (`@vapi-ai/web`)
- **Backend & Authentication**: Supabase (`@supabase/supabase-js`) + Custom REST API backend (`VITE_API_URL`)
- **Payment Processing**: LemonSqueezy (`@lemonsqueezy/lemonsqueezy.js`)
- **Analytics & SEO**: PostHog (`posthog-js`), React Helmet Async, `vite-plugin-sitemap`
- **Notifications**: Sonner, React Hot Toast, Web Push (VAPID)

---

## ⚡ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm package manager

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment template to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the required public keys and service URLs in `.env.local`:

```env
VITE_ENVIRONMENT="development"
VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
VITE_API_URL="http://localhost:4444"
VITE_VAPI_PUBLIC_KEY="your-vapi-public-key"
VITE_VAPI_ASSISTANT_ID="your-vapi-assistant-id"
VITE_VAPI_ONBOARDING_INTERVIEW_ASSISTANT_ID="your-vapi-onboarding-assistant-id"
VITE_VAPI_TECHNICAL_ASSISTANT_ID="your-vapi-technical-assistant-id"
VITE_VAPI_BEHAVIORAL_ASSISTANT_ID="your-vapi-behavioral-assistant-id"
VITE_LEMONSQUEEZY_STORE_ID="326213"
VITE_LEMONSQUEEZY_STORE_SUBDOMAIN="prepmirrors"
VITE_LEMONSQUEEZY_ENV="sandbox"
VITE_LEMONSQUEEZY_MONTHLY_VARIANT_ID="1485134"
VITE_LEMONSQUEEZY_ANNUAL_VARIANT_ID="1558829"
VITE_POSTHOG_API_KEY="your-posthog-api-key"
VITE_POSTHOG_HOST="https://app.posthog.com"
VITE_VAPID_PUBLIC_KEY="your-vapid-public-key"
```

> ⚠️ **Note**: Never expose private backend keys (such as `VAPID_PRIVATE_KEY` or `GOOGLE_CLIENT_SECRET`) in client-side `.env.local` files.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Available Scripts

- `npm run dev`: Launch Vite local development server
- `npm run build`: Build production assets with Vite
- `npm run preview`: Preview built production bundle locally
- `npm run lint`: Run ESLint checks across project files
- `npx tsc --noEmit`: Perform TypeScript type-checking without emitting files

---

## 📂 Architecture Overview

```text
src/
├── components/          # Reusable UI elements (Navbar, Sidebar, Dashboard cards, Paywall)
├── contexts/            # React context providers (LemonSqueezyContext)
├── data/                # Static pricing models, question banks, and configuration
├── lib/                 # Service integrations
│   ├── api/             # API client & backend endpoints (interview, progress, users, etc.)
│   ├── hooks/           # Custom React hooks (useAuth, useVapiAgent, useProgressData)
│   ├── store/           # Global state management (AuthContext / authStore)
│   └── types/           # TypeScript interface & type definitions
├── pages/               # Page components
│   ├── (dashboard)/     # Authenticated dashboard pages (Dashboard, Session, Feedback, Coach, Progress)
│   ├── (public)/        # Marketing and legal pages (Privacy, Terms, Support)
│   ├── admin/           # Administrative portal & analytics
│   └── onboarding/      # User onboarding flow & trial interview screens
└── services/            # Low-level service handlers (vapiService)
```
