"use client";

import { useState, useEffect } from "react";
import { vapi } from "../../lib/vapi.sdk";

export enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface UseVapiAgentProps {
    assistantId: string;
    questions?: string[];
    userName?: string;
    jobTarget?: string;
    onCallEnd: (messages: Message[]) => void;
    onStatusChange?: (status: CallStatus, speaking?: { isSpeaking: boolean; role?: string }) => void;
    onTranscriptUpdate?: (message: Message) => void;
}

export function useVapiAgent({
    assistantId,
    questions,
    userName,
    jobTarget,
    onCallEnd,
    onStatusChange,
    onTranscriptUpdate
}: UseVapiAgentProps) {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastMessage, setLastMessage] = useState("");
    const [startingCall, setStartingCall] = useState(false)

    // Format questions for Vapi variables
    const formattedQuestions = questions?.map(q => `- ${q}`).join("\n");

    // Vapi event listeners
    useEffect(() => {
        const onCallStart = () => {
            setCallStatus(CallStatus.ACTIVE);
            onStatusChange?.(CallStatus.ACTIVE);
            setStartingCall(false)
        };

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            onStatusChange?.(CallStatus.FINISHED);
        };

        const onMessage = (message: any) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = {
                    role: message.role as "user" | "assistant",
                    content: message.transcript
                };
                setMessages(prev => [...prev, newMessage]);
                setLastMessage(message.transcript);
                onTranscriptUpdate?.(newMessage);
            }
        };

        const onSpeechStart = () => {
            setIsSpeaking(true);
            onStatusChange?.(callStatus, { isSpeaking: true, role: 'assistant' });
        };

        const onSpeechEnd = () => {
            setIsSpeaking(false);
            onStatusChange?.(callStatus, { isSpeaking: false, role: 'assistant' });
        };

        const onError = (error: Error) => {
            setStartingCall(false)
            console.error("Vapi error:", error)
        }

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, [onStatusChange, onTranscriptUpdate, callStatus]);

    // Handle call end and trigger feedback
    useEffect(() => {
        if (callStatus === CallStatus.FINISHED && messages.length > 0) {
            onCallEnd(messages);
        }
    }, [callStatus, messages]);

    const startCall = async () => {
        setStartingCall(true)
        setCallStatus(CallStatus.CONNECTING);
        onStatusChange?.(CallStatus.CONNECTING);

        await vapi.start(assistantId, {
            variableValues: {
                questions: formattedQuestions,
                name: userName,
                jobTarget: jobTarget,
            }
        });
    };

    const endCall = () => {
        vapi.stop();
        setCallStatus(CallStatus.FINISHED);
    };

    return {
        callStatus,
        isSpeaking,
        lastMessage,
        messages,
        startingCall,
        startCall,
        endCall,
    };
}