import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowLeftIcon,
  SendIcon,
  RefreshCwIcon,
  HomeIcon,
  SparklesIcon,
  MicIcon,
  ThumbsUpIcon,
  BookOpenIcon } from
'lucide-react';
interface CoachPageProps {
  feedbackData: {
    question: string;
    answer: string;
  };
  onBack: () => void;
  onDashboard: () => void;
}
interface Message {
  id: string;
  role: 'coach' | 'user';
  content: string;
  timestamp: Date;
}
const INITIAL_MESSAGES: Message[] = [
{
  id: '1',
  role: 'coach',
  content:
  "Hey! I'm Aria, your AI interview coach 🌟 I've reviewed your answer and I'm here to help you level it up. Let's work through this together — no pressure, just learning!",
  timestamp: new Date()
},
{
  id: '2',
  role: 'coach',
  content:
  'Your answer showed good foundational knowledge. The main area we can strengthen is adding specific complexity analysis and concrete examples. Want me to explain why this matters to interviewers?',
  timestamp: new Date()
}];

const QUICK_REPLIES = [
'Yes, explain why complexity matters',
'Show me a better answer structure',
'Give me a practice question',
'What should I focus on next?'];

const COACH_RESPONSES: Record<string, string> = {
  'Yes, explain why complexity matters':
  "Great question! Interviewers ask about time/space complexity because it shows you can think about scalability. A solution that works for 10 items might fail with 10 million. When you mention O(n) or O(log n), you're demonstrating that you think like an engineer, not just a coder. Try adding: 'This approach has O(n) time complexity and O(1) space complexity, which makes it efficient for large datasets.'",
  'Show me a better answer structure':
  "Here's a winning structure for technical questions:\n\n1️⃣ **Clarify** — Repeat the question and confirm your understanding\n2️⃣ **Approach** — Explain your strategy before coding\n3️⃣ **Implement** — Walk through your solution step by step\n4️⃣ **Analyze** — State the time/space complexity\n5️⃣ **Test** — Walk through an example to verify\n\nThis shows systematic thinking that senior engineers love to see!",
  'Give me a practice question':
  "Here's a similar question to practice:\n\n*'Explain the difference between an array and a linked list. When would you choose one over the other?'*\n\nTry answering it using the structure I showed you. Focus on: definition, key differences, time complexities, and real-world use cases. Take your time — I'll give you feedback when you're ready!",
  'What should I focus on next?':
  "Based on your performance, here's your personalized improvement plan:\n\n🎯 **Priority 1:** Practice explaining complexity (Big-O notation)\n🎯 **Priority 2:** Add concrete examples to every answer\n🎯 **Priority 3:** Work on system design fundamentals\n\nI'd recommend doing 2-3 practice sessions this week focusing on data structures. Your confidence is already showing — let's sharpen the technical depth!"
};
export function CoachPage({
  feedbackData,
  onBack,
  onDashboard
}: CoachPageProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tryAgainMode, setTryAgainMode] = useState(false);
  const [tryAgainAnswer, setTryAgainAnswer] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isTyping]);
  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const responseText =
    COACH_RESPONSES[content.trim()] ||
    "That's a great point to explore! Let me think about the best way to help you with this. The key is to practice consistently and build on each session. Would you like me to give you a specific exercise to work on this area?";
    setTimeout(
      () => {
        const coachMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'coach',
          content: responseText,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, coachMsg]);
        setIsTyping(false);
      },
      1200 + Math.random() * 800
    );
  };
  const handleTryAgain = () => {
    setTryAgainMode(true);
    const msg: Message = {
      id: Date.now().toString(),
      role: 'coach',
      content:
      "Awesome! Let's try again. Here's the original question:\n\n*\"" +
      feedbackData.question +
      "\"*\n\nTake your time and apply what we've discussed. I'll give you detailed feedback on your improved answer!",
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, msg]);
  };
  const handleSubmitTryAgain = () => {
    if (tryAgainAnswer.trim().length < 10) return;
    sendMessage(tryAgainAnswer);
    setTryAgainAnswer('');
    setTryAgainMode(false);
    setTimeout(() => {
      const feedbackMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'coach',
        content:
        "🎉 Excellent improvement! I can see you've applied the structure we discussed. Your answer is now much more complete. You mentioned the key concepts clearly and added context that shows real understanding.\n\nScore improvement: 78 → 91 (+13 points) 📈\n\nYou're ready to ace this question in a real interview. Keep practicing!",
        timestamp: new Date()
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, feedbackMsg]);
        setIsTyping(false);
      }, 1500);
    }, 1200);
  };
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">

            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Feedback</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-display font-bold">
              A
            </div>
            <div>
              <p className="font-display font-semibold text-sm text-neutral-900 dark:text-white">
                Aria
              </p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                <p className="text-xs text-secondary-600 dark:text-secondary-400">
                  AI Coach · Online
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onDashboard}
            className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">

            <HomeIcon className="w-4 h-4" />
            <span className="hidden sm:block">Dashboard</span>
          </button>
        </div>
      </div>

      {/* Context banner */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border-b border-primary-100 dark:border-primary-800 px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start gap-2">
            <BookOpenIcon className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                Reviewing your answer to:
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5 line-clamp-2">
                "{feedbackData.question}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) =>
          <div
            key={msg.id}
            className={`flex gap-3 chat-bubble ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>

              {msg.role === 'coach' &&
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0 mt-1">
                  A
                </div>
            }
              <div
              className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>

                <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === 'coach' ? 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-100 dark:border-neutral-700 rounded-tl-sm' : 'bg-primary-500 text-white rounded-tr-sm'}`}>

                  {msg.content}
                </div>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 px-1">
                  {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                </span>
              </div>
            </div>
          )}

          {isTyping &&
          <div className="flex gap-3 chat-bubble">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
                A
              </div>
              <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1 items-center">
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
              </div>
            </div>
          }
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick replies */}
      {messages.length <= 3 && !isTyping &&
      <div className="px-4 sm:px-6 py-3 flex-shrink-0">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-2">
              Quick replies:
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply) =>
            <button
              key={reply}
              onClick={() => sendMessage(reply)}
              className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-full hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">

                  {reply}
                </button>
            )}
            </div>
          </div>
        </div>
      }

      {/* Try again section */}
      {!tryAgainMode && !isTyping && messages.length > 2 &&
      <div className="px-4 sm:px-6 py-3 flex-shrink-0 border-t border-neutral-100 dark:border-neutral-800">
          <div className="max-w-2xl mx-auto">
            <button
            onClick={handleTryAgain}
            className="w-full flex items-center justify-center gap-2 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-xl transition-colors text-sm">

              <RefreshCwIcon className="w-4 h-4" />
              <span>Try the question again</span>
            </button>
          </div>
        </div>
      }

      {/* Try again input */}
      {tryAgainMode &&
      <div className="px-4 sm:px-6 py-4 bg-white dark:bg-neutral-800 border-t border-neutral-100 dark:border-neutral-700 flex-shrink-0">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
              Your improved answer:
            </p>
            <textarea
            value={tryAgainAnswer}
            onChange={(e) => setTryAgainAnswer(e.target.value)}
            placeholder="Type your improved answer here..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 resize-none transition-colors text-sm mb-2" />

            <button
            onClick={handleSubmitTryAgain}
            disabled={tryAgainAnswer.trim().length < 10}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${tryAgainAnswer.trim().length >= 10 ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}>

              Submit Improved Answer
            </button>
          </div>
        </div>
      }

      {/* Chat input */}
      {!tryAgainMode &&
      <div className="bg-white dark:bg-neutral-800 border-t border-neutral-100 dark:border-neutral-700 px-4 sm:px-6 py-4 flex-shrink-0">
          <div className="max-w-2xl mx-auto flex gap-3">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
            e.key === 'Enter' && !e.shiftKey && sendMessage(input)
            }
            placeholder="Ask Aria anything about your answer..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 transition-colors text-sm" />

            <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${input.trim() && !isTyping ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}>

              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      }
    </div>);

}