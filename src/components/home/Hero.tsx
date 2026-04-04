import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { UnderDevelopmentComponent } from '../../utils/utils'
import { ArrowRightIcon, CheckIcon, PlayIcon, SparklesIcon, StarIcon, Video } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeroProps {
    setShowQuickInterview: Dispatch<SetStateAction<boolean>>
}

const Hero = ({ setShowQuickInterview }: HeroProps) => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-0 w-96 h-96 bg-[#ffffff06] dark:bg-primary-900/20 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-20 left-0 w-80 h-80 bg-secondary-100 dark:bg-secondary-900/20 rounded-full blur-3xl opacity-40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl opacity-30" />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* LEFT: Headline + CTA */}
                    <div className="order-1 animate-slide-up">
                        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary-100 dark:border-primary-800">
                            <SparklesIcon className="w-4 h-4" />
                            <span>AI-Powered Interview Practice</span>
                        </div>
                        <h1 className="font-display font-bold text-5xl sm:text-6xl text-neutral-900 dark:text-white leading-tight mb-6">
                            Ace Your Next <span className="gradient-text">Interview</span>{' '}
                            with Confidence
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8 max-w-lg">
                            Practice with AI-powered mock interviews tailored to your target
                            role. Get real-time feedback, improve with your personal AI
                            coach, and land the job you deserve.
                        </p>
                        <UnderDevelopmentComponent>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="flex -space-x-2">
                                    {['#6366F1', '#10B981', '#F59E0B', '#EF4444'].map(
                                        (color, i) =>
                                            <div
                                                key={i}
                                                className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center text-white text-xs font-bold"
                                                style={{
                                                    backgroundColor: color
                                                }}>

                                                {['A', 'B', 'C', 'D'][i]}
                                            </div>

                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((i) =>
                                            <StarIcon
                                                key={i}
                                                className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />

                                        )}
                                    </div>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Loved by 10,000+ job seekers
                                    </p>
                                </div>
                            </div>
                        </UnderDevelopmentComponent>
                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <Link
                                to="/auth"
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-2xl transition-all duration-200 shadow-soft hover:shadow-glow text-base">
                                <span>Start Free Practice</span>
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => setShowQuickInterview(true)}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 text-base">

                                <Video className="w-4 h-4 text-primary-500" />
                                <span>Try 1-Minute Interview</span>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                            <div className="flex items-center gap-1.5">
                                <CheckIcon className="w-4 h-4 text-secondary-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckIcon className="w-4 h-4 text-secondary-500" />
                                <span>Free forever plan available</span>
                            </div>
                            <UnderDevelopmentComponent>
                                <div className="flex items-center gap-1.5">
                                    <CheckIcon className="w-4 h-4 text-secondary-500" />
                                    <span>500+ interview questions</span>
                                </div>
                            </UnderDevelopmentComponent>
                        </div>
                    </div>
                    {/* RIGHT: Carousel */}
                    <div
                        className="order-2 animate-slide-up"
                        style={{
                            animationDelay: '0.2s'
                        }}>

                        <HeroCarousel />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero

function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slides = [
    {
      step: '01',
      label: 'Tell Us About You',
      iconSrc: 'https://cdn.lordicon.com/kdduutaw.json',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
      description:
        'Share your name, target role, experience level, and career goals.',
      mockScreen:
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 shadow-card border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <lord-icon
                src="https://cdn.lordicon.com/kdduutaw.json"
                trigger="loop"
                colors="primary:#6366f1,secondary:#a5b4fc"
                style={
                  {
                    width: '16px',
                    height: '16px'
                  } as React.CSSProperties
                } />

            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white font-display">
                Hi! I'm your AI guide
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Let's personalize your journey
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                What's your name?
              </p>
              <div className="h-9 bg-primary-50 dark:bg-primary-900/20 rounded-xl border-2 border-primary-300 dark:border-primary-700 flex items-center px-3">
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  Alex Johnson
                </span>
                <span className="ml-0.5 w-0.5 h-4 bg-primary-500 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                Target role?
              </p>
              <div className="h-9 bg-neutral-50 dark:bg-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-600 flex items-center px-3">
                <span className="text-sm text-neutral-400 dark:text-neutral-500">
                  e.g. Software Engineer
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <div className="flex-1 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  Continue →
                </span>
              </div>
            </div>
          </div>
        </div>

    },
    {
      step: '02',
      label: 'Take AI Interview',
      iconSrc: 'https://cdn.lordicon.com/cfoaotmk.json',
      bgColor: 'bg-secondary-100 dark:bg-secondary-900/20',
      description:
        'Practice with realistic AI-powered voice interviews from top companies.',
      mockScreen:
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 shadow-card border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white font-display">
                Google · SWE II
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Technical Round · Q2 of 5
              </p>
            </div>
            <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                Live
              </span>
            </div>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-3 mb-3">
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              "Can you explain the difference between a stack and a queue, and
              give a real-world use case for each?"
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 items-end">
              {[12, 20, 28, 20, 12].map((h, i) =>
                <div
                  key={i}
                  className="voice-bar"
                  style={{
                    height: `${h}px`
                  }} />

              )}
            </div>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
              Listening...
            </span>
          </div>
        </div>

    },
    {
      step: '03',
      label: 'Get Feedback',
      iconSrc: 'https://cdn.lordicon.com/cvwrvyjv.json',
      bgColor: 'bg-accent-100 dark:bg-accent-900/20',
      description:
        'Receive detailed AI feedback and improve with your personal coach.',
      mockScreen:
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 shadow-card border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
              <lord-icon
                src="https://cdn.lordicon.com/cvwrvyjv.json"
                trigger="loop"
                colors="primary:#10b981,secondary:#6ee7b7"
                style={
                  {
                    width: '16px',
                    height: '16px'
                  } as React.CSSProperties
                } />

            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white font-display">
                Great answer!
              </p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) =>
                  <StarIcon
                    key={i}
                    className={`w-3 h-3 ${i <= 4 ? 'text-accent-500 fill-accent-500' : 'text-neutral-300'}`} />

                )}
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex items-start gap-2">
              <CheckIcon className="w-3.5 h-3.5 text-secondary-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Clear explanation with good structure
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckIcon className="w-3.5 h-3.5 text-secondary-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Relevant real-world examples used
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-accent-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Could mention time complexity
              </p>
            </div>
          </div>
          <button className="w-full h-8 bg-primary-500 rounded-xl text-xs font-semibold text-white">
            Improve with AI Coach →
          </button>
        </div>

    }];

  const startInterval = () => {
    intervalRef.current = setInterval(
      () => setActiveSlide((prev) => (prev + 1) % slides.length),
      5300
    );
  };
  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    startInterval();
    setTimeout(() => setIsAnimating(false), 400);
  };
  const current = slides[activeSlide];
  return (
    <div className="relative">
      <div className="flex gap-2 mb-6">
        {slides.map((slide, i) =>
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${i === activeSlide ? 'bg-primary-500 text-white shadow-soft' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}>

            <span>{slide.step}</span>
            <span className="hidden sm:block">{slide.label}</span>
          </button>
        )}
      </div>
      <div
        key={activeSlide}
        className={`animate-slide-up ${current.bgColor} rounded-3xl p-6 border border-neutral-100 dark:border-neutral-700`}>

        <div className="flex items-center gap-3 mb-4">
          <lord-icon
            src={current.iconSrc}
            trigger="hover"
            colors="primary:#6366f1,secondary:#a5b4fc"
            style={
              {
                width: '24px',
                height: '24px',
                flexShrink: 0,
                fontWeight: "bold"
              } as React.CSSProperties
            } />

          <div>
            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              Step {current.step}
            </p>
            <h3 className="font-display font-bold text-neutral-900  text-lg">
              {current.label}
            </h3>
          </div>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5 leading-relaxed">
          {current.description}
        </p>
        {current.mockScreen}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) =>
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`transition-all duration-300 rounded-full ${i === activeSlide ? 'w-6 h-2 bg-primary-500' : 'w-2 h-2 bg-neutral-300 dark:bg-neutral-600'}`} />

        )}
      </div>
    </div>);

}