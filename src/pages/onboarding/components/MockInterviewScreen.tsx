import { useEffect, useState, useRef } from "react";
import { confidenceLevels } from "../../../data/interview";
import { CheckIcon, Loader2, Mic } from "lucide-react";
import { useVapiAgent, CallStatus } from "../../../lib/hooks/useVapiAgent";
import { onboardingApi } from "../../../lib/api/onboarding";
import { UserProfile } from "../../../lib/types";
import { getInitials } from "../../../utils/utils";
import Timer from "../../../components/ui/Timer";
import { captureEvent } from "../../../lib/posthog";

const AI_INTERVIEWER = {
  name: 'Sarah Chen',
  title: 'Senior Recruiter',
  company: 'TechCorp',
  avatar: '/ai-interviewer.png'
};

interface MockInterviewScreenProps {
  onContinue: () => void;
  onAnswersCollected?: (answers: string[]) => void;
  firstName: string;
  jobTarget: string;
  profileId: string;
  profile: UserProfile;
  onPreConfidenceSet: (score: number) => void;
}

function MockInterviewScreen({
  onContinue,
  onAnswersCollected,
  firstName,
  jobTarget,
  profileId,
  profile,
  onPreConfidenceSet,
}: MockInterviewScreenProps) {
  const [phase, setPhase] = useState<'loading' | 'pre-rating' | 'interview' | 'feedback'>('loading');
  const [preConfidence, setPreConfidence] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [callActive, setCallActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [transcriptMessages, setTranscriptMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const userName = firstName || 'You';
  const [processingAnswer, setProcessingAnswer] = useState(false)



  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!profileId) {
        setLoadingError("Profile ID not found");
        setPhase('pre-rating');
        return;
      }

      try {
        const response = await onboardingApi.getMyOnboardingQuestions(profileId);
        if (response.success && response.questions) {
          setQuestions(response.questions);
          setPhase('pre-rating');
        } else {
          setLoadingError("Failed to load interview questions");
          setPhase('pre-rating');
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoadingError("Failed to load interview questions");
        setPhase('pre-rating');
      }
    };

    fetchQuestions();
  }, [profileId]);

  // Session timer

  // Auto-scroll transcript on new messages
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcriptMessages]);

  const handlePreConfidenceSelect = (score: number) => {
    setPreConfidence(score);
    onPreConfidenceSet?.(score);
    setTimeout(() => setPhase('interview'), 300);
  };

  // Real-time transcript update
  const handleTranscriptUpdate = (message: { role: string; content: string }) => {
    setTranscriptMessages(prev => [...prev, message]);
  };

  const handleCallEnd = async (messages: Array<{ role: string; content: string }>) => {


    const conversation = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'interviewer' : 'user',
      content: msg.content
    }));

    captureEvent('onboarding_interview_call_ended', {
      step: 11,
      transcript: conversation,
      questions_answered: userAnswers.length,
      total_time: sessionTime,
    })

    const answers = conversation
      .filter(m => m.role === 'user')
      .map(m => m.content);
    onAnswersCollected?.(answers);
    setProcessingAnswer(true)
    try {
      await onboardingApi.submitAnswers(profileId, conversation, profile)
      setPhase('feedback');
    } catch (error) {
      console.log(error)
    } finally {
      setProcessingAnswer(false)
    }
  };

  const handleStatusChange = (status: CallStatus, speaking?: { isSpeaking: boolean; role?: string }) => {
    if (status === CallStatus.ACTIVE) {
      setCallActive(true);
    }
    if (status === CallStatus.FINISHED) {
      setCallActive(false);
    }

    // Update speaking indicators
    if (speaking) {
      if (speaking.role === 'assistant') {
        setIsAiSpeaking(speaking.isSpeaking);
        setIsUserSpeaking(false);
      } else {
        setIsUserSpeaking(speaking.isSpeaking);
        setIsAiSpeaking(false);
      }
    }
  };

  // VAPI HOOK
  const {
    callStatus,
    isSpeaking: agentIsSpeaking,
    messages: vapiMessages,
    isUserSpeaking: agentIsUserSpeaking,
    startCall,
    startingCall,
    endCall
  } = useVapiAgent({
    assistantId: import.meta.env.VITE_VAPI_ONBOARDING_INTERVIEW_ASSISTANT_ID,
    questions: questions,
    userName: userName,
    jobTarget: jobTarget,
    onCallEnd: handleCallEnd,
    onStatusChange: handleStatusChange,
    onTranscriptUpdate: handleTranscriptUpdate
  });


  useEffect(() => {
    if (callStatus === CallStatus.ACTIVE) {
      setCallActive(true);
    }
    if (callStatus === CallStatus.FINISHED) {
      setCallActive(false);
    }
  }, [callStatus]);


  useEffect(() => {
    setIsAiSpeaking(agentIsSpeaking);
  }, [agentIsSpeaking]);

  useEffect(() => {
    setIsUserSpeaking(agentIsUserSpeaking);
  }, [agentIsUserSpeaking]);




  // Loading screen with skeleton
  if (phase === 'loading') {
    return (
      <div className="w-full flex flex-col bg-neutral-950 min-h-screen">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between px-5 py-3 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-neutral-700 animate-pulse" />
            <div className="w-24 h-4 bg-neutral-700 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-4 bg-neutral-700 rounded animate-pulse" />
            <div className="w-16 h-4 bg-neutral-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Video Tiles Skeleton */}
        <div className="flex-shrink-0 p-4 grid grid-cols-2 gap-3">
          <div className="relative bg-neutral-800 rounded-2xl overflow-hidden animate-pulse" style={{ aspectRatio: '4/3' }}>
            <div className="absolute inset-0 bg-neutral-700/50" />
          </div>
          <div className="relative bg-neutral-800 rounded-2xl overflow-hidden animate-pulse" style={{ aspectRatio: '4/3' }}>
            <div className="absolute inset-0 bg-neutral-700/50" />
          </div>
        </div>

        {/* Transcript Skeleton */}
        <div className="flex-1 mx-4 mb-3 bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-800">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
            <div className="w-24 h-3 bg-neutral-700 rounded animate-pulse" />
          </div>
          <div className="flex-1 p-4 space-y-3">
            <div className="space-y-1">
              <div className="w-32 h-3 bg-neutral-700 rounded animate-pulse" />
              <div className="w-full h-4 bg-neutral-800 rounded animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="w-24 h-3 bg-neutral-700 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-neutral-800 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="px-4 pb-5">
          <div className="w-full py-3.5 bg-neutral-700 rounded-2xl animate-pulse" />
        </div>

        {/* Loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-neutral-900 rounded-2xl p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            <p className="text-neutral-300 text-sm">Loading your interview questions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Pre-rating screen
  if (phase === 'pre-rating') {
    return (
      <div className="w-full flex flex-col bg-neutral-950 min-h-screen">
        {loadingError && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 m-4 text-center">
            <p className="text-red-400 text-sm">{loadingError}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-red-400 text-xs underline mt-1"
            >
              Try again
            </button>
          </div>
        )}
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
              {confidenceLevels.map(({ score, emoji, label }) => (
                <button
                  key={score}
                  onClick={() => {
                    handlePreConfidenceSelect(score)
                    captureEvent('onboarding_pre_confidence_selected', {
                      step: 11,
                      score
                    })
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 group ${preConfidence === score
                    ? 'border-primary-500 bg-primary-900/30 scale-110'
                    : 'border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800'
                    }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors leading-tight text-center w-12">
                    {label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-600">Tap to select and continue</p>
          </div>
        </div>
      </div>
    );
  }

  // Feedback screen
  if (phase === 'feedback') {
    return (
      <div className="w-full flex flex-col bg-neutral-950 min-h-screen items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display font-bold text-2xl text-white mb-2">
            Interview Complete!
          </h2>
          <p className="text-neutral-400 mb-6">
            Great job answering all {questions.length} questions. Your feedback is ready.
          </p>
          <button
            onClick={() => {
              onContinue()
              captureEvent('onboarding_see_my_feedback_seen', {
                step: 11,
              })
            }}
            className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors"
          >
            See My Feedback →
          </button>
        </div>
      </div>
    );
  }

  // Interview screen with VapiAgent
  return (
    <div className="w-full flex flex-col bg-neutral-950 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-neutral-900 border-b border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src="/[favicon]-Prep-mirror-white-bg.png"
            alt="PrepMirrors"
            className="w-6 h-6 rounded-md opacity-80"
          />
          <span className="text-sm font-semibold text-white">PrepMirrors</span>
          {callActive && (
            <div className="flex items-center gap-1.5 ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400 font-medium">Live</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Q</span>
            <div className="flex gap-1">
              {[questions].map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-1.5 rounded-full transition-all duration-300 ${i < userAnswers.length
                    ? 'bg-secondary-500'
                    : i === userAnswers.length
                      ? 'bg-primary-500'
                      : 'bg-neutral-700'
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-400">
              {userAnswers.length + 1}/{questions.length}
            </span>
          </div>

          <Timer canCount={phase === "interview" && callActive} sessionTime={sessionTime} setSessionTime={setSessionTime} />

        </div>
      </div>

      {/* Video tiles */}
      <div className="flex-shrink-0 p-4 grid grid-cols-2 gap-3 md:gap-6 ">
        {/* AI Interviewer tile */}
        <div className={`relative bg-neutral-800 rounded-2xl  overflow-hidden aspect-[6/6] sm:aspect-[4/3] md:aspect-[7/3] ${isAiSpeaking && "border-2"}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-neutral-900/80 to-neutral-900" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div
              className={`relative w-16 h-16 lg:w-32 lg:h-32 rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${isAiSpeaking ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-neutral-800' : ''
                }`}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              <img src={AI_INTERVIEWER.avatar} alt="" className="rounded-full" />
              {isAiSpeaking && (
                <div className="absolute inset-0 rounded-full ring-4 ring-primary-500/40 animate-ping" />
              )}
            </div>
            {8 > 6 && (
              <div className="flex gap-0.5 items-end h-4">
                {[3, 6, 9, 12, 9, 6, 3].map((h, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-primary-400 rounded-full animate-pulse"
                    style={{ height: `${h}px`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="absolute bottom-2.5 left-2.5">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
              <p className="text-xs text-white font-medium">{AI_INTERVIEWER.name}</p>
            </div>
          </div>
          <div className="absolute top-2.5 right-2.5">
            {isAiSpeaking ? (
              <div className="flex items-center gap-1.5 bg-primary-500/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs text-white font-semibold">Speaking</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-neutral-700/80 backdrop-blur-sm rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span className="text-xs text-neutral-300 font-medium">Waiting</span>
              </div>
            )}
          </div>
        </div>

        {/* User tile */}
        <div className={`relative bg-neutral-800 rounded-2xl ${isUserSpeaking && 'border-2'} overflow-hidden aspect-[6/6] sm:aspect-[4/3] md:aspect-[7/3]`} >
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-700/50 to-neutral-900" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {
              profile?.avatar_url ?
                (<div
                  className={`relative w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-secondary-600 flex items-center justify-center text-2xl transition-all duration-300 ${isUserSpeaking ? 'ring-2 ring-secondary-400 ring-offset-2 ring-offset-neutral-800' : ''
                    }`}
                >
                  <img src={profile?.avatar_url} alt="" className="rounded-full w-full h-full" />
                  {isUserSpeaking && (
                    <div className="absolute inset-0 rounded-full ring-4 ring-secondary-400/40 animate-ping" />
                  )}
                </div>
                ) :
                (<div
                  className={`relative w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-secondary-500 flex items-center justify-center text-2xl transition-all duration-300 ${isUserSpeaking ? 'ring-2 ring-secondary-400 ring-offset-2 ring-offset-neutral-800' : ''
                    }`}
                >
                  {getInitials(profile.name)}
                  {isUserSpeaking && (
                    <div className="absolute inset-0 rounded-full ring-4 ring-secondary-500/40 animate-ping" />
                  )}
                </div>
                )
            }

            {isUserSpeaking && (
              <div className="flex gap-0.5 items-end h-4">
                {[4, 8, 12, 8, 4, 8, 12].map((h, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-secondary-500 rounded-full animate-pulse"
                    style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="absolute bottom-2.5 left-2.5">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
              <p className="text-xs text-white font-medium">{userName}</p>
            </div>
          </div>
          <div className="absolute top-2.5 right-2.5">
            {isUserSpeaking ? (
              <div className="flex items-center gap-1.5 bg-secondary-500/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs text-white font-semibold">Speaking</span>
              </div>
            ) : userAnswers.length > 0 ? (
              <div className="flex items-center gap-1.5 bg-secondary-700/80 backdrop-blur-sm rounded-full px-2.5 py-1">
                <CheckIcon className="w-2.5 h-2.5 text-secondary-300" />
                <span className="text-xs text-secondary-300 font-medium">Answered</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Live Transcript - Real-time updates */}


      <div
        className={`flex-1 mx-4 mb-3 bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col overflow-hidden max-h-[350px] sm:max-h-[280px] md:max-h-[300px] lg:max-h-[270px] ${processingAnswer && 'max-h-[150px] sm:max-h-[150px] md:max-h-[150px] lg:max-h-[150px]'}`}
        style={{ minHeight: '120px', }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-800 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Live Transcript
          </span>
        </div>
        <div ref={transcriptRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
          {transcriptMessages.length === 0 ? (
            <p className="text-xs text-neutral-600 italic text-center py-2">
              Transcript will appear here once the interview starts...
            </p>
          ) : (
            transcriptMessages.map((entry, idx) => (
              <div key={idx} className={`space-y-1 w-fit max-w-[70%] ${entry.role !== 'assistant' && 'ml-auto flex flex-col items-end'}`}>
                <p className={`text-xs font-semibold ${entry.role === 'assistant' ? 'text-primary-400' : 'text-secondary-400'}`}>
                  {entry.role === 'assistant' ? `${AI_INTERVIEWER.name} (Interviewer)` : `${userName} (You)`}
                </p>
                <p className={`text-sm text-neutral-300 bg-neutral-800 p-2 rounded-t-xl  leading-relaxed ${entry.role === "assistant" ? "rounded-br-xl" : "rounded-bl-xl"}`}>{entry.content}</p>
              </div>
            ))
          )}
          {/* Show typing indicator when AI is speaking but no transcript yet */}
          {callActive && isAiSpeaking && transcriptMessages.length > 0 &&
            transcriptMessages[transcriptMessages.length - 1]?.role !== 'assistant' && (
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-primary-400">{AI_INTERVIEWER.name} (Interviewer)</p>
                <p className="text-sm text-neutral-400 italic">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                    Speaking...
                  </span>
                </p>
              </div>
            )}
          {callActive && isUserSpeaking && transcriptMessages.length > 0 &&
            transcriptMessages[transcriptMessages.length - 1]?.role === 'assistant' && (
              <div className="space-y-0.5 ml-auto flex flex-col items-end">
                <p className="text-xs font-semibold text-primary-400">{userName} (You)</p>
                <p className="text-sm text-neutral-400 italic">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                    Speaking...
                  </span>
                </p>
              </div>
            )}
        </div>
      </div>

      {
        processingAnswer && (
          <div className="py-4 md:py-8 px-4 flex justify-center items-center flex-col ">
            <Loader2 className="animate-spin w-12 h-12 text-neutral-500" />
            <span className="text-xs text-neutral-500">Processing you answer...</span>
          </div>
        )
      }


      {/* Controls */}
      <div className="px-4 pb-5 flex-shrink-0 bg-neutral-950">
        {!callActive && transcriptMessages.length === 0 && !processingAnswer && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 bg-primary-900/40 border border-primary-800 rounded-xl px-4 py-2.5">
              <span className="text-base">🎤</span>
              <p className="text-primary-400 text-sm font-medium">
                Click the button below to start your interview
              </p>
            </div>
            <button
              disabled={startingCall}
              onClick={() => {
                startCall()
                captureEvent('onboarding_call_started', {
                  step: 11,
                  questions_count: questions.length,
                  job_target: jobTarget,
                })
              }}
              className="w-full py-3.5 disabled:bg-primary-500/40 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-4"
            >
              <Mic />
              {!startingCall ? "Start Interview →" : "Starting..."}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MockInterviewScreen;