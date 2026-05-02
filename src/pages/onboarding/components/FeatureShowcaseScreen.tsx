import { CheckIcon } from "lucide-react";
import { captureEvent } from "../../../lib/posthog";

interface Feature {
    emoji: string;
    color: string;
    bgColor: string;
    title: string;
    promise: string;
    description: string;
    bullets: string[];
}


const FEATURES: Feature[] = [
    {
        emoji: '🎤',
        color: 'text-primary-600 dark:text-primary-400',
        bgColor: 'bg-primary-50 dark:bg-primary-900/30',
        title: 'Real Voice Interviews',
        promise: "Practice like it's the real thing.",
        description:
            'Our AI interviewer speaks to you, listens to your answers, and responds — just like a real interview. No typing. No scripts. Just you, talking.',
        bullets: [
            'Realistic back-and-forth conversation',
            'AI adapts to your answers',
            'Builds muscle memory for real interviews']

    },
    {
        emoji: '🧠',
        color: 'text-secondary-600 dark:text-secondary-400',
        bgColor: 'bg-secondary-50 dark:bg-secondary-900/30',
        title: 'Instant AI Feedback',
        promise: 'Know exactly what to fix — every time.',
        description:
            "After every answer, you get a breakdown of what worked, what didn't, and exactly how to improve. No vague advice. Specific, actionable coaching.",
        bullets: [
            'Scored on 5 key dimensions',
            'Specific improvement suggestions',
            'Tracks your progress over time']

    },
    {
        emoji: '🤖',
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/30',
        title: 'Your Personal AI Coach',
        promise: 'A mentor available 24/7, just for you.',
        description:
            'Ask your AI coach anything — how to answer a specific question, how to handle a tricky interviewer, how to negotiate salary. It knows your profile and tailors every answer.',
        bullets: [
            'Knows your role, level, and goals',
            'Explains the "why" behind every answer',
            'Available any time, any question']

    },
    {
        emoji: '🏢',
        color: 'text-accent-600 dark:text-accent-400',
        bgColor: 'bg-accent-50 dark:bg-accent-900/30',
        title: 'Company-Specific Prep',
        promise: "Walk in knowing exactly what they'll ask.",
        description:
            "We've mapped the interview patterns of 50+ top companies. Google asks differently than Stripe. Meta asks differently than Amazon. We prepare you for the specific company you're targeting.",
        bullets: [
            '50+ company interview patterns',
            'Role-specific question banks',
            'Culture and values coaching']

    },
    {
        emoji: '📈',
        color: 'text-teal-600 dark:text-teal-400',
        bgColor: 'bg-teal-50 dark:bg-teal-900/30',
        title: 'Progress You Can See',
        promise: 'Watch yourself get better, session by session.',
        description:
            "Your dashboard tracks every session, every score, every improvement. You'll see your confidence score rise, your structure improve, and your readiness grow — in real numbers.",
        bullets: [
            'Session-by-session score tracking',
            'Streak system keeps you consistent',
            'Readiness score for your target role']

    }];

function FeatureShowcaseScreen({
    featureIndex,
    onContinue,
    isLast
}: { featureIndex: number; onContinue: () => void; isLast: boolean; }) {
    const feature = FEATURES[featureIndex];
    return (
        <div className="max-w-lg mx-auto w-full pt-4 flex flex-col animate-slide-up">
            {/* Feature dots */}
            <div className="flex justify-center gap-2 mb-8">
                {FEATURES.map((_, i) =>
                    <div
                        key={i}
                        className={`rounded-full transition-all duration-300 ${i === featureIndex ? 'w-6 h-2 bg-primary-500' : i < featureIndex ? 'w-2 h-2 bg-primary-300' : 'w-2 h-2 bg-neutral-300 dark:bg-neutral-600'}`} />

                )}
            </div>

            {/* Illustration area */}
            <div
                className={`${feature.bgColor} rounded-3xl p-10 flex items-center justify-center mb-6`}
                style={{
                    minHeight: '180px'
                }}>

                <span className="text-8xl">{feature.emoji}</span>
            </div>

            {/* Content */}
            <p
                className={`text-xs font-bold uppercase tracking-[0.15em] ${feature.color} mb-2`}>

                Feature {featureIndex + 1} of {FEATURES.length}
            </p>
            <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-2 leading-tight">
                {feature.title}
            </h2>
            <p className={`font-display font-semibold text-lg ${feature.color} mb-3`}>
                "{feature.promise}"
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-4">
                {feature.description}
            </p>

            <div className="space-y-2 mb-8">
                {feature.bullets.map((bullet) =>
                    <div key={bullet} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                            <CheckIcon className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {bullet}
                        </span>
                    </div>
                )}
            </div>

            <button
                onClick={()=>{
                    onContinue()
                    captureEvent(`onboarding_feature_${featureIndex + 1}_seen`, {
                        step: featureIndex + 14
                    }) 
                }}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors text-base shadow-soft">

                {isLast ? 'Make my commitment →' : 'Next feature →'}
            </button>
        </div>);

}

export default FeatureShowcaseScreen;