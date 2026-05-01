// frontend/src/components/dashboard/DashboardWalkthrough.tsx
import React, { useState, useEffect } from 'react';
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
  targetSelector?: string;
  position: 'center' | 'top-center' | 'center-left' | 'bottom-right';
  mobilePosition?: 'center' | 'top' | 'bottom';
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 1,
    title: 'Welcome to your dashboard!',
    description: 'Let me show you around so you can make the most of your interview prep journey.',
    emoji: '👋',
    position: 'center',
    mobilePosition: 'center'
  },
  {
    id: 2,
    title: 'Quick Start',
    description: 'Start practicing instantly — jump into your first mock interview in seconds with one click.',
    emoji: '⚡',
    targetSelector: '.quick-start-btn',
    position: 'top-center',
    mobilePosition: 'top'
  },
  {
    id: 3,
    title: 'Interview Library',
    description: 'Browse interviews from top companies. Filter by difficulty to find your perfect match.',
    emoji: '🏢',
    targetSelector: '.interviews-section',
    position: 'center-left',
    mobilePosition: 'bottom'
  },
  {
    id: 4,
    title: 'Track Your Progress',
    description: 'Your streak, achievements, and recent activity live here. Consistency is key to success!',
    emoji: '🔥',
    targetSelector: '.progress-section',
    position: 'bottom-right',
    mobilePosition: 'bottom'
  }
];

export function DashboardWalkthrough({ firstName, onComplete }: DashboardWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const step = WALKTHROUGH_STEPS[currentStep];
  const isLastStep = currentStep === WALKTHROUGH_STEPS.length - 1;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Find target element when step changes
  useEffect(() => {
    if (step.targetSelector && !isMobile) {
      const element = document.querySelector(step.targetSelector) as HTMLElement;
      setTargetElement(element);
    } else {
      setTargetElement(null);
    }
  }, [currentStep, step.targetSelector, isMobile]);

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

  // Get position styles based on device
  const getPositionStyles = () => {
    // Mobile layout - always center or bottom
    if (isMobile) {
      const mobilePos = step.mobilePosition || 'center';
      switch (mobilePos) {
        case 'top':
          return { top: '20px', left: '50%', transform: 'translateX(-50%)' };
        case 'bottom':
          return { bottom: '20px', left: '50%', transform: 'translateX(-50%)' };
        default:
          return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      }
    }

    // Desktop layout - position near target elements
    if (targetElement && step.position !== 'center') {
      const rect = targetElement.getBoundingClientRect();
      const scrollY = window.scrollY;

      switch (step.position) {
        case 'top-center':
          return {
            top: rect.top + scrollY - 100,
            left: rect.left + rect.width / 2,
            transform: 'translateX(-50%)'
          };
        case 'center-left':
          return {
            top: rect.top + scrollY + rect.height / 2,
            left: rect.left - 20,
            transform: 'translate(-100%, -50%)'
          };
        case 'bottom-right':
          return {
            top: rect.bottom + scrollY + 20,
            left: rect.right - 20,
            transform: 'translateX(-100%)'
          };
        default:
          return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      }
    }

    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  };

  const positionStyles = getPositionStyles();

  return (
    <div className="fixed inset-0 z-[100] walkthrough-overlay">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Highlight effect for target element (desktop only) */}
      {targetElement && !isMobile && (
        <div
          className="absolute rounded-2xl ring-4 ring-primary-500 ring-offset-2 transition-all duration-300 pointer-events-none hidden md:block"
          style={{
            top: targetElement.getBoundingClientRect().top - 8,
            left: targetElement.getBoundingClientRect().left - 8,
            width: targetElement.offsetWidth + 16,
            height: targetElement.offsetHeight + 16,
          }}
        />
      )}

      {/* Tooltip Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed z-10 w-[calc(100%-2rem)] max-w-sm"
          style={positionStyles}
        >
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 sm:px-5 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{step.emoji}</span>
                  <span className="text-white/80 text-xs font-medium">
                    Step {currentStep + 1} of {WALKTHROUGH_STEPS.length}
                  </span>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  aria-label="Skip tour"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-5 py-3 sm:py-4">
              <h3 className="font-display font-bold text-base sm:text-lg text-neutral-900 dark:text-white mb-1 sm:mb-2">
                {currentStep === 0 ? step.title.replace('!', `, ${firstName}!`) : step.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-700">
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 mb-3 sm:mb-4">
                {WALKTHROUGH_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-full transition-all duration-300 ${index === currentStep
                      ? 'w-6 h-2 bg-primary-500'
                      : index < currentStep
                        ? 'w-2 h-2 bg-primary-300'
                        : 'w-2 h-2 bg-neutral-300 dark:bg-neutral-600'
                      }`}
                  />
                ))}
              </div>

              {/* Buttons - Stack on mobile, row on desktop */}
              <div className="flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-3">
                <button
                  onClick={handleSkip}
                  className="w-full sm:flex-1 px-4 py-2.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  Skip tour
                </button>
                <button
                  onClick={handleNext}
                  className="w-full sm:flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {isLastStep ? (
                    <>
                      <SparklesIcon className="w-4 h-4" />
                      <span>Get Started!</span>
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ChevronRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Instruction for mobile scrolling */}
      {isMobile && targetElement && (
        <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-xs">
          Tap the highlighted area to continue
        </div>
      )}
    </div>
  );
}