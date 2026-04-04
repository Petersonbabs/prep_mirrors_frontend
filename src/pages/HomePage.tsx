import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowRightIcon,
  PlayIcon,
  StarIcon,
  CheckIcon,
  ZapIcon,
  MicIcon,
  BrainIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  UsersIcon,
  AwardIcon,
  TargetIcon,
  MessageSquareIcon,
  XIcon
} from
  'lucide-react';
import { subscription } from '../data/pricing';
import { UnderDevelopmentComponent } from '../utils/utils';
import Faqs from '../components/ui/Homepage/Faqs';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import QuickInterviewModal from '../components/quick-interview/QuickInterviewModal';
import { useNavigate } from 'react-router-dom';
interface HomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

// ─── Hero Carousel ─────────────────────────────────────────────────────────────

// ─── Problem vs Solution ───────────────────────────────────────────────────────
function ProblemSolutionSection({
  onGetStarted


}: { onGetStarted: () => void; }) {
  return (
    <section className="py-24 bg-white dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 mb-3">
            THE PROBLEM
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-neutral-900 dark:text-white mb-5 leading-tight">
            Unprepared for your interview?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Most candidates walk into interviews with{' '}
            <strong className="text-neutral-900 dark:text-white">
              zero structured practice
            </strong>
            .
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 mt-3 max-w-xl mx-auto">
            You're rehearsing answers in your head, guessing what they'll ask,
            and hoping nerves don't take over.
          </p>
          <p className="text-neutral-500 dark:text-neutral-500 mt-2 max-w-lg mx-auto text-sm">
            You might be feeling underprepared, anxious, uncertain, or like
            you're leaving it to chance.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-white">
                Without PrepMirrors
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex items-start gap-2.5">
                <XIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Freezing under pressure
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <XIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Rambling answers
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <XIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  No feedback on mistakes
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <XIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Guessing what they'll ask
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <XIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Practicing alone in a mirror
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <XIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Forgetting your stories
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <XIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Underselling yourself
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <XIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Leaving it to chance
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <XIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Generic prep advice
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <XIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Rejection without knowing why
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 border-2 border-primary-200 dark:border-primary-800 shadow-soft relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-500 rounded-t-3xl" />
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-secondary-500" />
              <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-white">
                With PrepMirrors
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex items-start gap-2.5">
                <CheckIcon className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Walk in calm & confident
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckIcon className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Structured, crisp answers
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckIcon className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Real-time AI feedback
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckIcon className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Know the exact questions
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckIcon className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Realistic voice practice
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckIcon className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Personal story bank built
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckIcon className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Articulate your true value
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckIcon className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Prepared, not hoping
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckIcon className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Role-specific prep plan
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckIcon className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Know exactly what to improve
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors shadow-soft text-base">

            <span>Start Preparing Now</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-3">
            Free to start · No credit card required
          </p>
        </div>
      </div>
    </section>);

}
// ─── Demo Modal ────────────────────────────────────────────────────────────────
function DemoModal({ onClose }: { onClose: () => void; }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}>

      <div
        className="w-full max-w-4xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex justify-end mb-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">

            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl"
          style={{
            paddingBottom: '56.25%'
          }}>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-neutral-900 to-secondary-900/30" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <img
                src="/[favicon]-Prep-mirror-white-bg.png"
                alt="PrepMirrors"
                className="w-14 h-14 rounded-2xl opacity-80" />

              <div className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors border-2 border-white/30">
                <PlayIcon className="w-7 h-7 text-white ml-1" />
              </div>
              <div className="text-center">
                <p className="text-white font-display font-bold text-lg">
                  Demo Coming Soon
                </p>
                <p className="text-white/60 text-sm mt-1">
                  See how PrepMirrors transforms your interview prep
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-2">
                <div className="h-full w-0 bg-primary-400 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs font-mono">0:00</span>
                <span className="text-white/40 text-xs font-mono">3:24</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-white/50 text-xs mt-3">
          Press Esc or click outside to close
        </p>
      </div>
    </div>);

}
// ─── Video Section ─────────────────────────────────────────────────────────────
function VideoSection({ onOpenDemo }: { onOpenDemo: () => void; }) {
  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-800/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-primary-100 dark:border-primary-800">
            <PlayIcon className="w-4 h-4" />
            <span>Watch the Demo</span>
          </div>
          <h2 className="font-display font-bold text-4xl text-neutral-900 dark:text-white mb-4">
            See PrepMirrors in Action
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Watch how candidates go from nervous to confident in one session
          </p>
        </div>
        <div
          className="relative w-full rounded-3xl overflow-hidden bg-neutral-900 shadow-glow cursor-pointer group"
          style={{
            paddingBottom: '56.25%'
          }}
          onClick={onOpenDemo}>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-neutral-900 to-secondary-900/30" />
            <div className="relative z-10 flex flex-col items-center gap-5">
              <img
                src="/[favicon]-Prep-mirror-white-bg.png"
                alt="PrepMirrors"
                className="w-14 h-14 rounded-2xl opacity-90" />

              <div className="w-20 h-20 rounded-full bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-all duration-300 border-2 border-white/30 group-hover:scale-110 group-hover:border-white/50">
                <PlayIcon className="w-9 h-9 text-white ml-1.5" />
              </div>
              <div className="text-center">
                <p className="text-white font-display font-bold text-lg">
                  Watch the Demo
                </p>
                <p className="text-white/60 text-sm mt-1">
                  See a full mock interview session
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-2">
                <div className="h-full w-1/3 bg-primary-400 rounded-full" />
              </div>
              <div className="flex justify-between">
                <span className="text-white/40 text-xs font-mono">1:08</span>
                <span className="text-white/40 text-xs font-mono">3:24</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <div className="w-2 h-2 rounded-full bg-secondary-500" />
            <span className="text-sm font-medium">3 min demo</span>
          </div>
          <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-600" />
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <div className="w-2 h-2 rounded-full bg-primary-500" />
            <span className="text-sm font-medium">No signup required</span>
          </div>
          <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-600" />
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <div className="w-2 h-2 rounded-full bg-accent-500" />
            <span className="text-sm font-medium">Real interview session</span>
          </div>
        </div>
      </div>
    </section>);

}
// ─── HomePage ──────────────────────────────────────────────────────────────────
export function HomePage({ onGetStarted }: HomePageProps) {
  const [statsVisible, setStatsVisible] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showQuickInterview, setShowQuickInterview] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);
  const [prefillData, setPrefillData] = useState<{ name: string; jobTarget: string } | null>(null);
  const navigate = useNavigate()

  const handleQuickInterviewContinue = (data: { name: string; jobTarget: string; tempUserId: string }) => {
    setPrefillData({ name: data.name, jobTarget: data.jobTarget });
    setShowQuickInterview(false);
    // Navigate to auth with prefill data
    navigate('/auth', { state: { prefill: data } });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      {
        threshold: 0.3
      }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="w-full bg-white dark:bg-neutral-900">
      <Helmet>
        <title>PrepMirrors – AI Mock Interview Practices</title>
        <meta
          name="description"
          content="PrepMirrors uses AI to help job seekers and fresh graduate to prepare for interview with real AI Mock inteview practices, instant feedback and progress tracking."
        />
      </Helmet>
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}

      {/* Hero */}
      <Hero setShowQuickInterview={setShowQuickInterview} />

      {/* Stats */}
      <UnderDevelopmentComponent>
        <section
          ref={statsRef}
          className="py-16 bg-neutral-50 dark:bg-neutral-800/50">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  value: '10K+',
                  label: 'Active Users',
                  icon: UsersIcon,
                  color: 'text-primary-500'
                },
                {
                  value: '95%',
                  label: 'Success Rate',
                  icon: TrendingUpIcon,
                  color: 'text-secondary-500'
                },
                {
                  value: '500+',
                  label: 'Interview Questions',
                  icon: MessageSquareIcon,
                  color: 'text-accent-500'
                },
                {
                  value: '50+',
                  label: 'Top Companies',
                  icon: AwardIcon,
                  color: 'text-purple-500'
                }].
                map((stat, i) =>
                  <div
                    key={i}
                    className={`text-center transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{
                      transitionDelay: `${i * 100}ms`
                    }}>

                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-neutral-800 shadow-card mb-3 ${stat.color}`}>

                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="font-display font-bold text-3xl text-neutral-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      {stat.label}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </section>
      </UnderDevelopmentComponent>

      {/* Problem vs Solution */}
      <ProblemSolutionSection onGetStarted={onGetStarted} />

      {/* Video Section */}
      <UnderDevelopmentComponent>
        <VideoSection onOpenDemo={() => setShowDemo(true)} />
      </UnderDevelopmentComponent>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <ZapIcon className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="font-display font-bold text-4xl text-neutral-900 dark:text-white mb-4">
              How PrepMirrors Works
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              From onboarding to landing your dream job — we guide you every
              step of the way.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 dark:from-primary-800 dark:via-primary-600 dark:to-primary-800" />
            {[
              {
                step: '1',
                iconSrc: 'https://cdn.lordicon.com/bgebyztv.json',
                title: 'Create Profile',
                desc: 'Tell us your name, target role, experience level, and career goals in minutes.'
              },
              {
                step: '2',
                iconSrc: 'https://cdn.lordicon.com/hpivxauj.json',
                title: 'Get Matched',
                desc: 'AI generates personalized interviews from real companies matching your profile.'
              },
              {
                step: '3',
                iconSrc: 'https://cdn.lordicon.com/jxhgzthv.json',
                title: 'Practice Live',
                desc: 'Answer voice questions in real-time with our AI interviewer characters.'
              },
              {
                step: '4',
                iconSrc: 'https://cdn.lordicon.com/qhgmphtg.json',
                title: 'Improve Fast',
                desc: 'Get instant feedback and work with your AI coach to level up your answers.'
              }].
              map((item, i) =>
                <div key={i} className="relative text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-100 dark:border-primary-800 mb-4 z-10">
                    <lord-icon
                      src={item.iconSrc}
                      trigger="hover"
                      colors="primary:#6366f1,secondary:#a5b4fc"
                      style={
                        {
                          width: '40px',
                          height: '40px'
                        } as React.CSSProperties
                      } />

                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center font-display">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-24 bg-neutral-50 dark:bg-neutral-800/30">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-neutral-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              A complete interview preparation platform designed to build your
              confidence and skills.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MicIcon,
                color:
                  'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
                title: 'Voice-Powered Interviews',
                desc: 'Practice speaking your answers out loud with AI voice recognition, just like a real interview.'
              },
              {
                icon: BrainIcon,
                color:
                  'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400',
                title: 'AI Coach Chatbot',
                desc: 'Get personalized coaching on any answer. Your AI coach explains concepts and helps you improve.'
              },
              {
                icon: TargetIcon,
                color:
                  'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
                title: 'Role-Specific Prep',
                desc: 'Interviews tailored to your exact role — from software engineering to product management.'
              },
              {
                icon: TrendingUpIcon,
                color:
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                title: 'Progress Tracking',
                desc: 'Track your improvement over time with detailed analytics and performance insights.'
              },
              {
                icon: ShieldCheckIcon,
                color:
                  'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
                title: 'Real Company Scenarios',
                desc: 'Practice with interview scenarios from Google, Meta, Amazon, and 50+ top companies.'
              },
              {
                icon: AwardIcon,
                color:
                  'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
                title: 'Practice Streaks',
                desc: 'Stay motivated with daily practice streaks, badges, and achievement milestones.'
              }].
              map((feature, i) =>
                <div
                  key={i}
                  className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 card-lift">

                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${feature.color} mb-4`}>

                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <UnderDevelopmentComponent>
        <section className="py-24 bg-white dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl text-neutral-900 dark:text-white mb-4">
                Success Stories
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Real people, real results.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) =>
                    <StarIcon
                      key={i}
                      className="w-4 h-4 text-accent-500 fill-accent-500" />

                  )}
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed mb-4">
                  "PrepMirrors helped me land my dream job at Google! The AI
                  feedback was incredibly detailed and the practice sessions felt
                  just like the real thing. I went from nervous to confident in 3
                  weeks."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-neutral-900 dark:text-white">
                      Sarah Chen
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Software Engineer @ Google
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-primary-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) =>
                    <StarIcon key={i} className="w-4 h-4 text-white fill-white" />
                  )}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  "As a fresh graduate with no interview experience, PrepMirrors
                  was a game changer. The onboarding was so smooth, and the AI
                  coach explained everything clearly. Got 3 offers in my first
                  month!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                    M
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">
                      Marcus Johnson
                    </p>
                    <p className="text-xs text-white/70">
                      Product Manager @ Stripe
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) =>
                    <StarIcon
                      key={i}
                      className="w-4 h-4 text-accent-500 fill-accent-500" />

                  )}
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed mb-4">
                  "The behavioral interview practice was exactly what I needed.
                  The different interviewer characters made it feel authentic. My
                  confidence skyrocketed and I aced every interview I had."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-neutral-900 dark:text-white">
                      Aisha Patel
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Data Scientist @ Meta
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </UnderDevelopmentComponent>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-24 bg-neutral-50 dark:bg-neutral-800/30">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-neutral-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Start free, upgrade when you're ready.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-white mb-1">
                Free
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-display font-bold text-4xl text-neutral-900 dark:text-white">
                  $0
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                  /month
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                Perfect for getting started
              </p>
              <ul className="space-y-3 mb-6">
                {subscription.free.features.
                  map((f) =>
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">

                      <CheckIcon className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                      {f}
                    </li>
                  )}
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">

                Get Started Free
              </button>
            </div>
            <div className="bg-primary-500 rounded-2xl p-6 relative shadow-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-1">
                Pro
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-display font-bold text-4xl text-white">
                  ${subscription.pro.price.monthly}
                </span>
                <span className="text-white/70 text-sm">/month</span>
              </div>
              <p className="text-sm text-white/80 mb-6">
                For serious job seekers
              </p>
              <ul className="space-y-3 mb-6">
                {subscription.pro.features.
                  map((f) =>
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-white">

                      <CheckIcon className="w-4 h-4 text-white/80 flex-shrink-0" />
                      {f}
                    </li>
                  )}
              </ul>
              <button onClick={onGetStarted} className="w-full py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors">
                Start {subscription.pro.trialDays}-Day Free Trial
              </button>
            </div>

          </div>
        </div>
      </section>

      <Faqs />

      {/* Final CTA */}
      <section className="py-24 bg-primary-600 dark:bg-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-700/30 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join other job seekers who've transformed their interview skills
            with PrepMirrors. Your dream job is one practice session away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-2xl hover:bg-primary-50 transition-colors text-lg">

              <span>Start Free Today</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-colors text-lg">

              <PlayIcon className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
          <p className="text-white/60 text-sm mt-6">
            No credit card required · Free forever plan available
          </p>
        </div>
      </section>

      <QuickInterviewModal
        isOpen={showQuickInterview}
        onClose={() =>
          setShowQuickInterview(false)}
        onContinue={handleQuickInterviewContinue}
      />

      {/* Footer */}
      {/* <Footer /> */}
    </div>);

}