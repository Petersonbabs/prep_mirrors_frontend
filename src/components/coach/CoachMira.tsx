// frontend/src/components/coach/CoachMira.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, MessageSquare, Bot } from 'lucide-react';
import { coachApi } from '../../lib/api/coach';
import { supabase } from '../../lib/supabase';

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
    questions?: string[];
    answers?: string[];
    transcript?: any[];
    onComplete: () => void;
    onBack?: () => void;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const SUGGESTIONS = [
    "How can I improve my communication?",
    "Can we practice the STAR method?",
    "What was my biggest mistake?",
    "Give me a practice question."
];

export default function CoachMira({ interviewPhase, companyName, feedback, questions, answers, transcript, onComplete, onBack }: CoachMiraProps) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setToken(data.session?.access_token || null);
        });
    }, []);

    useEffect(() => {
        if (sessionStarted && !sessionId && !isStarting) {
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
        setIsStarting(true);
        try {
            const response = await coachApi.startSession({
                interviewPhase,
                companyName,
                feedback,
                questions,
                answers,
                transcript,
            });

            setSessionId(response.sessionId);
            setMessages([{
                id: Date.now().toString(),
                role: 'assistant',
                content: response.message,
            }]);
        } catch (error) {
            console.error('Error starting coach session:', error);
        } finally {
            setIsStarting(false);
        }
    };

    const sendMessage = async (text: string) => {
        if (!text.trim() || !sessionId || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text.trim(),
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const assistantId = (Date.now() + 1).toString();
        const initialAssistantMsg: ChatMessage = {
            id: assistantId,
            role: 'assistant',
            content: '',
        };
        setMessages([...newMessages, initialAssistantMsg]);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/coach/session/${sessionId}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!res.ok || !res.body) {
                throw new Error('Failed to send message');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let assistantText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                assistantText += chunk;

                setMessages(prev =>
                    prev.map(m => (m.id === assistantId ? { ...m, content: assistantText } : m))
                );
            }
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (!isLoading) {
            sendMessage(suggestion);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
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
                            </div>
                        </div>
                    </div>
                ))}

                {(isLoading || isStarting) && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
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

            {/* Input Area with Suggestions */}
            <div className="border-t border-neutral-800 p-4 flex-shrink-0 flex flex-col gap-3">
                {/* Suggestions Row */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {SUGGESTIONS.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            disabled={isLoading}
                            className="whitespace-nowrap px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-700 rounded-full text-xs text-neutral-300 transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Ask Mira for help with specific questions..."
                        className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary-500 resize-none"
                        rows={1}
                        style={{ minHeight: '44px', maxHeight: '100px' }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading || isStarting}
                        className="w-10 h-10 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
                    >
                        <Send className="w-4 h-4 text-white" />
                    </button>
                </form>
                <p className="text-xs text-neutral-500 text-center">
                    Mira remembers your interview performance and gives personalized coaching
                </p>
            </div>
        </div>
    );
}