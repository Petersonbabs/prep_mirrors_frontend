import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PLGOnboardingFlow } from '../../components/onboarding/PLGOnboardingFlow';

/**
 * Public diagnostic, taken before signup.
 *
 * This is a route rather than a modal on the homepage so the funnel is visible
 * in analytics without custom events, so it survives a refresh mid-interview,
 * and so it can be linked to directly from ads or shared.
 */
export default function PracticePage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <Helmet>
                <title>Free 1-Minute AI Interview | PrepMirrors</title>
                <meta
                    name="description"
                    content="Answer one real interview question out loud and get an honest readiness score, a breakdown of what to fix, and a daily practice plan built around your interview date."
                />
            </Helmet>

            <header className="w-full px-4 sm:px-6 lg:px-8 py-5">
                <Link
                    to="/"
                    className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                >
                    ← PrepMirrors
                </Link>
            </header>

            <main className="px-4 sm:px-6 lg:px-8 pb-16">
                <PLGOnboardingFlow />
            </main>
        </div>
    );
}
