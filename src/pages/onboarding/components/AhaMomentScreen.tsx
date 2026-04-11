import { CheckIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AhaMomentScreenProps {
  firstName: string;
  roleLabel: string;
  onContinue: () => void;
  generatingQuestions: boolean;
  questionsGenerated?: boolean;
}

function AhaMomentScreen({
  firstName,
  roleLabel,
  onContinue,
  generatingQuestions,
  questionsGenerated = false
}: AhaMomentScreenProps) {
  const [simulatedSteps, setSimulatedSteps] = useState<number[]>([0]);
  const [currentSimulatedIndex, setCurrentSimulatedIndex] = useState(0);

  const steps = [
    { icon: '🔍', label: 'Collating your profile data', duration: 700 },
    { icon: '🏢', label: 'Generating avatar companies', duration: 560 },
    { icon: '🤖', label: 'Preparing AI interviewers', duration: 720 },
    { icon: '📝', label: 'Generating your interview', duration: null },
    { icon: '✅', label: 'Everything is ready!', duration: null }
  ];

  useEffect(() => {
    if (currentSimulatedIndex < steps.length - 2) {
      const timer = setTimeout(() => {
        setCurrentSimulatedIndex(prev => prev + 1);
        setSimulatedSteps(prev => [...prev, prev.length]);
      }, steps[currentSimulatedIndex].duration as number);

      return () => clearTimeout(timer);
    }
  }, [currentSimulatedIndex, steps]);

  const getStepStatus = (index: number) => {
    if (index === steps.length - 1) {
      if (questionsGenerated && !generatingQuestions) {
        return 'done';
      }
      return 'pending';
    }

    if (index === steps.length - 2) {
      if (generatingQuestions) {
        return 'active';
      }
      if (questionsGenerated) {
        return 'done';
      }
      if (currentSimulatedIndex >= index) {
        return 'active';
      }
      return 'pending';
    }

    if (index <= currentSimulatedIndex) {
      return 'done';
    }
    if (index === currentSimulatedIndex + 1) {
      return 'active';
    }
    return 'pending';
  };

  const allDone = questionsGenerated && !generatingQuestions;
  console.log("generatingQuestions", generatingQuestions)

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
          const status = getStepStatus(i);
          const isActive = status === 'active';
          const isDone = status === 'done';
          return (
            <div
              key={i}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-500 ${isDone
                ? 'border-secondary-200 dark:border-secondary-800 bg-secondary-50 dark:bg-secondary-900/20'
                : isActive
                  ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 opacity-40'
                }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-300 ${isDone
                  ? 'bg-secondary-500'
                  : isActive
                    ? 'bg-primary-500'
                    : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
              >
                {isDone ? (
                  <CheckIcon className="w-5 h-5 text-white" />
                ) : isActive ? (
                  // Show spinner only on the "Generating your interview" step
                  i === steps.length - 2 && generatingQuestions ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <span>{s.icon}</span>
                  )
                ) : (
                  <span>{s.icon}</span>
                )}
              </div>

              <span
                className={`font-semibold text-sm flex-1 ${isDone
                  ? 'text-secondary-700 dark:text-secondary-300'
                  : isActive
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-neutral-500 dark:text-neutral-500'
                  }`}
              >
                {s.label}
              </span>

              {isActive && !allDone && (
                <div className="flex gap-1">
                  {[0, 1, 2].map((j) => (
                    <div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce"
                      style={{ animationDelay: `${j * 150}ms` }}
                    />
                  ))}
                </div>
              )}

              {isDone && (
                <span className="text-xs font-bold text-secondary-600 dark:text-secondary-400">
                  Done
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Ready button - only shows when questions are generated */}
      {allDone && (
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
            className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors text-base shadow-soft"
          >
            Start Practice Interview →
          </button>
        </div>
      )}
    </div>
  );
}

export default AhaMomentScreen;