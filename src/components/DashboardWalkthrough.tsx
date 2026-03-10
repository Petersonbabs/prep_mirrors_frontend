import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ChevronRightIcon, SparklesIcon } from 'lucide-react';
interface DashboardWalkthroughProps {
  firstName: string;
  onComplete: () => void;
}
interface WalkthroughStep {
  id: number;
  title: string;
  description: string;
  emoji?: string;
  position: 'center' | 'top-center' | 'center-left' | 'bottom-right';
}
const WALKTHROUGH_STEPS: WalkthroughStep[] = [
{
  id: 1,
  title: 'Welcome to your dashboard!',
  description:
  'Let me show you around so you can make the most of your interview prep journey.',
  emoji: '👋',
  position: 'center'
},
{
  id: 2,
  title: 'Quick Start',
  description:
  'Start practicing instantly — jump into your first mock interview in seconds with one click.',
  emoji: '⚡',
  position: 'top-center'
},
{
  id: 3,
  title: 'Interview Library',
  description:
  'Browse interviews from top companies like Google, Stripe, and Meta. Filter by difficulty to find your perfect match.',
  emoji: '🏢',
  position: 'center-left'
},
{
  id: 4,
  title: 'Track Your Progress',
  description:
  'Your streak, achievements, and recent activity live here. Consistency is the key to interview success!',
  emoji: '🔥',
  position: 'bottom-right'
}];

export function DashboardWalkthrough({
  firstName,
  onComplete
}: DashboardWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = WALKTHROUGH_STEPS[currentStep];
  const isLastStep = currentStep === WALKTHROUGH_STEPS.length - 1;
  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const handleSkip = () => {
    onComplete();
  };
  const getPositionClasses = (position: WalkthroughStep['position']) => {
    switch (position) {
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'top-center':
        return 'top-32 left-1/2 -translate-x-1/2 md:top-36';
      case 'center-left':
        return 'top-1/2 left-4 -translate-y-1/2 md:left-8 lg:left-1/4 lg:-translate-x-1/2';
      case 'bottom-right':
        return 'bottom-8 right-4 md:right-8 lg:right-1/4 lg:translate-x-1/2 lg:bottom-1/4';
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };
  return (
    <div className="fixed inset-0 z-[100] walkthrough-overlay">
      {/* Backdrop */}
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleSkip} />


      {/* Tooltip Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 10
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: -10
          }}
          transition={{
            duration: 0.3,
            ease: 'easeOut'
          }}
          className={`absolute ${getPositionClasses(step.position)} w-[calc(100%-2rem)] max-w-sm`}>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{step.emoji}</span>
                  <span className="text-white/80 text-xs font-medium">
                    Step {currentStep + 1} of {WALKTHROUGH_STEPS.length}
                  </span>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  aria-label="Skip tour">

                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-4">
              <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-2">
                {currentStep === 0 ?
                `${step.title.replace('!', `, ${firstName}!`)}` :
                step.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-700">
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 mb-4">
                {WALKTHROUGH_STEPS.map((_, index) =>
                <div
                  key={index}
                  className={`rounded-full transition-all duration-300 ${index === currentStep ? 'w-6 h-2 bg-primary-500' : index < currentStep ? 'w-2 h-2 bg-primary-300' : 'w-2 h-2 bg-neutral-300 dark:bg-neutral-600'}`} />

                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSkip}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700">

                  Skip tour
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-colors">

                  {isLastStep ?
                  <>
                      <SparklesIcon className="w-4 h-4" />
                      <span>Get Started!</span>
                    </> :

                  <>
                      <span>Next</span>
                      <ChevronRightIcon className="w-4 h-4" />
                    </>
                  }
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>);

}