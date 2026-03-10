import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";

function AhaMomentScreen({
    firstName,
    roleLabel,
    onContinue
}: { firstName: string; roleLabel: string; onContinue: () => void; }) {
    const [activeStep, setActiveStep] = useState(-1);
    const [done, setDone] = useState(false);
    const steps = [
        {
            icon: '🔍',
            label: 'Collating your profile data',
            duration: 900
        },
        {
            icon: '🏢',
            label: 'Generating avatar companies',
            duration: 1000
        },
        {
            icon: '🤖',
            label: 'Preparing AI interviewers',
            duration: 1100
        },
        {
            icon: '📝',
            label: 'Generating your interview',
            duration: 1000
        },
        {
            icon: '✅',
            label: 'Everything is ready!',
            duration: 600
    }];

    useEffect(() => {
        let total = 400;
        steps.forEach((s, i) => {
            setTimeout(() => setActiveStep(i), total);
            total += s.duration;
        });
        setTimeout(() => setDone(true), total + 200);
    }, []);

    return (
        <div className="max-w-lg mx-auto w-full pt-8 flex flex-col items-center">
            <div className="text-center mb-10">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-500 mb-3">
                    Building your plan
                </p>
                <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white leading-tight mb-3">
                    Personalizing everything
                    <br />
                    for you, {firstName}
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    We're setting up your {roleLabel} interview experience right now.
                </p>
            </div>

            {/* Timeline */}
            <div className="w-full space-y-3 mb-10">
                {steps.map((s, i) => {
                    const isActive = activeStep === i;
                    const isDone = activeStep > i;
                    return (
                        <div
                            key={i}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-500 ${isDone ? 'border-secondary-200 dark:border-secondary-800 bg-secondary-50 dark:bg-secondary-900/20' : isActive ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 opacity-40'}`}>

                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-300 ${isDone ? 'bg-secondary-500' : isActive ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'}`}>

                                {isDone ?
                                    <CheckIcon className="w-5 h-5 text-white" /> :

                                    <span>{s.icon}</span>
                                }
                            </div>
                            <span
                                className={`font-semibold text-sm flex-1 ${isDone ? 'text-secondary-700 dark:text-secondary-300' : isActive ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-500 dark:text-neutral-500'}`}>

                                {s.label}
                            </span>
                            {isActive &&
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((j) =>
                                        <div
                                            key={j}
                                            className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce"
                                            style={{
                                                animationDelay: `${j * 150}ms`
                                            }} />

                                    )}
                                </div>
                            }
                            {isDone &&
                                <span className="text-xs font-bold text-secondary-600 dark:text-secondary-400">
                                    Done
                                </span>
                            }
                        </div>);

                })}
            </div>

            {done &&
                <div className="w-full animate-slide-up">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-5 text-white text-center mb-4">
                        <p className="text-2xl mb-1">🎉</p>
                        <p className="font-display font-bold text-lg">
                            Your interview is ready!
                        </p>
                        <p className="text-white/80 text-sm mt-1">
                            Let's do a quick 3-question practice run so you can see exactly
                            how it works.
                        </p>
                    </div>
                    <button
                        onClick={onContinue}
                        className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors text-base shadow-soft">

                        Start Practice Interview →
                    </button>
                </div>
            }
        </div>);

}

export default AhaMomentScreen