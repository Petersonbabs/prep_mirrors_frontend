import React, { useState, useEffect } from 'react';
import ZoomDiagnosticInterface, { IntakeData } from './ZoomDiagnosticInterface';
import DiagnosticScorecard from './DiagnosticScorecard';
import AnchoredPaywallModal from './AnchoredPaywallModal';
import { DiagnosticEvaluationSchema } from '../../../../prepmirrors-backend/src/schemas/feedbackSchema';
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

    const handleFinishDiagnostic = (userTranscript: string) => {
        setIsEvaluating(true);

        // Mock diagnostic engine evaluation calculation based on timeline & transcript
        setTimeout(() => {
            const calculatedScore = 64; // Benchmark baseline
            const targetDays = intake.timelineDays || 7;
            const hoursNeeded = Math.round((85 - calculatedScore) * 0.15 * 10) / 10;
            const sessionsPerDay = targetDays <= 7 ? 2 : 1;
            const minsPerDay = Math.round((hoursNeeded * 60) / targetDays);

            const readyDate = new Date();
            readyDate.setDate(readyDate.getDate() + targetDays);
            const formattedReadyDate = readyDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const mockResult: DiagnosticEvaluationSchema = {
                readiness_score: calculatedScore,
                benchmark_status: 'Needs Focused Prep',
                pillar_scores: {
                    star_structure: 60,
                    conciseness_clarity: 70,
                    domain_keywords: 55,
                    delivery_confidence: 75,
                    executive_impact: 50
                },
                star_analysis: {
                    has_situation: true,
                    has_task: true,
                    has_action: true,
                    has_result: false,
                    missing_elements: ['Quantified Result / Impact Metrics']
                },
                red_flags: [
                    {
                        type: 'passive_pronoun',
                        issue: 'Overuse of "We" instead of personal ownership "I"',
                        recommendation: 'Highlight your specific contribution rather than hiding behind team actions.'
                    },
                    {
                        type: 'missing_metrics',
                        issue: 'No quantified business impact',
                        recommendation: 'Include specific numbers (e.g. % latency reduction, $ saved, users reached).'
                    }
                ],
                quote_rewrites: [
                    {
                        user_said: userTranscript || "We worked on reducing API latency because customers complained.",
                        recruiter_rewrite: "I profiled the GraphQL endpoints using Datadog, identified 3 unindexed database queries, and reduced P99 latency by 42%.",
                        rationale: "Replaces passive team description with proactive technical ownership and measurable impact."
                    }
                ],
                timeline_pace: {
                    target_timeline_days: targetDays,
                    estimated_practice_hours: hoursNeeded,
                    sessions_per_day: sessionsPerDay,
                    minutes_per_day: minsPerDay,
                    target_ready_date: formattedReadyDate,
                    pace_headline: `Reach 85%+ Readiness in ${targetDays} Days`
                },
                strengths: ['Clear articulate tone', 'Good technical problem context'],
                quick_wins: ['Add quantified results to STAR answers', 'Use "I" instead of "We"'],
                final_verdict: 'Strong foundational technical knowledge; needs structured action & quantified metrics to pass FAANG hiring bar.'
            };

            setEvaluationResult(mockResult);
            setIsEvaluating(false);
            setCurrentStep('SCORECARD');

            // Save to localStorage for Tier 1 Credit Saver
            localStorage.setItem('prepmirrors_onboarding_completed', 'true');
            localStorage.setItem('prepmirrors_last_score', calculatedScore.toString());
            localStorage.setItem('prepmirrors_target_role', intake.role);
        }, 1200);
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
                <ZoomDiagnosticInterface
                    onCompleteIntake={handleIntakeComplete}
                    onFinishDiagnosticSession={handleFinishDiagnostic}
                    isProcessingScore={isEvaluating}
                />
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
