// frontend/src/components/coach/CoachMira.tsx
import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, MessageSquare, Bot } from 'lucide-react';
import { coachApi } from '../../lib/api/coach';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface FeedbackData {
    overall_score: number;
    category_scores: {
        communication: number;
        technical_accuracy: number;
        problem_solving: number;
        clarity: number;
        confidence: number;
    };
    strengths: string[];
    improvements: string[];
    weakest_area?: string;
    suggested_practice?: string;
}

interface CoachMiraProps {
    interviewPhase: 'technical' | 'behavioral';
    companyName?: string;
    feedback?: FeedbackData;
    onComplete: () => void;
    onBack?: () => void;
}

export default function CoachMira({ interviewPhase, companyName, feedback, onComplete, onBack }: CoachMiraProps) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sessionStarted && !sessionId) {
            startCoachSession();
        }
    }, [sessionStarted]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const startCoachSession = async () => {
        setIsLoading(true);
        try {
            const response = await coachApi.startSession({
                interviewPhase,
                companyName,
                feedback,
            });

            setSessionId(response.sessionId);
            setMessages([{
                id: Date.now().toString(),
                role: 'assistant',
                content: response.message,
                timestamp: new Date().toISOString(),
            }]);
        } catch (error) {
            console.error('Error starting coach session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !sessionId) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await coachApi.sendMessage(sessionId, input);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.message,
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleStart = () => {
        setSessionStarted(true);
    };

    if (!sessionStarted) {
        const weakestArea = feedback?.weakest_area || (feedback?.category_scores ?
            Object.entries(feedback.category_scores).reduce((a, b) => a[1] < b[1] ? a : b)[0] : null);

        const score = feedback?.overall_score ||
            (feedback?.category_scores ?
                Object.values(feedback.category_scores).reduce((a, b) => a + b, 0) / 5 : null);

        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="relative inline-flex mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Bot className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    <h1 className="font-display font-bold text-3xl text-white mb-3">
                        Meet Your Coach, Mira
                    </h1>

                    <p className="text-neutral-400 mb-6 leading-relaxed">
                        I'm Mira, your personal AI interview coach. I've analyzed your {interviewPhase} interview
                        {score && ` and noticed you scored ${Math.round(score * 20)}/100 overall`}.
                        {weakestArea && ` Your biggest opportunity is in ${weakestArea.replace('_', ' ')}.`}
                    </p>

                    <div className="bg-neutral-800/50 rounded-xl p-4 mb-6 text-left">
                        <p className="text-sm text-neutral-300 italic">
                            "I'll help you improve with targeted practice and personalized tips.
                            Let's work together to make your next interview your best one."
                        </p>
                        <p className="text-xs text-primary-400 mt-2">— Mira</p>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Start Coaching Session
                    </button>

                    <button
                        onClick={onComplete}
                        className="w-full mt-3 py-3 text-neutral-500 hover:text-neutral-400 transition-colors text-sm"
                    >
                        Skip for now →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-neutral-900 border-b border-neutral-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button onClick={onBack} className="text-neutral-400 hover:text-white transition-colors">
                            ← Back
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Coach Mira</p>
                            <p className="text-xs text-neutral-500">AI Interview Coach</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onComplete}
                    className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                    End Session
                </button>
            </div>

            {/* Coach Persona Bar */}
            <div className="bg-primary-500/10 border-b border-primary-500/20 px-5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-400" />
                    <span className="text-xs text-primary-400">Personalized coaching based on your interview</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-neutral-500">Online</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.role === 'user'
                                    ? 'bg-secondary-500'
                                    : 'bg-gradient-to-br from-primary-500 to-secondary-500'
                                }`}>
                                {message.role === 'user' ? (
                                    <span className="text-white text-sm font-medium">You</span>
                                ) : (
                                    <Bot className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div className={`p-3 rounded-2xl ${message.role === 'user'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-neutral-800 text-neutral-200'
                                }`}>
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs opacity-60 mt-1">
                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-neutral-800 rounded-2xl p-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-neutral-800 p-4 flex-shrink-0">
                <div className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask Mira for help with specific questions..."
                        className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary-500 resize-none"
                        rows={1}
                        style={{ minHeight: '44px', maxHeight: '100px' }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading || isTyping}
                        className="w-10 h-10 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
                    >
                        <Send className="w-4 h-4 text-white" />
                    </button>
                </div>
                <p className="text-xs text-neutral-500 mt-2 text-center">
                    Mira remembers your interview performance and gives personalized coaching
                </p>
            </div>
        </div>
    );
}