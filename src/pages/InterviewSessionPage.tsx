import React, { useEffect, useState, useRef } from 'react';
import {
  MicIcon,
  MicOffIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  VolumeIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronRightIcon } from
'lucide-react';
import { InterviewData } from '../App';
interface InterviewSessionPageProps {
  interview: InterviewData;
  phase: 'technical' | 'behavioral';
  onComplete: (data: {question: string;answer: string;}) => void;
  onBack: () => void;
}
const TECHNICAL_QUESTIONS = [
'Can you explain the difference between a stack and a queue, and give a real-world use case for each?',
'What is the time complexity of binary search, and when would you use it over linear search?',
"Explain the concept of recursion and give an example of a problem that's best solved recursively.",
'What is a hash table, and how does it handle collisions?',
'Describe the difference between breadth-first search and depth-first search.'];

const BEHAVIORAL_QUESTIONS = [
'Tell me about a time when you had to work under a tight deadline. How did you manage your time and what was the outcome?',
'Describe a situation where you had a conflict with a team member. How did you resolve it?',
"Tell me about a project you're most proud of. What was your role and what impact did it have?",
'Give an example of a time you failed. What did you learn from it?'];

type SessionState =
'intro' |
'question' |
'listening' |
'processing' |
'answered';
export function InterviewSessionPage({
  interview,
  phase,
  onComplete,
  onBack
}: InterviewSessionPageProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sessionState, setSessionState] = useState<SessionState>('intro');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [useTextMode, setUseTextMode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questions =
  phase === 'technical' ? TECHNICAL_QUESTIONS : BEHAVIORAL_QUESTIONS;
  const currentQuestion = questions[questionIndex];
  const totalQuestions = questions.length;
  const progress = questionIndex / totalQuestions * 100;
  const interviewer =
  phase === 'technical' ?
  {
    name: 'Jordan',
    color: 'bg-primary-500',
    avatar: 'J'
  } :
  {
    name: 'Morgan',
    color: 'bg-secondary-500',
    avatar: 'M'
  };
  useEffect(() => {
    if (sessionState === 'intro') {
      const timer = setTimeout(() => setSessionState('question'), 1500);
      return () => clearTimeout(timer);
    }
  }, [sessionState]);
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => {
          if (t >= 120) {
            stopRecording();
            return t;
          }
          return t + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setSessionState('listening');
  };
  const stopRecording = () => {
    setIsRecording(false);
    setSessionState('processing');
    // Simulate processing
    setTimeout(() => {
      setUserAnswer(
        `I answered the question about ${currentQuestion.substring(0, 40)}...`
      );
      setSessionState('answered');
    }, 1500);
  };
  const handleSubmitText = () => {
    if (textAnswer.trim().length < 10) return;
    setSessionState('processing');
    setTimeout(() => {
      setUserAnswer(textAnswer);
      setSessionState('answered');
    }, 800);
  };
  const handleNext = () => {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSessionState('question');
      setIsRecording(false);
      setRecordingTime(0);
      setUserAnswer('');
      setTextAnswer('');
      setUseTextMode(false);
    } else {
      onComplete({
        question: currentQuestion,
        answer: userAnswer || textAnswer
      });
    }
  };
  const formatTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">

            <ArrowLeftIcon className="w-4 h-4" />
            <span>Exit</span>
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {interview.company} ·{' '}
              {phase === 'technical' ? 'Technical' : 'Behavioral'} Round
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
              Live
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full progress-fill"
              style={{
                width: `${progress}%`
              }} />

          </div>
        </div>

        {/* Interviewer card */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 shadow-card mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-xl ${interviewer.color} flex items-center justify-center text-white font-display font-bold`}>

              {interviewer.avatar}
            </div>
            <div>
              <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white">
                {interviewer.name}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {interview.company} Interviewer
              </p>
            </div>
            {sessionState === 'question' &&
            <div className="ml-auto flex items-center gap-1.5">
                <div className="flex gap-0.5 items-end">
                  {[12, 20, 28, 20, 12].map((h, i) =>
                <div
                  key={i}
                  className="w-1 rounded-full bg-primary-400"
                  style={{
                    height: `${h}px`,
                    animation: `wave 1.5s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`
                  }} />

                )}
                </div>
                <span className="text-xs text-primary-500 font-medium">
                  Speaking
                </span>
              </div>
            }
          </div>

          {/* Question */}
          {sessionState === 'intro' ?
          <div className="flex items-center gap-2 py-4">
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
                Preparing question...
              </span>
            </div> :

          <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4">
              <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                {currentQuestion}
              </p>
            </div>
          }
        </div>

        {/* Answer area */}
        {(sessionState === 'question' ||
        sessionState === 'listening' ||
        sessionState === 'processing' ||
        sessionState === 'answered') &&
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 shadow-card mb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white">
                Your Answer
              </p>
              {!useTextMode && sessionState !== 'answered' &&
            <button
              onClick={() => setUseTextMode(true)}
              className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">

                  Switch to text mode
                </button>
            }
            </div>

            {sessionState === 'answered' ?
          <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircleIcon className="w-5 h-5 text-secondary-500" />
                  <span className="text-sm font-semibold text-secondary-600 dark:text-secondary-400">
                    Answer recorded!
                  </span>
                </div>
                <div className="bg-secondary-50 dark:bg-secondary-900/20 rounded-xl p-3 border border-secondary-100 dark:border-secondary-800">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {userAnswer || textAnswer}
                  </p>
                </div>
              </div> :
          sessionState === 'processing' ?
          <div className="flex items-center justify-center py-8 gap-3">
                <div className="flex gap-1">
                  <div
                className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
                style={{
                  animationDelay: '0ms'
                }} />

                  <div
                className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
                style={{
                  animationDelay: '150ms'
                }} />

                  <div
                className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
                style={{
                  animationDelay: '300ms'
                }} />

                </div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Processing your answer...
                </span>
              </div> :
          useTextMode ?
          <div className="space-y-3">
                <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 resize-none transition-colors text-sm" />

                <button
              onClick={handleSubmitText}
              disabled={textAnswer.trim().length < 10}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${textAnswer.trim().length >= 10 ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}>

                  Submit Answer
                </button>
              </div> :

          <div className="flex flex-col items-center py-4">
                {/* Voice recording UI */}
                <div
              className={`relative w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${isRecording ? 'bg-red-500 shadow-[0_0_0_8px_rgba(239,68,68,0.2),0_0_0_16px_rgba(239,68,68,0.1)]' : 'bg-primary-500 hover:bg-primary-600 cursor-pointer'}`}
              onClick={isRecording ? stopRecording : startRecording}>

                  {isRecording ?
              <MicIcon className="w-10 h-10 text-white" /> :

              <MicIcon className="w-10 h-10 text-white" />
              }
                </div>

                {isRecording ?
            <div className="text-center">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-0.5 items-end">
                        {[8, 16, 24, 16, 8, 20, 12].map((h, i) =>
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-red-400"
                    style={{
                      height: `${h}px`,
                      animation: `wave 1.5s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`
                    }} />

                  )}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-red-500">
                      Recording... {formatTime(recordingTime)}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      Tap to stop
                    </p>
                  </div> :

            <div className="text-center">
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Tap to answer
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      Speak clearly into your microphone
                    </p>
                  </div>
            }
              </div>
          }
          </div>
        }

        {/* Tips */}
        {sessionState === 'question' && !useTextMode &&
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-100 dark:border-primary-800 mb-4">
            <p className="text-xs text-primary-700 dark:text-primary-300 font-semibold mb-1">
              💡 Quick tip
            </p>
            <p className="text-xs text-primary-600 dark:text-primary-400">
              {phase === 'technical' ?
            'Think out loud! Explain your approach before jumping to code.' :
            'Use the STAR method: Situation → Task → Action → Result'}
            </p>
          </div>
        }

        {/* Next button */}
        {sessionState === 'answered' &&
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-2xl transition-colors shadow-soft hover:shadow-glow animate-slide-up">

            <span>
              {questionIndex < totalQuestions - 1 ?
            'Next Question' :
            'Get My Feedback'}
            </span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        }
      </div>
    </div>);

}