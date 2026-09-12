import React, { useState, useEffect } from 'react';
import ZoomDiagnosticInterface, { IntakeData } from './ZoomDiagnosticInterface';
import DiagnosticScorecard from './DiagnosticScorecard';
import AnchoredPaywallModal from './AnchoredPaywallModal';
import { DiagnosticEvaluationSchema } from '../../lib/types/diagnostic.types';
import { diagnosticApi } from '../../lib/api/diagnostic';
import { useNavigate } from 'react-router-dom';

export const PLGOnboardingFlow: React.FC = () => {
    const navigate = useNavigate();

    // Visitor state: 'FIRST_TIME' | 'RETURNING'
    const [visitorType, setVisitorType] = useState<'FIRST_TIME' | 'RETURNING'>('FIRST_TIME');
    const [cachedScore, setCachedScore] = useState<number | null>(null);
    const [cachedRole, setCachedRole] = useState<string>('');

    // Funnel Step State: 'ZOOM_INTAKE' | 'SCORECARD' | 'PAYWALL'
    const [currentStep, setCurrentStep] = useState<'ZOOM_INTAKE' | 'SCORECARD' | 'PAYWALL'>('ZOOM_INTAKE');

    // Intake data state
    const [intake, setIntake] = useState<IntakeData>({
        name: '',
        role: '',
        company: '',
        timelineDays: 7
    });

    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState<DiagnosticEvaluationSchema | null>(null);
    const [evaluationError, setEvaluationError] = useState<string | null>(null);
    // Kept so a failed evaluation can be retried without making the candidate
    // record their answer again.
    const [lastTranscript, setLastTranscript] = useState('');
    const [lastQuestion, setLastQuestion] = useState('');
    const [userAuthEmail, setUserAuthEmail] = useState('');

    // Tier 1 localStorage check for returning visitors
    useEffect(() => {
        const isCompleted = localStorage.getItem('prepmirrors_onboarding_completed');
        const savedScore = localStorage.getItem('prepmirrors_last_score');
        const savedRole = localStorage.getItem('prepmirrors_target_role');

        if (isCompleted === 'true') {
            setVisitorType('RETURNING');
            if (savedScore) setCachedScore(parseInt(savedScore, 10));
            if (savedRole) setCachedRole(savedRole);
        }
    }, []);

    const handleIntakeComplete = (data: IntakeData) => {
        setIntake(data);
    };

    const handleFinishDiagnostic = async (userTranscript: string, question?: string) => {
        setIsEvaluating(true);
        setEvaluationError(null);
        setLastTranscript(userTranscript);
        setLastQuestion(question ?? '');

        const result = await diagnosticApi.evaluate({
            question: question || 'Tell me about a recent project you are proud of.',
            answer: userTranscript,
            role: intake.role,
            company: intake.company || undefined,
            timelineDays: intake.timelineDays || 7,
        });

        setIsEvaluating(false);

        if (!result.success) {
            // Stay on the intake step and surface a retry rather than showing a
            // scorecard we didn't actually earn.
            setEvaluationError(result.error);
            return;
        }

        setEvaluationResult(result.evaluation);
        setCurrentStep('SCORECARD');

        // Tier 1 Credit Saver: remember this visitor so a return trip can skip
        // straight to their last result.
        localStorage.setItem('prepmirrors_onboarding_completed', 'true');
        localStorage.setItem('prepmirrors_last_score', String(result.evaluation.readiness_score));
        localStorage.setItem('prepmirrors_target_role', intake.role);
    };

    const retryEvaluation = () => {
        if (!lastTranscript) return;
        handleFinishDiagnostic(lastTranscript, lastQuestion || undefined);
    };

    const handleAuthenticate = (email: string) => {
        setUserAuthEmail(email);
        // In real app, trigger Supabase auth (signInWithOtp or signUp)
    };

    const handleSelectPlan = (plan: string, discountCode?: string) => {
        // Navigate to auth / checkout page with state
        navigate('/auth', {
            state: {
                plan,
                discountCode,
                prefill: {
                    email: userAuthEmail,
                    jobTarget: intake.role,
                    name: intake.name
                }
            }
        });
    };

    // Render Returning Visitor Hero (Tier 1 Credit Saver)
    if (visitorType === 'RETURNING' && currentStep === 'ZOOM_INTAKE') {
        return (
            <div className="w-full max-w-4xl mx-auto rounded-3xl p-8 bg-gradient-to-br from-neutral-900 via-neutral-900 to-primary-950 border border-neutral-800 text-white shadow-2xl text-center space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-300 border border-primary-500/30 px-4 py-1.5 rounded-full text-xs font-semibold">
                    <span>Welcome Back to PrepMirrors</span>
                </div>

                <h2 className="font-display font-bold text-3xl sm:text-4xl">
                    Ready to continue your {cachedRole || 'Interview'} practice?
                </h2>

                {cachedScore && (
                    <div className="bg-black/40 border border-neutral-800 rounded-2xl p-4 max-w-sm mx-auto flex items-center justify-between">
                        <span className="text-xs text-neutral-400">Last Diagnostic Score:</span>
                        <span className="font-display font-bold text-2xl text-secondary-400">{cachedScore}% Readiness</span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <button
                        onClick={() => navigate('/auth')}
                        className="w-full sm:w-auto px-8 py-4 bg-primary-500 hover:bg-primary-600 font-bold text-white rounded-2xl shadow-glow transition-all text-base">
                        Resume My Practice Schedule →
                    </button>

                    <button
                        onClick={() => setVisitorType('FIRST_TIME')}
                        className="w-full sm:w-auto px-6 py-4 bg-neutral-800 hover:bg-neutral-700 font-semibold text-neutral-300 rounded-2xl border border-neutral-700 transition-colors text-sm">
                        Take New Diagnostic Session
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            {currentStep === 'ZOOM_INTAKE' && (
                <>
                    <ZoomDiagnosticInterface
                        onCompleteIntake={handleIntakeComplete}
                        onFinishDiagnosticSession={handleFinishDiagnostic}
                        isProcessingScore={isEvaluating}
                    />

                    {/* Scoring can fail (model timeout, rate limit). The answer
                        is held in state so retrying doesn't cost them a re-record. */}
                    {evaluationError && !isEvaluating && (
                        <div
                            role="alert"
                            className="max-w-xl mx-auto rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center space-y-3"
                        >
                            <p className="text-sm text-red-200">{evaluationError}</p>
                            {lastTranscript && (
                                <button
                                    onClick={retryEvaluation}
                                    className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
                                >
                                    Score my answer again
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {currentStep === 'SCORECARD' && evaluationResult && (
                <DiagnosticScorecard
                    scoreData={evaluationResult}
                    role={intake.role || 'Software Engineer'}
                    company={intake.company || 'Tech Company'}
                    timelineDays={intake.timelineDays || 7}
                    onAuthenticate={handleAuthenticate}
                    onProceedToPaywall={() => setCurrentStep('PAYWALL')}
                />
            )}

            {currentStep === 'PAYWALL' && (
                <AnchoredPaywallModal
                    role={intake.role || 'Target Role'}
                    company={intake.company || 'Target Company'}
                    targetDate={evaluationResult?.timeline_pace.target_ready_date || 'Upcoming Date'}
                    onClose={() => setCurrentStep('SCORECARD')}
                    onSelectPlan={handleSelectPlan}
                />
            )}
        </div>
    );
};

export default PLGOnboardingFlow;
