// frontend/src/components/interview/InterviewSession.tsx
import { useEffect, useState, useRef } from "react";
import { CheckIcon, Loader2, Mic } from "lucide-react";
import { useVapiAgent, CallStatus } from "../../lib/hooks/useVapiAgent";
import { interviewApi } from "../../lib/api/interview";
import { UserProfile } from "../../lib/types";
import { getInitials } from "../../utils/utils";
import Timer from "../ui/Timer";
import { BehavioralContext, buildTechnicalContext, TechnicalContext } from "../../lib/types/vapi.context";
import { companiesApi } from "../../lib/api/companies";
import { SessionPhase } from "../../lib/types/interview.types";
import { useAuth } from "../../lib/hooks/useAuth";

interface AIInterviewer {
  name: string;
  title: string;
  avatar: string;
}

interface InterviewSessionProps {
  sessionId?: string;
  companyId: string;
  companyName: string;
  phase: SessionPhase;
  questions: string[];
  user: UserProfile;
  onComplete: (data: {
    sessionId: string;
    answers: string[];
    transcript: Array<{ role: string; content: string }>;
    feedback?: any
  }) => void;
  onBack?: () => void;
}

const AI_INTERVIEWERS: Record<'technical_interview' | 'behavioral_interview', AIInterviewer> = {
  technical_interview: {
    name: 'Jordan Allen',
    title: 'Senior Engineering Manager',
    avatar: '/ai-technical-interviewer.png'
  },
  behavioral_interview: {
    name: 'Morgan Smith',
    title: 'HR Business Partner',
    avatar: '/ai-behavioral-interviewer.png'
  }
};

export default function InterviewSession({
  sessionId: existingSessionId,
  companyId,
  companyName,
  phase,
  questions,
  user,
  onComplete,
  onBack
}: InterviewSessionProps) {
  const [sessionId, setSessionId] = useState(existingSessionId || null);
  const [callActive, setCallActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [transcriptMessages, setTranscriptMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [processingAnswer, setProcessingAnswer] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [variableValues, setvariableValues] = useState<TechnicalContext | BehavioralContext | null>(null)
  const { user:userData} = useAuth();

  const transcriptRef = useRef<HTMLDivElement>(null);
  const userName = user?.name?.split(' ')[0] || 'You';
  const interviewer = AI_INTERVIEWERS[phase === "technical_interview" ? phase : "behavioral_interview"];
  const assistantId = phase === 'technical_interview'
    ? import.meta.env.VITE_VAPI_TECHNICAL_ASSISTANT_ID
    : import.meta.env.VITE_VAPI_BEHAVIORAL_ASSISTANT_ID;

    

  // Auto-scroll transcript on new messages
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcriptMessages]);

  // Real-time transcript update
  const handleTranscriptUpdate = (message: { role: string; content: string }) => {
    setTranscriptMessages(prev => [...prev, message]);

    // Track user answers
    if (message.role === 'user') {
      setUserAnswers(prev => [...prev, message.content]);
    }
  };


  const handleCallEnd = async (messages: Array<{ role: string; content: string }>) => {
    if (callEnded) return;
    setCallEnded(true);

    const conversation = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'interviewer' : 'user',
      content: msg.content
    }));

    const answers = conversation
      .filter(m => m.role === 'user')
      .map(m => m.content);

    setProcessingAnswer(true);

    try {
      let finalSessionId = sessionId;

      if (!finalSessionId) {
        // Create new session
        const response = await interviewApi.createSession({
          companyId,
          companyName,
          phase,
          questions,
          answers,
          transcript: conversation,
          userId: userData?.id as string
        });
        finalSessionId = response.sessionId;
        setSessionId(finalSessionId);

        // Update session phase
        await interviewApi.updateSession({
          sessionId: finalSessionId as string,
          phase: phase === "technical_interview" ? "technical_interview" : "behavioral_interview"
        });
      } else {
        // Update existing session with answers
        await interviewApi.completeSession(finalSessionId, {
          answers,
          transcript: conversation
        });
      }

      // ✅ GENERATE FEEDBACK AFTER SESSION IS SAVED
      await interviewApi.generateFeedback(finalSessionId as string);

      // Get the generated feedback
      const feedbackResponse = await interviewApi.getFeedback(finalSessionId as string);
      const feedback = feedbackResponse.data;

      // Store feedback in parent component via onComplete
      onComplete({
        sessionId: finalSessionId as string,
        answers,
        transcript: conversation,
        feedback
      });

    } catch (error) {
      
    } finally {
      setProcessingAnswer(false);
    }
  };

  const handleStatusChange = (status: CallStatus, speaking?: { isSpeaking: boolean; role?: string }) => {
    if (status === CallStatus.ACTIVE) {
      setCallActive(true);
    }
    if (status === CallStatus.FINISHED) {
      setCallActive(false);
    }

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

  const handleStartCall = async () => {
    setStartingCall(true)
    const feedback = await interviewApi.getLatestUserFeedback(user?.id as string)
    const { data: company } = await companiesApi.getCompanyDetails(companyId)
    let context = null
    if (phase === 'technical_interview') {
      context = buildTechnicalContext({
        company, user, strengths: feedback?.strengths,
        weaknesses: feedback?.improvements
      })
    } else {

    }

    startCall(context as TechnicalContext | BehavioralContext)
  }

  // VAPI HOOK
  const {
    callStatus,
    isSpeaking: agentIsSpeaking,
    isUserSpeaking: agentIsUserSpeaking,
    startCall,
    startingCall,
    setStartingCall
  } = useVapiAgent({
    assistantId,
    questions,
    userName,
    jobTarget: user?.targetRole || 'position',
    variableValues,
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

  // Loading state
  if (!questions.length) {
    return (
      <div className="w-full flex flex-col bg-neutral-950 min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-neutral-400 mt-4">Loading interview questions...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-neutral-950 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-neutral-900 border-b border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button onClick={onBack} className="text-neutral-400 hover:text-white transition-colors">
              ← Back
            </button>
          )}
          <img
            src="/[favicon]-Prep-mirror-white-bg.png"
            alt="PrepMirrors"
            className="w-6 h-6 rounded-md opacity-80"
          />
          <span className="text-sm font-semibold text-white">{companyName}</span>
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
              {questions.map((_, i) => (
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
          <Timer canCount={callActive} sessionTime={sessionTime} setSessionTime={setSessionTime} />
        </div>
      </div>

      {/* Video tiles */}
      <div className="flex-shrink-0 p-4 grid grid-cols-2 gap-3 md:gap-6">
        {/* AI Interviewer tile */}
        <div className={`relative bg-neutral-800 rounded-2xl overflow-hidden aspect-[6/6] sm:aspect-[4/3] md:aspect-[7/3] ${isAiSpeaking && "border-2 border-primary-500"}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-neutral-900/80 to-neutral-900" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div
              className={`relative w-16 h-16 lg:w-32 lg:h-32 rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${isAiSpeaking ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-neutral-800' : ''
                }`}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              <img src={interviewer.avatar} alt="" className="rounded-full w-full h-full object-cover" />
              {isAiSpeaking && (
                <div className="absolute inset-0 rounded-full ring-4 ring-primary-500/40 animate-ping" />
              )}
            </div>
            {isAiSpeaking && (
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
              <p className="text-xs text-white font-medium">{interviewer.name}</p>
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
        <div className={`relative bg-neutral-800 rounded-2xl ${isUserSpeaking && 'border-2 border-secondary-500'} overflow-hidden aspect-[6/6] sm:aspect-[4/3] md:aspect-[7/3]`}>
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-700/50 to-neutral-900" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {user?.avatar_url ? (
              <div
                className={`relative w-16 h-16 lg:w-32 lg:h-32 rounded-full transition-all duration-300 ${isUserSpeaking ? 'ring-2 ring-secondary-400 ring-offset-2 ring-offset-neutral-800' : ''
                  }`}
              >
                <img src={user.avatar_url} alt="" className="rounded-full w-full h-full object-cover" />
                {isUserSpeaking && (
                  <div className="absolute inset-0 rounded-full ring-4 ring-secondary-400/40 animate-ping" />
                )}
              </div>
            ) : (
              <div
                className={`relative w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-secondary-500 flex items-center justify-center text-2xl transition-all duration-300 ${isUserSpeaking ? 'ring-2 ring-secondary-400 ring-offset-2 ring-offset-neutral-800' : ''
                  }`}
              >
                {getInitials(user?.name || userName)}
                {isUserSpeaking && (
                  <div className="absolute inset-0 rounded-full ring-4 ring-secondary-500/40 animate-ping" />
                )}
              </div>
            )}
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

      {/* Live Transcript */}
      <div
        className="flex-1 mx-4 mb-3 bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col overflow-hidden max-h-[350px] sm:max-h-[280px] md:max-h-[300px] lg:max-h-[270px]"
        style={{ minHeight: '120px' }}
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
                  {entry.role === 'assistant' ? `${interviewer.name} (Interviewer)` : `${userName} (You)`}
                </p>
                <p className={`text-sm text-neutral-300 bg-neutral-800 p-2 rounded-t-xl leading-relaxed ${entry.role === "assistant" ? "rounded-br-xl" : "rounded-bl-xl"}`}>
                  {entry.content}
                </p>
              </div>
            ))
          )}
          {/* Show typing indicator when AI is speaking but no transcript yet */}
          {callActive && isAiSpeaking && transcriptMessages.length > 0 &&
            transcriptMessages[transcriptMessages.length - 1]?.role !== 'assistant' && (
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-primary-400">{interviewer.name} (Interviewer)</p>
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

      {/* Processing indicator */}
      {processingAnswer && (
        <div className="py-4 md:py-8 px-4 flex justify-center items-center flex-col">
          <Loader2 className="animate-spin w-12 h-12 text-neutral-500" />
          <span className="text-xs text-neutral-500">Processing your answers...</span>
        </div>
      )}

      {/* Controls */}
      <div className="px-4 pb-5 flex-shrink-0 bg-neutral-950">
        {!callActive && transcriptMessages.length === 0 && !processingAnswer && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 bg-primary-900/40 border border-primary-800 rounded-xl px-4 py-2.5">
              <span className="text-base">🎤</span>
              <p className="text-primary-400 text-sm font-medium">
                Click the button below to start your {phase == 'behavioral_interview' ? 'behavioral' : 'technical'} interview
              </p>
            </div>
            <button
              disabled={startingCall}
              onClick={handleStartCall}
              className="w-full py-3.5 disabled:bg-primary-500/40 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-4"
            >
              <Mic />
              {!startingCall ? `Start ${phase === 'technical_interview' ? 'Technical' : 'Behavioral'} Interview →` : "Starting..."}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}