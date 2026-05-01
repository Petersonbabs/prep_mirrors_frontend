// frontend/src/components/quick-interview/QuickInterviewModal.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Volume2 } from 'lucide-react';
import { vapiService } from '../../services/vapiService';
import toast from 'react-hot-toast';
import FeedbackDisplay from '../home/feedback/FeedbackDisplay';
import { Feedback } from '../../lib/types';
import { interviewApi } from '../../lib/api/interview';

type Step = 'collect' | 'generating' | 'interview' | 'feedback';

interface QuickInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (data: { name: string; jobTarget: string; tempUserId: string }) => void;
}

// Animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const stepVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 20, stiffness: 300 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.15 } }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const pulseVariants = {
  idle: { scale: 1 },
  recording: {
    scale: [1, 1.1, 1],
    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
  }
};

const scoreCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 200 }
  })
};

export default function QuickInterviewModal({ isOpen, onClose, onContinue }: QuickInterviewModalProps) {
  const [step, setStep] = useState<Step>('collect');
  const [name, setName] = useState('');
  const [jobTarget, setJobTarget] = useState('');
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [avgScore, setAvgScore] = useState(0);

  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState('');
  const [userTranscript, setUserTranscript] = useState('');
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const transcriptRef = useRef('');

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isCallActive) {
        vapiService.stopInterview();
      }
    };
  }, []);

  const resetState = () => {
    setStep('collect');
    setName('');
    setJobTarget('');
    setTempUserId(null);
    setQuestion('');
    setFeedback(null);
    setAvgScore(0);
    setIsCallActive(false);
    setCallStatus('');
    setUserTranscript('');
    transcriptRef.current = '';
  };

  // Step 1: Generate Question
  const generateQuestion = async () => {
    if (!name.trim() || !jobTarget.trim()) return;

    setIsLoading(true);
    setStep('generating');


    try {
      const response = await interviewApi.generateQuestion(name, jobTarget);

      if (response.success) {
        toast.success("Your interview has been generated!")
        setTempUserId(response.tempUserId);
        setQuestion(response.question);
        setStep('interview');
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback to mock for testing
      setTempUserId('mock-' + Date.now());
      setQuestion(`Tell me about a time you had to learn a new technology quickly, ${name}.`);
      setStep('interview');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Start Voice Interview
  const startVoiceInterview = async () => {
    if (!vapiService.isVoiceSupported()) {
      setCallStatus('Voice not supported. Please check microphone permissions.');
      return;
    }

    setIsLoading(true);
    toast.success('Requesting microphone...')
    setCallStatus('Requesting microphone...');

    try {
      await vapiService.startInterview(
        import.meta.env.VITE_VAPI_ASSISTANT_ID,
        question,
        { jobTarget, name },
        {
          onCallStart: () => {
            setIsCallActive(true);
            setCallStatus('Interviewer is asking the question...');
            setIsLoading(false);
          },
          onCallEnd: () => {
            setIsCallActive(false);
            setCallStatus('Call ended. Processing your answer...');

            if (transcriptRef.current) {
              processAnswer(transcriptRef.current);
            } else {
              setCallStatus('No response detected. Please try again.');
              setIsLoading(false);
            }
          },
          onTranscript: (text: string) => {
            setUserTranscript(text);
            transcriptRef.current = text;
            setCallStatus('Answer recorded. You can end the call when ready.');
          },
          onError: (error: Error) => {
            console.error('Vapi error:', error);
            setCallStatus(`Error: ${error.message}`);
            setIsLoading(false);
            setIsCallActive(false);
          },
          onStatusUpdate: (status: string) => {
            setCallStatus(status);
          },
        }
      );
    } catch (error) {
      console.error('Failed to start interview:', error);
      setCallStatus('Failed to start interview. Please check your microphone.');
      setIsLoading(false);
    }
  };

  const endVoiceInterview = async () => {
    setCallStatus('Ending call...');
    await vapiService.stopInterview();
  };

  // Step 3: Process Answer & Get Feedback
  const processAnswer = async (answer: string) => {
    setIsProcessingAnswer(true);
    setCallStatus('Analyzing your answer...');
    toast.success('Analyzing your answer')

    try {
      const response = await interviewApi.processAnswer(tempUserId as string, question, answer, jobTarget)

      if (response.success) {
        toast.success("Your feedback is ready!")
        setFeedback(response.feedback);
        setAvgScore(response.avgScore);
        setStep('feedback');
      } else {
        throw new Error('Failed to process answer');
      }
    } catch (error) {
      console.error('Error:', error);
      setStep('feedback');
    } finally {
      setIsProcessingAnswer(false);
      setCallStatus('');
    }
  };

  // Step 4: Continue to Auth
  const handleContinue = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quick-interview/continue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempUserId }),
      });

      const data = await response.json();

      if (data.success) {
        onContinue({
          name: data.prefillData.name,
          jobTarget: data.prefillData.jobTarget,
          tempUserId: tempUserId!,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      onContinue({ name, jobTarget, tempUserId: tempUserId! });
    } finally {
      setIsLoading(false);
    }
  };

  // Score card component with animation
  const ScoreCard = ({ label, value, icon, index }: { label: string; value: number; icon: React.ReactNode; index: number }) => (
    <motion.div
      custom={index}
      variants={scoreCardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 text-center"
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <motion.div
        className="text-2xl font-bold text-primary-500"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: index * 0.1 + 0.3 }}
      >
        {value}/5
      </motion.div>
      <div className="text-xs text-neutral-500 mt-1">{label}</div>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/90 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b dark:border-neutral-800">
                <motion.h2
                  key={`header-${step}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl font-semibold"
                >
                  {step === 'collect' && 'Quick Interview'}
                  {step === 'generating' && 'Preparing...'}
                  {step === 'interview' && 'Voice Interview'}
                  {step === 'feedback' && 'Your Feedback'}
                </motion.h2>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Body with step transitions */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Collect Info */}
                  {step === 'collect' && (
                    <motion.div
                      key="collect"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-4"
                    >
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        Try a 1-minute AI voice interview. We'll ask one question and give you instant feedback.
                      </p>
                      <motion.input
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border rounded-xl dark:text-black focus:ring-2 focus:ring-primary-500"
                      />
                      <motion.input
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        type="text"
                        placeholder="Job target (e.g., Software Engineer, Product Manager)"
                        value={jobTarget}
                        onChange={(e) => setJobTarget(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:ring-2 dark:text-black focus:ring-primary-500"
                      />
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={generateQuestion}
                        disabled={!name.trim() || !jobTarget.trim()}
                        className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                      >
                        Start Interview
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Step 2: Generating */}
                  {step === 'generating' && (
                    <motion.div
                      key="generating"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-center py-8"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-neutral-600">Creating your personalized question...</p>
                    </motion.div>
                  )}

                  {/* Step 3: Voice Interview */}
                  {step === 'interview' && (
                    <motion.div
                      key="interview"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      {/* Question Display */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="w-4 h-4 text-primary-500" />
                          <p className="text-sm text-primary-600 dark:text-primary-400">Interviewer is asking:</p>
                        </div>
                        <p className="text-lg dark:text-black font-medium">{question}</p>
                      </motion.div>

                      {/* Voice Controls */}
                      <div className="text-center">
                        {!isCallActive && !isProcessingAnswer && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            animate={isCallActive ? "recording" : "idle"}
                            variants={pulseVariants}
                            onClick={startVoiceInterview}
                            disabled={isLoading}
                            className="w-24 h-24 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center mx-auto transition-all disabled:opacity-50"
                          >
                            <Mic className="w-10 h-10" />
                          </motion.button>
                        )}

                        {isCallActive && (
                          <div className="space-y-4">
                            <motion.div
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center mx-auto"
                            >
                              <MicOff className="w-10 h-10 text-white" />
                            </motion.div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={endVoiceInterview}
                              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                            >
                              End Call
                            </motion.button>
                          </div>
                        )}

                        {isProcessingAnswer && (
                          <div className="text-center py-4">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"
                            />
                            <p className="text-neutral-600">Analyzing your answer...</p>
                          </div>
                        )}

                        {/* Status Message */}
                        {callStatus && !isProcessingAnswer && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-neutral-500 mt-4"
                          >
                            {callStatus}
                          </motion.p>
                        )}

                        {/* Transcript Preview */}
                        {userTranscript && !isCallActive && !isProcessingAnswer && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-left"
                          >
                            <p className="text-xs text-neutral-500 mb-1">Your answer:</p>
                            <p className="text-sm">"{userTranscript}"</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Feedback */}
                  {step === 'feedback' && feedback && (
                    <motion.div
                      key="feedback"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <FeedbackDisplay
                        feedback={feedback}
                        question={question}
                        onNext={handleContinue}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}