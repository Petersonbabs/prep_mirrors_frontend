import { useEffect, useRef, useState } from "react";
import { confidenceLevels } from "../../../data/interview";
import { CheckIcon, MicIcon, MicOffIcon } from "lucide-react";

const MOCK_QUESTIONS = [
  "Tell me about yourself and why you're interested in this role.",
  'Describe a time you faced a significant challenge at work. How did you handle it?',
  'Where do you see yourself in 3 years, and how does this role fit into that vision?'];

const AI_INTERVIEWER = {
  name: 'Sarah Chen',
  title: 'Senior Recruiter',
  company: 'TechCorp',
  avatar: '👩‍💼'
};
const USER_ANSWER_PLACEHOLDERS = [
  "Sure!",
  'with exactly where I want to grow...'
]

type InterviewPhase =
  'pre-rating' |
  'intro' |
  'asking' |
  'listening' |
  'next' |
  'done';
interface TranscriptEntry {
  id: number;
  speaker: 'ai' | 'user';
  name: string;
  text: string;
  pending?: boolean;
}


function MockInterviewScreen({
  onContinue,
  firstName,
  onPreConfidenceSet
}: { onContinue: () => void; firstName?: string; onPreConfidenceSet?: (score: number) => void; }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<InterviewPhase>('pre-rating');
  const [preConfidence, setPreConfidence] = useState<number | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [micOn, setMicOn] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [entryId, setEntryId] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const userName = firstName || 'You';
  // Session timer
  useEffect(() => {
    timerRef.current = setInterval(() => setSessionTime((t) => t + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);
  // Typewriter effect for question
  useEffect(() => {
    if (phase !== 'asking') return;
    const q = MOCK_QUESTIONS[questionIndex];
    setDisplayedText('');
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayedText(q.slice(0, i));
      if (i >= q.length) {
        clearInterval(t);
        // Add AI message to transcript
        const id = entryId;
        setEntryId((n) => n + 1);
        setTranscript((prev) => [
          ...prev,
          {
            id,
            speaker: 'ai',
            name: 'Sarah (Interviewer)',
            text: q
          }]
        );
        setTimeout(() => setPhase('listening'), 600);
      }
    }, 22);
    return () => clearInterval(t);
  }, [phase, questionIndex]);
  const handlePreConfidenceSelect = (score: number) => {
    setPreConfidence(score);
    onPreConfidenceSet?.(score);
    setTimeout(() => setPhase('intro'), 300);
  };
  const startInterview = () => setPhase('asking');
  const startAnswering = () => {
    // Add pending user entry
    const id = entryId;
    setEntryId((n) => n + 1);
    setTranscript((prev) => [
      ...prev,
      {
        id,
        speaker: 'user',
        name: `${userName} (You)`,
        text: '',
        pending: true
      }]
    );
  };
  const doneAnswering = () => {
    // Finalize user transcript entry
    setTranscript((prev) =>
      prev.map((e) =>
        e.pending ?
          {
            ...e,
            text: USER_ANSWER_PLACEHOLDERS[questionIndex],
            pending: false
          } :
          e
      )
    );
    if (questionIndex < MOCK_QUESTIONS.length - 1) {
      setPhase('next');
    } else {
      setPhase('done');
    }
  };
  const nextQuestion = () => {
    setQuestionIndex((i) => i + 1);
    setPhase('asking');
  };
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const isAiSpeaking = phase === 'asking';
  const isUserSpeaking = phase === 'listening';
  return (
    <div className="w-full flex flex-col bg-neutral-950 min-h-screen">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-neutral-900 border-b border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src="/[favicon]-Prep-mirror-white-bg.png"
            alt="PrepMirrors"
            className="w-6 h-6 rounded-md opacity-80" />

          <span className="text-sm font-semibold text-white">PrepMirrors</span>
          {phase !== 'intro' && phase !== 'pre-rating' &&
            <div className="flex items-center gap-1.5 ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400 font-medium">Live</span>
            </div>
          }
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Q</span>
            <div className="flex gap-1">
              {MOCK_QUESTIONS.map((_, i) =>
                <div
                  key={i}
                  className={`w-5 h-1.5 rounded-full transition-all duration-300 ${i < questionIndex ? 'bg-secondary-500' : i === questionIndex ? 'bg-primary-500' : 'bg-neutral-700'}`} />

              )}
            </div>
            <span className="text-xs text-neutral-400">
              {questionIndex + 1}/{MOCK_QUESTIONS.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-800 rounded-lg px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
            <span className="text-xs text-neutral-400 font-mono tabular-nums">
              {formatTime(sessionTime)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Pre-rating screen ── */}
      {phase === 'pre-rating' &&
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
          <div className="w-full max-w-sm text-center">
            <div className="text-4xl mb-5">🪞</div>
            <h2 className="font-display font-bold text-xl text-white mb-2">
              Before we start
            </h2>
            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
              How confident are you feeling about interviews right now? Be
              honest — this helps us track your progress.
            </p>
            <div className="flex justify-center gap-3 mb-8">
              {confidenceLevels.
                map(({ score, emoji, label }) =>
                  <button
                    key={score}
                    onClick={() => handlePreConfidenceSelect(score)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 group ${preConfidence === score ? 'border-primary-500 bg-primary-900/30 scale-110' : 'border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800'}`}>

                    <span className="text-2xl">{emoji}</span>
                    <span className="text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors leading-tight text-center w-12">
                      {label}
                    </span>
                  </button>
                )}
            </div>
            <p className="text-xs text-neutral-600">
              Tap to select and continue
            </p>
          </div>
        </div>
      }

      {/* ── Video tiles — side by side ── */}
      {phase !== 'pre-rating' &&
        <>
          <div className="flex-shrink-0 p-4 grid grid-cols-2 gap-3">
            {/* AI Interviewer tile */}
            <div
              className="relative bg-neutral-800 rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '4/3'
              }}>

              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-neutral-900/80 to-neutral-900" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${isAiSpeaking ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-neutral-800' : ''}`}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  }}>

                  {AI_INTERVIEWER.avatar}
                  {isAiSpeaking &&
                    <div className="absolute inset-0 rounded-full ring-4 ring-primary-400/40 animate-ping" />
                  }
                </div>
                {isAiSpeaking &&
                  <div className="flex gap-0.5 items-end h-4">
                    {[3, 6, 9, 12, 9, 6, 3].map((h, i) =>
                      <div
                        key={i}
                        className="w-0.5 bg-primary-400 rounded-full animate-pulse"
                        style={{
                          height: `${h}px`,
                          animationDelay: `${i * 80}ms`
                        }} />

                    )}
                  </div>
                }
              </div>
              <div className="absolute bottom-2.5 left-2.5">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                  <p className="text-xs text-white font-medium">
                    {AI_INTERVIEWER.name}
                  </p>
                </div>
              </div>
              <div className="absolute top-2.5 right-2.5">
                {isAiSpeaking ?
                  <div className="flex items-center gap-1.5 bg-primary-500/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-xs text-white font-semibold">
                      Speaking
                    </span>
                  </div> :
                  phase !== 'intro' ?
                    <div className="flex items-center gap-1.5 bg-neutral-700/80 backdrop-blur-sm rounded-full px-2.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      <span className="text-xs text-neutral-300 font-medium">
                        Waiting
                      </span>
                    </div> :
                    null}
              </div>
            </div>

            {/* User tile */}
            <div
              className="relative bg-neutral-800 rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '4/3'
              }}>

              <div className="absolute inset-0 bg-gradient-to-br from-neutral-700/50 to-neutral-900" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div
                  className={`relative w-16 h-16 rounded-full bg-neutral-600 flex items-center justify-center text-2xl transition-all duration-300 ${isUserSpeaking ? 'ring-2 ring-secondary-400 ring-offset-2 ring-offset-neutral-800' : ''}`}>

                  🧑
                  {isUserSpeaking &&
                    <div className="absolute inset-0 rounded-full ring-4 ring-secondary-400/40 animate-ping" />
                  }
                </div>
                {isUserSpeaking &&
                  <div className="flex gap-0.5 items-end h-4">
                    {[4, 8, 12, 8, 4, 8, 12].map((h, i) =>
                      <div
                        key={i}
                        className="w-0.5 bg-secondary-400 rounded-full animate-pulse"
                        style={{
                          height: `${h}px`,
                          animationDelay: `${i * 100}ms`
                        }} />

                    )}
                  </div>
                }
              </div>
              <div className="absolute bottom-2.5 left-2.5">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                  <p className="text-xs text-white font-medium">{userName}</p>
                </div>
              </div>
              <div className="absolute top-2.5 right-2.5">
                {isUserSpeaking ?
                  <div className="flex items-center gap-1.5 bg-secondary-500/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-xs text-white font-semibold">
                      Listening
                    </span>
                  </div> :
                  phase === 'next' || phase === 'done' ?
                    <div className="flex items-center gap-1.5 bg-secondary-700/80 backdrop-blur-sm rounded-full px-2.5 py-1">
                      <CheckIcon className="w-2.5 h-2.5 text-secondary-300" />
                      <span className="text-xs text-secondary-300 font-medium">
                        Answered
                      </span>
                    </div> :
                    null}
              </div>
              {!micOn && isUserSpeaking &&
                <div className="absolute bottom-2.5 right-2.5 bg-red-500/90 rounded-full p-1">
                  <MicOffIcon className="w-3 h-3 text-white" />
                </div>
              }
            </div>
          </div>

          {/* ── Live Transcript ── */}
          <div
            className="flex-1 mx-4 mb-3 bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col overflow-hidden"
            style={{
              minHeight: '120px',
              maxHeight: '200px'
            }}>

            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-800 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Live Transcript
              </span>
            </div>
            <div
              ref={transcriptRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">

              {transcript.length === 0 ?
                <p className="text-xs text-neutral-600 italic text-center py-2">
                  Transcript will appear here once the interview starts...
                </p> :

                transcript.map((entry) =>
                  <div key={entry.id} className="space-y-0.5">
                    <p
                      className={`text-xs font-semibold ${entry.speaker === 'ai' ? 'text-primary-400' : 'text-secondary-400'}`}>

                      {entry.name}
                    </p>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {entry.pending ?
                        <span className="flex items-center gap-1.5">
                          <span className="text-neutral-500 italic">
                            Speaking
                          </span>
                          <span className="flex gap-0.5">
                            {[0, 1, 2].map((i) =>
                              <span
                                key={i}
                                className="inline-block w-1 h-1 rounded-full bg-secondary-400 animate-bounce"
                                style={{
                                  animationDelay: `${i * 150}ms`
                                }} />

                            )}
                          </span>
                        </span> :

                        entry.text
                      }
                    </p>
                  </div>
                )
              }
              {phase === 'asking' && displayedText &&
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-primary-400">
                    Sarah (Interviewer)
                  </p>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {displayedText}
                    <span className="inline-block w-0.5 h-3.5 bg-primary-400 ml-0.5 animate-pulse align-middle" />
                  </p>
                </div>
              }
            </div>
          </div>

          {/* ── Controls ── */}
          <div className="px-4 pb-5 flex-shrink-0 bg-neutral-950">
            {phase === 'intro' &&
              <button
                onClick={startInterview}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors text-base">

                Start Interview →
              </button>
            }
            {phase === 'asking' &&
              <div className="flex items-center justify-center gap-3 py-3">
                <div className="flex gap-0.5 items-end">
                  {[0, 1, 2, 3, 4].map((i) =>
                    <div
                      key={i}
                      className="w-1 bg-primary-500 rounded-full animate-pulse"
                      style={{
                        height: `${8 + i * 3}px`,
                        animationDelay: `${i * 80}ms`
                      }} />

                  )}
                </div>
                <span className="text-sm text-neutral-400">
                  Sarah is speaking...
                </span>
              </div>
            }
            {phase === 'listening' &&
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMicOn((m) => !m)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${micOn ? 'bg-neutral-700 hover:bg-neutral-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>

                    {micOn ?
                      <MicIcon className="w-5 h-5" /> :

                      <MicOffIcon className="w-5 h-5" />
                    }
                  </button>
                  <button
                    onClick={() => {
                      startAnswering();
                    }}
                    className="flex-1 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-bold rounded-2xl transition-colors text-sm"
                    style={{
                      display: transcript.some((e) => e.pending) ?
                        'none' :
                        'block'
                    }}>

                    🎤 Start Answering
                  </button>
                  {transcript.some((e) => e.pending) &&
                    <button
                      onClick={doneAnswering}
                      className="flex-1 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-bold rounded-2xl transition-colors text-sm">

                      ✓ Done Answering
                    </button>
                  }
                </div>
                <p className="text-center text-xs text-neutral-600">
                  Take your time — answer naturally
                </p>
              </div>
            }
            {phase === 'next' &&
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 bg-secondary-900/40 border border-secondary-800 rounded-xl px-4 py-2.5">
                  <CheckIcon className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                  <p className="text-secondary-400 text-sm font-medium">
                    Answer recorded — great job!
                  </p>
                </div>
                <button
                  onClick={nextQuestion}
                  className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors">

                  Next Question →
                </button>
              </div>
            }
            {phase === 'done' &&
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 bg-secondary-900/40 border border-secondary-800 rounded-xl px-4 py-2.5">
                  <span className="text-base">🎉</span>
                  <p className="text-secondary-400 text-sm font-medium">
                    Interview complete! All 3 answers recorded.
                  </p>
                </div>
                <button
                  onClick={onContinue}
                  className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors">

                  See My Feedback →
                </button>
              </div>
            }
          </div>
        </>
      }
    </div>);

}

export default MockInterviewScreen;