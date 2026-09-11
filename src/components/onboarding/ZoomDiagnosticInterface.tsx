import React, { useState, useEffect } from 'react';
import {
    MicIcon,
    MicOffIcon,
    VideoIcon,
    VideoOffIcon,
    MessageSquareIcon,
    SparklesIcon,
    ArrowRightIcon,
    CheckCircle2Icon,
    Volume2Icon,
    ClockIcon,
    BriefcaseIcon,
    Building2Icon,
    PlayIcon,
    PhoneOffIcon,
    MaximizeIcon,
    UsersIcon
} from 'lucide-react';
import Vapi from '@vapi-ai/web';

export interface IntakeData {
    name: string;
    role: string;
    company: string;
    timelineDays: number;
}

interface ZoomDiagnosticInterfaceProps {
    onCompleteIntake: (data: IntakeData) => void;
    onFinishDiagnosticSession: (userTranscript: string) => void;
    isProcessingScore: boolean;
}

const POPULAR_ROLES = [
    'Software Engineer',
    'Product Manager',
    'Frontend Developer',
    'Data Scientist',
    'Product Designer',
    'DevOps Engineer'
];

const POPULAR_COMPANIES = [
    'Google',
    'Amazon',
    'Meta',
    'Stripe',
    'Microsoft',
    'Startup / Other'
];

const TIMELINE_OPTIONS = [
    { label: '⚡ Within 7 Days', days: 7 },
    { label: '📅 Within 14 Days', days: 14 },
    { label: '🗓️ Within 1 Month', days: 30 },
    { label: '🔍 Just Exploring', days: 60 }
];

export const ZoomDiagnosticInterface: React.FC<ZoomDiagnosticInterfaceProps> = ({
    onCompleteIntake,
    onFinishDiagnosticSession,
    isProcessingScore
}) => {
    const [step, setStep] = useState<'INIT' | 'QUESTION_ROLE' | 'QUESTION_COMPANY' | 'QUESTION_TIMELINE' | 'DIAGNOSTIC_SESSION'>('INIT');

    const [userName, setUserName] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedTimeline, setSelectedTimeline] = useState<number>(7);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isTextMode, setIsTextMode] = useState(false);
    const [typedAnswer, setTypedAnswer] = useState('');
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [aiSpeechText, setAiSpeechText] = useState("Click 'Start Interview' to begin your AI diagnostic session.");
    const [diagnosticTimer, setDiagnosticTimer] = useState(60);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);

    const speakText = (text: string, onEndCallback?: () => void) => {
        setAiSpeechText(text);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.onstart = () => setIsAiSpeaking(true);
            utterance.onend = () => {
                setIsAiSpeaking(false);
                if (onEndCallback) onEndCallback();
            };
            utterance.onerror = () => setIsAiSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    // Elapsed time counter (like Zoom recording timer)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSessionActive) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSessionActive]);

    // Diagnostic countdown
    useEffect(() => {
        let timerInterval: NodeJS.Timeout;
        if (step === 'DIAGNOSTIC_SESSION' && diagnosticTimer > 0) {
            timerInterval = setInterval(() => {
                setDiagnosticTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [step, diagnosticTimer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleInitiateInterview = () => {
        setStep('QUESTION_ROLE');
        setIsSessionActive(true);
        speakText("Hi! Welcome to PrepMirrors. I'm going to ask you a couple of questions to prepare the best interview for you. First, what target role are you interviewing for?");
    };

    const handleRoleSelected = (role: string) => {
        setSelectedRole(role);
        setStep('QUESTION_COMPANY');
        speakText(`Got it, ${role}. Which target company are you interviewing at?`);
    };

    const handleCompanySelected = (company: string) => {
        setSelectedCompany(company);
        setStep('QUESTION_TIMELINE');
        speakText(`Awesome, ${company}! When is your target interview date?`);
    };

    const handleTimelineSelected = (days: number) => {
        setSelectedTimeline(days);
        onCompleteIntake({
            name: userName || 'Candidate',
            role: selectedRole,
            company: selectedCompany,
            timelineDays: days
        });
        setStep('DIAGNOSTIC_SESSION');
        speakText(`Perfect. Let's begin your 60-second diagnostic interview. Tell me about a challenging project you led at work. How did you structure your approach and what was the quantifiable impact?`);
    };

    const handleFinishSession = () => {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (vapiInstance) vapiInstance.stop();
        setIsSessionActive(false);
        const finalAnswer = typedAnswer || "I led the microservice refactoring team to reduce API latency by 40% using Datadog and GraphQL caching.";
        onFinishDiagnosticSession(finalAnswer);
    };

    return (
        <div className="w-full h-full flex flex-col  rounded-2xl overflow-hidden shadow-2xl text-white font-sans">

            {/* ─── Main Video Tiles Area ─── */}
            <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3 overflow-hidden">

                {/* Two main video tiles */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[250px]">

                    {/* AI Interviewer Tile */}
                    <div className="relative bg-[#2d2d2d] rounded-xl overflow-hidden flex flex-col items-center justify-center group">
                        {/* Fullscreen icon */}
                        <button className="absolute top-3 right-3 z-10 text-white/40 hover:text-white/80 transition-opacity opacity-0 group-hover:opacity-100">
                            <MaximizeIcon className="w-4 h-4" />
                        </button>

                        {/* Active speaker border glow */}
                        {isAiSpeaking && (
                            <div className="absolute inset-0 rounded-xl border-2 border-primary-500 pointer-events-none z-10" />
                        )}

                        {/* AI Avatar */}
                        <div className="relative flex flex-col items-center gap-3">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                                <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" />
                            </div>

                            {isAiSpeaking && (
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-primary-400 rounded-full animate-pulse"
                                            style={{
                                                height: `${8 + Math.random() * 16}px`,
                                                animationDelay: `${i * 0.1}s`,
                                                animationDuration: `${0.4 + Math.random() * 0.3}s`
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Name label */}
                        <span className="absolute bottom-3 left-3 text-xs font-medium text-white/90 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-sm">
                            AI Interviewer
                        </span>

                        {/* Speech bubble overlay */}
                        <div className="absolute bottom-12 left-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-xs text-white/90 leading-relaxed max-h-[100px] overflow-y-auto">
                            "{aiSpeechText}"
                        </div>
                    </div>

                    {/* Candidate Tile */}
                    <div className="relative bg-[#2d2d2d] rounded-xl overflow-hidden flex flex-col items-center justify-center group">
                        <button className="absolute top-3 right-3 z-10 text-white/40 hover:text-white/80 transition-opacity opacity-0 group-hover:opacity-100">
                            <MaximizeIcon className="w-4 h-4" />
                        </button>

                        {isVideoOn ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                                    <span className="text-2xl sm:text-3xl font-bold text-white/60">
                                        {userName ? userName.charAt(0).toUpperCase() : '👤'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                                    <VideoOffIcon className="w-8 h-8 text-white/40" />
                                </div>
                            </div>
                        )}

                        <span className="absolute bottom-3 left-3 text-xs font-medium text-white/90 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-sm">
                            {userName || 'You'}{selectedRole ? ` · ${selectedRole}` : ''}
                        </span>

                        {/* Floating STAR hints during diagnostic */}
                        {step === 'DIAGNOSTIC_SESSION' && (
                            <div className="absolute bottom-12 left-3 right-3 bg-black/80 backdrop-blur-sm border border-primary-500/30 rounded-lg p-3 text-left">
                                <div className="flex items-center gap-1.5 text-primary-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                                    <SparklesIcon className="w-3 h-3" />
                                    <span>STAR Hints</span>
                                </div>
                                <p className="text-[11px] text-white/70 leading-relaxed">
                                    • <strong className="text-white/90">S:</strong> State problem & scope<br />
                                    • <strong className="text-white/90">A:</strong> Use "I" for your contribution<br />
                                    • <strong className="text-white/90">R:</strong> Quantify impact (%, $)
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Interactive Content Area (Chips / Text input) — sits below video tiles */}
                <div className="shrink-0">
                    {step === 'INIT' && (
                        <div className="flex flex-col items-center justify-center py-6 space-y-4">
                            <h3 className="text-lg sm:text-xl font-bold text-white text-center">
                                Ready for your 60-second AI diagnostic interview?
                            </h3>
                            <p className="text-xs text-white/50 max-w-md text-center">
                                The AI interviewer will greet you, gather your details, and run a quick diagnostic mock session.
                            </p>
                            <button
                                onClick={handleInitiateInterview}
                                className="flex items-center gap-2.5 px-7 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-sm shadow-lg transition-all">
                                <PlayIcon className="w-4 h-4 fill-current" />
                                <span>Start Interview</span>
                            </button>
                        </div>
                    )}

                    {step === 'QUESTION_ROLE' && (
                        <div className="space-y-2 py-2 animate-slide-up">
                            <p className="text-xs font-semibold uppercase tracking-wider text-primary-400 flex items-center gap-1.5">
                                <BriefcaseIcon className="w-3.5 h-3.5" /> Select Target Role
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_ROLES.map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => handleRoleSelected(role)}
                                        className="px-3.5 py-2 bg-[#3a3a3a] hover:bg-primary-600 text-white/80 hover:text-white text-xs font-medium rounded-lg transition-all border border-white/5 hover:border-primary-500">
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'QUESTION_COMPANY' && (
                        <div className="space-y-2 py-2 animate-slide-up">
                            <p className="text-xs font-semibold uppercase tracking-wider text-secondary-400 flex items-center gap-1.5">
                                <Building2Icon className="w-3.5 h-3.5" /> Select Target Company
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_COMPANIES.map((comp) => (
                                    <button
                                        key={comp}
                                        onClick={() => handleCompanySelected(comp)}
                                        className="px-3.5 py-2 bg-[#3a3a3a] hover:bg-secondary-600 text-white/80 hover:text-white text-xs font-medium rounded-lg transition-all border border-white/5 hover:border-secondary-500">
                                        {comp}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'QUESTION_TIMELINE' && (
                        <div className="space-y-2 py-2 animate-slide-up">
                            <p className="text-xs font-semibold uppercase tracking-wider text-accent-400 flex items-center gap-1.5">
                                <ClockIcon className="w-3.5 h-3.5" /> When is your interview?
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {TIMELINE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.days}
                                        onClick={() => handleTimelineSelected(opt.days)}
                                        className="p-3 bg-[#3a3a3a] hover:bg-[#4a4a4a] border border-white/5 hover:border-accent-500 rounded-lg text-left transition-all">
                                        <p className="text-xs font-semibold text-white/90">{opt.label}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'DIAGNOSTIC_SESSION' && isTextMode && (
                        <div className="flex gap-2 py-2 animate-slide-up">
                            <input
                                type="text"
                                placeholder="Type your answer here..."
                                value={typedAnswer}
                                onChange={(e) => setTypedAnswer(e.target.value)}
                                className="flex-1 bg-[#2d2d2d] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary-500"
                            />
                            <button
                                onClick={handleFinishSession}
                                className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg text-sm transition-colors">
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Bottom Bar: Recording Indicator + Controls ─── */}
            <div className="shrink-0 bg-[#1a1a1a] border-t border-white/5 px-4 sm:px-6 py-3 flex items-center justify-between">

                {/* Left: Recording indicator */}
                <div className="flex items-center gap-2 min-w-[140px]">
                    {isSessionActive && (
                        <>
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-mono text-white/70">
                                Recording {formatTime(elapsedTime)}
                            </span>
                        </>
                    )}
                </div>

                {/* Center: Control buttons (Zoom-style circular) */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Chat / Type toggle */}
                    <button
                        onClick={() => setIsTextMode(!isTextMode)}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors ${isTextMode
                                ? 'bg-primary-500 text-white'
                                : 'bg-[#3a3a3a] text-white/70 hover:bg-[#4a4a4a] hover:text-white'
                            }`}
                        title="Toggle Text Input">
                        <MessageSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Participants */}
                    <button
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#3a3a3a] text-white/70 hover:bg-[#4a4a4a] hover:text-white flex items-center justify-center transition-colors"
                        title="Participants">
                        <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Mic toggle */}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors ${isMuted
                                ? 'bg-red-500/90 text-white'
                                : 'bg-[#3a3a3a] text-white/70 hover:bg-[#4a4a4a] hover:text-white'
                            }`}
                        title={isMuted ? 'Unmute' : 'Mute'}>
                        {isMuted ? <MicOffIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>

                    {/* Video toggle */}
                    <button
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors ${!isVideoOn
                                ? 'bg-red-500/90 text-white'
                                : 'bg-[#3a3a3a] text-white/70 hover:bg-[#4a4a4a] hover:text-white'
                            }`}
                        title={isVideoOn ? 'Stop Video' : 'Start Video'}>
                        {!isVideoOn ? <VideoOffIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>

                    {/* End / Complete call */}
                    {step === 'DIAGNOSTIC_SESSION' ? (
                        <button
                            disabled={isProcessingScore}
                            onClick={handleFinishSession}
                            className="h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
                            title="End & Get Score">
                            <PhoneOffIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">{isProcessingScore ? 'Scoring...' : 'End & Score'}</span>
                        </button>
                    ) : step !== 'INIT' ? (
                        <button
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors opacity-40 cursor-not-allowed"
                            disabled
                            title="Complete intake to enable">
                            <PhoneOffIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    ) : null}
                </div>

                {/* Right: Settings placeholder */}
                <div className="flex items-center justify-end min-w-[140px]">
                    {step === 'DIAGNOSTIC_SESSION' && (
                        <div className="flex items-center gap-1.5 bg-[#2d2d2d] px-3 py-1.5 rounded-full text-xs text-white/60">
                            <ClockIcon className="w-3 h-3 text-primary-400" />
                            <span className="font-mono">00:{diagnosticTimer < 10 ? '0' : ''}{diagnosticTimer}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ZoomDiagnosticInterface;
