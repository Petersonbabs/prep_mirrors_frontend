import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckIcon,
} from
  'lucide-react';
// import { UserProfile } from '../../lib/store/authStore';
import { supabase } from '../../lib/supabase';
import ProgressBar from './components/ProgressBar';
import OptionCard from './components/OptionCard';
import EducationFactScreen from './components/EducationFactScreen';
import AhaMomentScreen from './components/AhaMomentScreen';
import MockInterviewScreen from './components/MockInterviewScreen';
import FeatureShowcaseScreen from './components/FeatureShowcaseScreen';
import CommitButton from './components/CommitmentButton';
import PaywallScreen from './components/PaymentWallScreen';
import { CHALLENGE_FACTS, CHALLENGES, LEVEL_FACTS, LEVELS, ROLE_FACTS, ROLES, TIMELINE_FACTS, TIMELINES } from '../data/data';

import { useAuth } from '../../lib/hooks/useAuth';
import { generateQuestionsParams, onboardingApi } from '../../lib/api/onboarding';
import toast from 'react-hot-toast';
import OnboardingFeedbackScreen from './components/FeedbackScreen';
import { UserProfile } from '../../lib/types';

interface OnboardingPageProps {
  onComplete: () => void;
  onBack: () => void;
}

const OnboardingSkeleton = () => (
  <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col animate-fade-in">
    <div className="max-w-xl mx-auto w-full px-6 py-12 space-y-8">
      {/* Progress Bar Skeleton */}
      <div className="h-2 w-full skeleton rounded-full mb-12" />

      {/* Header Skeleton */}
      <div className="space-y-4 text-center">
        <div className="h-8 w-64 skeleton mx-auto" />
        <div className="h-4 w-48 skeleton mx-auto" />
      </div>

      {/* Options Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 w-full skeleton border border-neutral-100 dark:border-neutral-800" />
        ))}
      </div>

      {/* Button Skeleton */}
      <div className="h-14 w-full skeleton rounded-2xl mt-8" />
    </div>
  </div>
);

export function OnboardingPage({ onComplete, onBack }: OnboardingPageProps) {
  const { user, profile: userProfile, refreshProfile, isLoading } = useAuth();
  const location = useLocation();
  const prefilledName = localStorage.getItem("prefillName")
  const prefilledJob = localStorage.getItem("prefillJobTarget")

  const [step, setStep] = useState(location.state?.step || 0);

  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: userProfile?.name || localStorage.getItem("prefillName") || '',
    targetRole: userProfile?.targetRole || localStorage.getItem("prefillJobTarget") || '',
    level: userProfile?.level || '',
    goal: userProfile?.goal || '',
    hiring_timeline: userProfile?.hiring_timeline || '',
    pre_first_interview_confidence: userProfile?.pre_first_interview_confidence || null,
    post_first_interview_confidence: userProfile?.post_first_interview_confidence || null,
    onboarding_completed: userProfile?.onboarding_completed || false,
    last_onboarding_step: userProfile?.last_onboarding_step || 0,
    avatar_url: userProfile?.avatar_url

  });
  const [nameInput, setNameInput] = useState(userProfile?.name || '');
  const [selectedRole, setSelectedRole] = useState<string | null>(userProfile?.targetRole || null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(userProfile?.level || null);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(userProfile?.goal || null);
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(userProfile?.hiring_timeline || null);
  const [preConfidenceScore, setPreConfidenceScore] = useState<number | null>(
    userProfile?.pre_first_interview_confidence || null
  );
  const [postConfidenceScore, setPostConfidenceScore] = useState<number | null>(
    userProfile?.post_first_interview_confidence || null
  );

  const [generatingQuestions, setGeneratingQuestions] = useState(false)
  const [questionsGenerated, setQuestionsGenerated] = useState(false);

  useEffect(() => {
    if (userProfile && step === 0 && !location.state?.step) {
      if (userProfile.last_onboarding_step) {
        setStep(userProfile.last_onboarding_step);
      }
    }
  }, [userProfile, location.state]);

  useEffect(() => {
    if (userProfile) {
      if (!nameInput && userProfile.name) setNameInput(userProfile.name);
      if (!selectedRole && userProfile.targetRole) setSelectedRole(userProfile.targetRole);
      if (!selectedLevel && userProfile.level) setSelectedLevel(userProfile.level);
      if (!selectedChallenge && userProfile.goal) setSelectedChallenge(userProfile.goal);
      if (!selectedTimeline && userProfile.hiring_timeline) setSelectedTimeline(userProfile.hiring_timeline);
      if (preConfidenceScore === null && userProfile.pre_first_interview_confidence) setPreConfidenceScore(userProfile.pre_first_interview_confidence);
      if (postConfidenceScore === null && userProfile.post_first_interview_confidence) setPostConfidenceScore(userProfile.post_first_interview_confidence);
    }
  }, [userProfile]);

  useEffect(() => {
    const updateStep = async () => {
      try {
        if (user) {
          await supabase
            .from('profiles')
            .update({ last_onboarding_step: step })
            .eq('id', user.id);
        }
      } catch (err) {
        console.error('Error updating onboarding step:', err);
      }
    };
    if (step > 0) updateStep();
  }, [step]);


  if (isLoading) {
    return <OnboardingSkeleton />;
  }


  const questionSteps = [1, 2, 4, 6, 8, 10];
  const progressStep = questionSteps.filter((s: number) => s <= step).length;
  const totalProgressSteps = 6;
  const navigate = (dir: 'forward' | 'back') => {
    const currentProfile: UserProfile = {
      name: nameInput || prefilledName || "",
      targetRole: selectedRole || prefilledJob || '',
      level: selectedLevel || '',
      goal: selectedChallenge || '',
      hiring_timeline: selectedTimeline || "",
      pre_first_interview_confidence: preConfidenceScore as number,
      post_first_interview_confidence: postConfidenceScore as number,
      onboarding_completed: false,
      last_onboarding_step: step,
      subscription_tier: 'free',
      avatar_url: userProfile?.avatar_url as string
    };

    syncProfileToSupabase(currentProfile)
    if (dir === 'forward') setStep((s: number) => s + 1); else
      setStep((s: number) => Math.max(0, s - 1));

  };

  const handleNext = () => navigate('forward');
  const handleBack = () => {
    if (step === 0) onBack(); else
      navigate('back');
  };

  const syncProfileToSupabase = async (profileData: UserProfile) => {
    try {
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: profileData.name,
            target_role: profileData.targetRole,
            experience_level: profileData.level,
            biggest_challenge: profileData.goal,
            onboarding_completed: profileData.onboarding_completed,
            updated_at: new Date().toISOString(),
            goal: profileData.goal,
            pre_first_interview_confidence: preConfidenceScore,
            post_first_interview_confidence: postConfidenceScore,
            last_onboarding_step: step,
            hiring_timeline: profileData.hiring_timeline,
            email: user.email || profileData.email,

          });

        if (error) throw error;
        await refreshProfile();
      }
    } catch (err) {
      console.error('Error syncing profile to Supabase:', err);
    }
  };

  const handleSkip = async () => {
    const finalProfile: UserProfile = {
      name: nameInput || prefilledName || 'Friend',
      targetRole: selectedRole || prefilledJob || '',
      level: selectedLevel || '',
      goal: selectedChallenge || 'confidence',
      hiring_timeline: selectedTimeline || "",
      pre_first_interview_confidence: preConfidenceScore as number,
      post_first_interview_confidence: postConfidenceScore as number,
      onboarding_completed: true,
      avatar_url: userProfile?.avatar_url as string
    };
    await syncProfileToSupabase(finalProfile);
    onComplete();
  };

  const handleUpgrade = async () => {

    const finalProfile: UserProfile = {
      name: nameInput || prefilledName || 'Friend',
      targetRole: selectedRole || prefilledJob || 'Software Engineer',
      level: selectedLevel || 'junior',
      goal: selectedChallenge || 'confidence',
      hiring_timeline: selectedTimeline || "a month",
      pre_first_interview_confidence: preConfidenceScore as number,
      post_first_interview_confidence: postConfidenceScore as number,
      onboarding_completed: true,
      last_onboarding_step: step,
      avatar_url: userProfile?.avatar_url as string
    };
    await syncProfileToSupabase(finalProfile);
    onComplete();
  };

  const canProceed = (): boolean => {
    if (step === 1) return nameInput.trim().length >= 2;
    if (step === 2) return !!selectedRole;
    if (step === 4) return !!selectedLevel;
    if (step === 6) return !!selectedChallenge;
    if (step === 8) return !!selectedTimeline;
    return true;
  };


  async function handleImReady() {
    setGeneratingQuestions(true)
    setQuestionsGenerated(false);
    handleNext()

    try {
      const payload: generateQuestionsParams = {
        profileId: user?.id as string,
        targetRole: profile.targetRole as string,
        level: profile.level,
        goal: profile.goal,
        numQuestions: 3,
        interviewType: "mixed"
      }
      const response = await onboardingApi.generateQuestions(payload)
      if (response.success) {
        setQuestionsGenerated(true);
        localStorage.setItem('onboardingQuestions', JSON.stringify(response.questions));
      }
    } catch (error: any) {
      toast.error(error.message)
      console.log("Failed to generate questions", error)
    } finally {
      setGeneratingQuestions(false)
    }
  }


  const firstName = nameInput.split(' ')[0] || 'there';
  const roleLabel =
    ROLES.find((r) => r.id === selectedRole)?.label || 'your role';

  const commitmentText = (() => {
    if (selectedChallenge === 'nerves')
      return 'walk into every interview calm, prepared, and confident.';
    if (selectedChallenge === 'structure')
      return 'give structured, compelling answers that keep interviewers engaged.';
    if (selectedChallenge === 'technical')
      return 'master the technical questions that used to trip me up.';
    if (selectedChallenge === 'behavioral')
      return 'tell powerful stories that make interviewers remember me.';
    if (selectedChallenge === 'confidence')
      return 'build the confidence to show up as my best self in every interview.';
    if (selectedChallenge === 'experience')
      return 'present my experience in a way that shows my true potential.';
    return 'land the role I deserve through consistent, focused practice.';
  })();
  const showTopBar = step > 0 && step <= 10;
  const showProgress = step >= 1 && step <= 10;
  const roleFact = selectedRole ?
    ROLE_FACTS[selectedRole] || ROLE_FACTS['other'] :
    null;
  const levelFact = selectedLevel ? LEVEL_FACTS[selectedLevel] : null;
  const challengeFact = selectedChallenge ?
    CHALLENGE_FACTS[selectedChallenge] :
    null;
  const timelineFact = selectedTimeline ?
    TIMELINE_FACTS[selectedTimeline] :
    null;


  if (step === 20)
    return <PaywallScreen onUpgrade={handleUpgrade} onSkip={handleSkip} />;
  // Full-screen steps (no top bar, no padding)
  if (step === 12) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex flex-col">
        <MockInterviewScreen
          onContinue={handleNext}
          firstName={firstName}
          onPreConfidenceSet={setPreConfidenceScore}
          jobTarget={profile.targetRole as string}
          profileId={user?.id as string}
          profile={userProfile as UserProfile}
        />

      </div>);

  }


  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-900 flex flex-col border-gray-500">
      {/* Top bar */}
      {showTopBar &&
        <div className="flex-shrink-0 px-5 pt-5 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={handleBack}
              className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors flex-shrink-0">

              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            {showProgress &&
              <div className="flex-1">
                <ProgressBar
                  current={progressStep}
                  total={totalProgressSteps} />

              </div>
            }
            <button
              onClick={handleSkip}
              className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex-shrink-0">

              Skip
            </button>
          </div>
        </div>
      }

      {/* Content */}
      <div
        key={step}
        className={`flex-1 flex flex-col px-5 pb-8 ${step === 0 ? 'justify-center items-center' : ''} animate-slide-up`}>

        {/* ── Step 0: Welcome ── */}
        {step === 0 &&
          <div className="text-center max-w-sm mx-auto w-full">
            <img
              src="/[favicon]-Prep-mirror-white-bg.png"
              alt="PrepMirrors"
              className="w-20 h-20 rounded-3xl mx-auto mb-6 shadow-card" />

            <h1 className="font-display font-bold text-4xl text-neutral-900 dark:text-white leading-tight mb-4">
              Your next interview
              <br />
              could change everything.
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed mb-8">
              PrepMirrors uses AI to prepare you for the exact interviews you'll
              face — so you walk in ready, not hoping.
            </p>
            <div className="space-y-3 mb-8">
              {[
                {
                  emoji: '🎤',
                  text: 'Real voice interview practice'
                },
                {
                  emoji: '🧠',
                  text: 'AI feedback on every answer'
                },
                {
                  emoji: '📈',
                  text: 'Track your progress daily'
                }].
                map((item) =>
                  <div
                    key={item.text}
                    className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 rounded-2xl px-4 py-3">

                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {item.text}
                    </span>
                  </div>
                )}
            </div>
            <button
              onClick={handleNext}
              className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors text-base shadow-soft">

              Let's get you ready →
            </button>
            <p className="text-xs text-neutral-400 mt-3">
              Takes 2 minutes · Free to start
            </p>
          </div>
        }

        {/* ── Step 1: Name ── */}
        {step === 1 &&
          <div className="max-w-lg mx-auto w-full pt-4">
            <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-2 leading-tight">
              First, what should we call you?
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8">
              We'll personalize everything just for you.
            </p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                setProfile((p: any) => ({
                  ...p,
                  name: e.target.value
                }));
              }}
              placeholder="Your first name"
              className="w-full px-5 py-4 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors text-xl font-semibold"
              autoFocus
              onKeyDown={(e) =>
                e.key === 'Enter' && canProceed() && handleNext()
              } />

            {nameInput.trim().length >= 2 &&
              <div className="mt-4 flex items-center gap-2 text-secondary-600 dark:text-secondary-400 text-sm animate-fade-in">
                <CheckIcon className="w-4 h-4" />
                <span>Nice to meet you, {firstName}! 👋</span>
              </div>
            }
            <div className="mt-auto pt-8">
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${canProceed() ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-soft' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}>

                Continue
              </button>
            </div>
          </div>
        }

        {/* ── Step 2: Role ── */}
        {step === 2 &&
          <div className="max-w-lg mx-auto w-full pt-4">
            <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-2 leading-tight">
              What role are you targeting, {firstName}?
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              We'll build your practice plan around this.
            </p>
            <div className="space-y-2.5 mb-6">
              {ROLES.map((role) =>
                <OptionCard
                  key={role.id}
                  option={role}
                  selected={selectedRole === role.label}
                  onSelect={() => {
                    setSelectedRole(role.label);
                    setProfile((p: any) => ({
                      ...p,
                      targetRole: role.label
                    }));
                  }} />

              )}
            </div>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all sticky bottom-4 ${canProceed() ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-soft' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}>

              Next
            </button>
          </div>
        }

        {step === 3 && roleFact &&
          <EducationFactScreen fact={roleFact} onContinue={handleNext} />
        }

        {/* ── Step 4: Level ── */}
        {step === 4 &&
          <div className="max-w-lg mx-auto w-full pt-4">
            <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-2 leading-tight">
              Where are you in your career?
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              This helps us calibrate the right difficulty for you.
            </p>
            <div className="space-y-2.5 mb-6">
              {LEVELS.map((level) =>
                <OptionCard
                  key={level.id}
                  option={level}
                  selected={selectedLevel === level.id}
                  onSelect={() => {
                    setSelectedLevel(level.id);
                    setProfile((p: any) => ({
                      ...p,
                      level: level.id
                    }));
                  }} />

              )}
            </div>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all sticky bottom-4 ${canProceed() ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-soft' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}>

              Next
            </button>
          </div>
        }

        {step === 5 && levelFact &&
          <EducationFactScreen fact={levelFact} onContinue={handleNext} />
        }

        {/* ── Step 6: Challenge ── */}
        {step === 6 &&
          <div className="max-w-lg mx-auto w-full pt-4">
            <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-2 leading-tight">
              What's your biggest interview challenge?
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              Be honest — this is how we help you most.
            </p>
            <div className="space-y-2.5 mb-6">
              {CHALLENGES.map((challenge) =>
                <OptionCard
                  key={challenge.id}
                  option={challenge}
                  selected={selectedChallenge === challenge.id}
                  onSelect={() => {
                    setSelectedChallenge(challenge.id);
                    setProfile((p: any) => ({
                      ...p,
                      goal: challenge.id
                    }));
                  }} />

              )}
            </div>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all sticky bottom-4 ${canProceed() ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-soft' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}>

              Next
            </button>
          </div>
        }

        {step === 7 && challengeFact &&
          <EducationFactScreen fact={challengeFact} onContinue={handleNext} />
        }

        {/* ── Step 8: Timeline ── */}
        {step === 8 &&
          <div className="max-w-lg mx-auto w-full pt-4">
            <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-2 leading-tight">
              When's your next interview?
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              We'll prioritize what matters most for your timeline.
            </p>
            <div className="space-y-2.5 mb-6">
              {TIMELINES.map((timeline) =>
                <OptionCard
                  key={timeline.id}
                  option={timeline}
                  selected={selectedTimeline === timeline.id}
                  onSelect={() => setSelectedTimeline(timeline.id)} />

              )}
            </div>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all sticky bottom-4 ${canProceed() ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-soft' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}>

              Next
            </button>
          </div>
        }

        {step === 9 && timelineFact &&
          <EducationFactScreen fact={timelineFact} onContinue={handleNext} />
        }

        {/* ── Step 10: Insight / Social Proof ── */}
        {step === 10 &&
          <div className="max-w-lg mx-auto w-full pt-4 flex flex-col items-center text-center">
            <div className="flex gap-3 mb-8 flex-wrap justify-center">
              {[
                {
                  label:
                    ROLES.find((r) => r.id === selectedRole)?.label ||
                    roleLabel,
                  emoji:
                    ROLES.find((r) => r.id === selectedRole)?.emoji || '✨'
                },
                {
                  label:
                    LEVELS.find((l) => l.id === selectedLevel)?.label || '',
                  emoji:
                    LEVELS.find((l) => l.id === selectedLevel)?.emoji || '📊'
                },
                {
                  label:
                    CHALLENGES.find((c) => c.id === selectedChallenge)?.label ||
                    '',
                  emoji:
                    CHALLENGES.find((c) => c.id === selectedChallenge)?.emoji ||
                    '💪'
                }].

                filter((item) => item.label).
                map((item, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-2.5 shadow-card animate-slide-up"
                    style={{
                      animationDelay: `${i * 100}ms`
                    }}>

                    <span className="text-lg">{item.emoji}</span>
                    <div className="w-4 h-4 rounded-full bg-secondary-500 flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      {item.label}
                    </span>
                  </div>
                )}
            </div>
            <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-4 leading-tight">
              You're in the right place, {firstName}.
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed mb-8 max-w-sm">
              Thousands of {roleLabel} candidates have used PrepMirrors to
              overcome exactly what you're facing — and land roles they thought
              were out of reach.
            </p>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-3xl p-6 w-full mb-8 border border-primary-100 dark:border-primary-800">
              <p className="font-display font-bold text-2xl text-primary-600 dark:text-primary-400 mb-3 leading-snug">
                "The research is clear: structured, realistic practice is the
                single biggest predictor of interview success."
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Based on peer-reviewed research in interview preparation and
                performance psychology
              </p>
            </div>
            <button
              onClick={handleImReady}
              className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors text-base shadow-soft">

              I'm ready →
            </button>
          </div>
        }

        {/* ── Step 11: Aha Moment ── */}
        {step === 11 && (
          <AhaMomentScreen
            firstName={firstName}
            roleLabel={roleLabel}
            onContinue={handleNext}
            generatingQuestions={generatingQuestions}
            questionsGenerated={questionsGenerated}
          />
        )}

        {/* Step 12 handled above (full screen) */}

        {/* ── Step 13: Feedback ── */}
        {step === 13 &&
          <OnboardingFeedbackScreen
            firstName={firstName}
            preConfidenceScore={preConfidenceScore}
            onContinue={handleNext}
          />
        }

        {/* ── Steps 14-18: Feature Showcase ── */}
        {step >= 14 && step <= 18 &&
          <FeatureShowcaseScreen
            featureIndex={step - 14}
            onContinue={handleNext}
            isLast={step === 18} />

        }

        {/* ── Step 19: Commitment ── */}
        {step === 19 &&
          <div className="max-w-lg mx-auto w-full pt-8 flex flex-col items-center text-center">
            <div className="mb-8">
              <p className="text-neutral-500 dark:text-neutral-400 text-base mb-2">
                I will use PrepMirrors to
              </p>
              <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white leading-snug">
                {commitmentText}
              </h1>
            </div>
            <CommitButton onCommit={() => navigate('forward')} />
            <p className="text-xs text-neutral-400 mt-8 max-w-xs">
              This commitment is for you, not us. Research shows that people who
              make explicit commitments are 3× more likely to follow through.
            </p>
          </div>
        }
      </div>
    </div>);

}