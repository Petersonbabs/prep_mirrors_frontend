// frontend/src/pages/InterviewFlow.tsx (updated)
import { useState, useEffect, lazy, Suspense } from 'react';
import { interviewApi } from '../../lib/api/interview';
import { useAuth } from '../../lib/hooks/useAuth';
import { Company, UserProfile } from '../../lib/types';
import { Loader2 } from 'lucide-react';
import { companiesApi } from '../../lib/api/companies';
import { useNavigate, useParams } from 'react-router-dom';

const CompanyBrief = lazy(() => import('../../components/interview/CompanyBrief'));
const InterviewSession = lazy(() => import('../../components/interview/InterviewSession'));
const InterviewFeedback = lazy(() => import('../../components/interview/InterviewFeedback'));
const CoachMira = lazy(() => import('../../components/coach/CoachMira'));

type FlowStep =
    | 'brief'
    | 'technical_interview'
    | 'technical_feedback'
    | 'technical_coach'
    | 'behavioral_interview'
    | 'behavioral_feedback'
    | 'behavioral_coach'
    | 'complete';

export function InterviewFlow() {
    const [company, setCompany] = useState<Company | null>(null);
    const { user, profile: userProfile } = useAuth();
    const [step, setStep] = useState<FlowStep>('brief');
    const [technicalSessionId, setTechnicalSessionId] = useState<string | null>(null);
    const [behavioralSessionId, setBehavioralSessionId] = useState<string | null>(null);
    const [technicalQuestions, setTechnicalQuestions] = useState<string[]>([]);
    const [behavioralQuestions, setBehavioralQuestions] = useState<string[]>([]);
    const [technicalFeedback, setTechnicalFeedback] = useState<any>(null);
    const [behavioralFeedback, setBehavioralFeedback] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { companyId } = useParams();
    const navigate = useNavigate();
    const onBack = () => navigate("/dashboard");
    const onComplete = () => navigate("/dashboard");

    // Fetch company details and session state
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [companyData, sessionData] = await Promise.all([
                    companiesApi.getCompanyDetails(companyId as string),
                    interviewApi.getSession(companyId as string)
                ]);

                console.log("sessionData", sessionData)
                if (companyData.success) {
                    setCompany(companyData.data);
                }

                // Restore session state if exists
                if (sessionData?.session?.phase) {
                    setStep(sessionData.session.phase);
                }

                // Fetch questions based on current phase
                await fetchQuestions();
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [companyId]);

    // Fetch questions for both technical and behavioral
    const fetchQuestions = async () => {
        try {
            const [techQuestions, behavQuestions] = await Promise.all([
                interviewApi.getInterviewQuestions(companyId as string, "technical_interview"),
                interviewApi.getInterviewQuestions(companyId as string, "behavioral_interview"),
            ]);

            if (techQuestions.success) {
                setTechnicalQuestions(techQuestions.questions);
            }
            if (behavQuestions.success) {
                setBehavioralQuestions(behavQuestions.questions);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const updateSessionPhase = async (newPhase: FlowStep) => {
        await interviewApi.updateSession({
            companyId,
            phase: newPhase
        });
        setStep(newPhase);
    };

    const handleTechnicalComplete = async (data: {
        sessionId: string;
        answers: string[];
        transcript: any[];
        feedback?: any; 
    }) => {
        setTechnicalSessionId(data.sessionId);
        setTechnicalFeedback(data.feedback || null);  // ✅ Store feedback
        await updateSessionPhase('technical_feedback');
    };

    const handleBehavioralComplete = async (data: {
        sessionId: string;
        answers: string[];
        transcript: any[];
        feedback?: any;  // ✅ Add feedback parameter
    }) => {
        setBehavioralSessionId(data.sessionId);
        setBehavioralFeedback(data.feedback || null);  // ✅ Store feedback
        await updateSessionPhase('behavioral_feedback');
    };

    const handleTechnicalCoachComplete = async () => {
        await updateSessionPhase('behavioral_interview');
    };

    const handleBehavioralCoachComplete = async () => {
        await updateSessionPhase('complete');
        onComplete();
    };

    const StepLoader = () => (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-3" />
                <p className="text-neutral-400 text-sm">Loading...</p>
            </div>
        </div>
    );

    if (loading) {
        return <StepLoader />;
    }

    console.log(step)

    // Render based on current step
    switch (step) {
        case 'brief':
            return (
                <Suspense fallback={<StepLoader />}>
                    <CompanyBrief
                        loading={loading}
                        company={company as Company}
                        onContinue={() => {
                            setStep("technical_interview")
                            updateSessionPhase('technical_interview')
                        }}
                        onBack={onBack}
                    />
                </Suspense>
            );

        case 'technical_interview':
            return (
                <Suspense fallback={<StepLoader />}>
                    <InterviewSession
                        sessionId={technicalSessionId as string}
                        companyId={company?.id as string}
                        companyName={company?.name as string}
                        phase="technical_interview"
                        questions={technicalQuestions}
                        user={userProfile as UserProfile}
                        onComplete={handleTechnicalComplete}
                        onBack={() => updateSessionPhase('brief')}
                    />
                </Suspense>
            );

        case 'technical_feedback':
            return (
                <Suspense fallback={<StepLoader />}>
                    <InterviewFeedback
                        phase="technical"
                        companyName={company?.name as string}
                        feedback={technicalFeedback}
                        questions={technicalQuestions}
                        onContinue={() => updateSessionPhase('technical_coach')}
                        onBack={() => {
                            setStep("technical_coach")
                            updateSessionPhase('technical_coach')}}
                    />
                </Suspense>
            );

        case 'technical_coach':
            return (
                <Suspense fallback={<StepLoader />}>
                    <CoachMira
                        interviewPhase="technical"
                        companyName={company?.name as string}
                        feedback={technicalFeedback}
                        onComplete={handleTechnicalCoachComplete}
                        onBack={() => updateSessionPhase('technical_feedback')}
                    />
                </Suspense>
            );

        case 'behavioral_interview':
            return (
                <Suspense fallback={<StepLoader />}>
                    <InterviewSession
                        sessionId={behavioralSessionId as string}
                        companyId={company?.id as string}
                        companyName={company?.name as string}
                        phase="behavioral_interview"
                        questions={behavioralQuestions}
                        user={userProfile as UserProfile}
                        onComplete={handleBehavioralComplete}
                        onBack={() => updateSessionPhase('technical_coach')}
                    />
                </Suspense>
            );

        case 'behavioral_feedback':
            return (
                <Suspense fallback={<StepLoader />}>
                    <InterviewFeedback
                        phase="behavioral"
                        companyName={company?.name as string}
                        feedback={behavioralFeedback}
                        questions={behavioralQuestions}
                        onContinue={() => updateSessionPhase('behavioral_coach')}
                        onBack={() => updateSessionPhase('behavioral_interview')}
                    />
                </Suspense>
            );

        case 'behavioral_coach':
            return (
                <Suspense fallback={<StepLoader />}>
                    <CoachMira
                        interviewPhase="behavioral"
                        companyName={company?.name as string}
                        feedback={behavioralFeedback}
                        onComplete={handleBehavioralCoachComplete}
                        onBack={() => updateSessionPhase('behavioral_feedback')}
                    />
                </Suspense>
            );

        default:
            return null;
    }
}