import React, { useEffect, useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MapPinIcon,
  DollarSignIcon,
  BriefcaseIcon,
  BuildingIcon,
  ClockIcon,
  UsersIcon,
  ChevronRightIcon } from
'lucide-react';
import { InterviewData } from '../App';
interface InterviewScriptPageProps {
  interview: InterviewData;
  phase: 'technical' | 'behavioral';
  onContinue: () => void;
  onBack: () => void;
}
const TECHNICAL_SCRIPTS: Record<string, string> = {
  default: `Hello! I'm Jordan, your technical interviewer at {company} today. Welcome to the {role} interview.

This is a {jobType} position based in {location}, with a competitive salary range of {salary}.

In this technical round, we'll be assessing your problem-solving abilities, coding skills, and system design knowledge. The interview will consist of 5 questions covering data structures, algorithms, and real-world engineering challenges.

I'll be evaluating your thought process as much as your final answers, so please think out loud and don't hesitate to ask clarifying questions.

Ready to show us what you've got? Let's begin! 🚀`
};
const BEHAVIORAL_SCRIPTS: Record<string, string> = {
  default: `Hi there! I'm Morgan, your behavioral interviewer at {company}. Great to meet you!

You're interviewing for the {role} position — a {jobType} role in {location}.

In this behavioral round, I'll be asking you about your past experiences, how you handle challenges, and how you work with others. We use the STAR method here — Situation, Task, Action, Result.

There are no right or wrong answers. We're looking for authenticity, self-awareness, and growth mindset. Take your time with each answer.

This is a safe space to share your real experiences. I'm rooting for you! Let's get started. 😊`
};
function TypewriterText({
  text,
  onComplete



}: {text: string;onComplete: () => void;}) {
  const [displayed, setDisplayed] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  useEffect(() => {
    if (currentIndex < text.length) {
      const delay =
      text[currentIndex] === '.' ||
      text[currentIndex] === '!' ||
      text[currentIndex] === '?' ?
      80 :
      18;
      const timer = setTimeout(() => {
        setDisplayed((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else if (!isDone) {
      setIsDone(true);
      setTimeout(onComplete, 600);
    }
  }, [currentIndex, text, isDone, onComplete]);
  const skipToEnd = () => {
    setDisplayed(text);
    setCurrentIndex(text.length);
    if (!isDone) {
      setIsDone(true);
      setTimeout(onComplete, 200);
    }
  };
  return (
    <div className="relative">
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line text-base">
        {displayed}
        {!isDone &&
        <span className="inline-block w-0.5 h-5 bg-primary-500 ml-0.5 animate-pulse align-middle" />
        }
      </p>
      {!isDone &&
      <button
        onClick={skipToEnd}
        className="mt-4 text-xs text-neutral-400 dark:text-neutral-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors underline">

          Skip animation →
        </button>
      }
    </div>);

}
export function InterviewScriptPage({
  interview,
  phase,
  onContinue,
  onBack
}: InterviewScriptPageProps) {
  const [scriptReady, setScriptReady] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const rawScript =
  phase === 'technical' ?
  TECHNICAL_SCRIPTS.default :
  BEHAVIORAL_SCRIPTS.default;
  const script = rawScript.
  replace(/{company}/g, interview.company).
  replace(/{role}/g, interview.role).
  replace(/{jobType}/g, interview.jobType).
  replace(/{location}/g, interview.location).
  replace(/{salary}/g, interview.salary);
  const interviewer =
  phase === 'technical' ?
  {
    name: 'Jordan',
    title: 'Senior Engineer',
    avatar: 'J',
    color: 'bg-primary-500'
  } :
  {
    name: 'Morgan',
    title: 'HR Manager',
    avatar: 'M',
    color: 'bg-secondary-500'
  };
  useEffect(() => {
    const timer = setTimeout(() => setScriptReady(true), 800);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-6">

          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Phase badge */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${phase === 'technical' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300'}`}>

            {phase === 'technical' ?
            '⚙️ Technical Round' :
            '🤝 Behavioral Round'}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            Phase {phase === 'technical' ? '1' : '2'} of 2
          </span>
        </div>

        {/* Job details card */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 shadow-card mb-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0 ${
              {
                G: 'bg-blue-500',
                S: 'bg-indigo-500',
                A: 'bg-rose-500',
                M: 'bg-blue-600',
                N: 'bg-neutral-800',
                L: 'bg-purple-500'
              }[interview.logo] || 'bg-primary-500'}`
              }>

              {interview.logo}
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-xl text-neutral-900 dark:text-white">
                {interview.role}
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                {interview.company}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <DollarSignIcon className="w-3.5 h-3.5" />
                  <span>{interview.salary}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span>{interview.location}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <BriefcaseIcon className="w-3.5 h-3.5" />
                  <span>{interview.jobType}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>~45 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interviewer intro */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 shadow-card mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div
              className={`w-12 h-12 rounded-2xl ${interviewer.color} flex items-center justify-center text-white font-display font-bold text-lg`}>

              {interviewer.avatar}
            </div>
            <div>
              <p className="font-display font-bold text-neutral-900 dark:text-white">
                {interviewer.name}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {interviewer.title} · {interview.company}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 bg-secondary-100 dark:bg-secondary-900/30 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
              <span className="text-xs font-semibold text-secondary-700 dark:text-secondary-400">
                Ready
              </span>
            </div>
          </div>

          {/* Typing animation */}
          <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4">
            {scriptReady ?
            <TypewriterText
              text={script}
              onComplete={() => setShowContinue(true)} /> :


            <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div
                  className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                  style={{
                    animationDelay: '0ms'
                  }} />

                  <div
                  className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                  style={{
                    animationDelay: '150ms'
                  }} />

                  <div
                  className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                  style={{
                    animationDelay: '300ms'
                  }} />

                </div>
                <span className="text-sm text-neutral-400 dark:text-neutral-500">
                  Preparing your interviewer...
                </span>
              </div>
            }
          </div>
        </div>

        {/* What to expect */}
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800 mb-6">
          <h3 className="font-display font-semibold text-primary-700 dark:text-primary-300 mb-3 flex items-center gap-2">
            <span>📋</span> What to expect
          </h3>
          <div className="space-y-2">
            {phase === 'technical' ?
            [
            '5 technical questions on data structures & algorithms',
            'Think out loud — your reasoning matters',
            'You can ask clarifying questions',
            'Voice-based answers, no typing needed'] :

            [
            '4 behavioral questions using STAR method',
            'Share real experiences from your past',
            'Be authentic — there are no wrong answers',
            'Focus on what you learned from each experience'].
            map((item, i) =>
            <div key={i} className="flex items-start gap-2">
                    <ChevronRightIcon className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-primary-700 dark:text-primary-300">
                      {item}
                    </span>
                  </div>
            )}
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          disabled={!showContinue}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all duration-300 ${showContinue ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-soft hover:shadow-glow' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'}`}>

          <span>
            Begin {phase === 'technical' ? 'Technical' : 'Behavioral'} Interview
          </span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>);

}