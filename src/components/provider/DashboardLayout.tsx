import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { DashboardPage } from "../../pages/(dashboard)/DashboardPage"
import { InterviewScriptPage } from "../../pages/InterviewScriptPage"
import { InterviewSessionPage } from "../../pages/InterviewSessionPage"
import { InterviewData } from "../../App"
import { useState } from "react"
import { useAuth } from "../../lib/hooks/useAuth"
import { FeedbackPage } from "../../pages/FeedbackPage"
import { CoachPage } from "../../pages/(dashboard)/CoachPage"
import { ProgressPage } from "../../pages/(dashboard)/ProgressPage"
import { AccountPage } from "../../pages/(dashboard)/AccountPage"
import { SettingsPage } from "../../pages/(dashboard)/SettingsPage"
import BillingPage from "../../pages/(dashboard)/BillingPage"
import { SupportPage } from "../../pages/(public)/support"
import { DashboardSupportPage } from "../../pages/(dashboard)/support"

const DashboardLayout = () => {
    const [showWalkthrough, setShowWalkthrough] = useState(false);
    const { user, isLoading } = useAuth();
    const [selectedInterview, setSelectedInterview] =
        useState<InterviewData | null>(null);
    const [currentPhase, setCurrentPhase] = useState<'technical' | 'behavioral'>(
        'technical'
    );
    const [feedbackData, setFeedbackData] = useState<{
        question: string;
        answer: string;
    } | null>(null);
    const navigate = useNavigate()
    const handleWalkthroughComplete = () => {
        setShowWalkthrough(false);
    };
    const handleStartInterview = (interview: InterviewData) => {
        setSelectedInterview(interview);
        setCurrentPhase('technical');
        navigate('/dashboard/interview-script');
    };
    const handleScriptComplete = () => {
        navigate('/dashboard/interview-session');
    };
    const handleSessionComplete = (data: {
        question: string;
        answer: string;
    }) => {
        setFeedbackData(data);
        navigate('/dashboard/feedback');
    };
    const handleImproveWithCoach = () => {
        navigate('/dashboard/coach');
    };
    const handleNextPhase = () => {
        if (currentPhase === 'technical') {
            setCurrentPhase('behavioral');
            navigate('/dashboard/interview-script');
        } else {
            navigate('/dashboard');
        }
    };
    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={
                        (!isLoading && !user) ? <Navigate to="/signin" replace /> :
                            <DashboardPage
                                onStartInterview={handleStartInterview}
                                onWalkthroughComplete={handleWalkthroughComplete} />
                    } />

                <Route
                    path="/interview-script"
                    element={
                        selectedInterview ?
                            <InterviewScriptPage
                                interview={selectedInterview}
                                phase={currentPhase}
                                onContinue={handleScriptComplete}
                                onBack={() => navigate('/dashboard')} /> :


                            <Navigate to="/dashboard" replace />

                    } />

                <Route
                    path="/interview-session"
                    element={
                        selectedInterview ?
                            <InterviewSessionPage
                                interview={selectedInterview}
                                phase={currentPhase}
                                onComplete={handleSessionComplete}
                                onBack={() => navigate('/dashboard/interview-script')} /> :


                            <Navigate to="/dashboard" replace />

                    } />

                <Route
                    path="/feedback"
                    element={
                        feedbackData && selectedInterview ?
                            <FeedbackPage
                                interview={selectedInterview}
                                phase={currentPhase}
                                feedbackData={feedbackData}
                                onImprove={handleImproveWithCoach}
                                onNextPhase={handleNextPhase}
                                onDashboard={() => navigate('/dashboard')} /> :


                            <Navigate to="/dashboard" replace />

                    } />

                <Route
                    path="/coach"
                    element={
                        feedbackData ?
                            <CoachPage
                                feedbackData={feedbackData}
                                onBack={() => navigate('/dashboard/feedback')}
                                onDashboard={() => navigate('/dashboard')} /> :


                            <Navigate to="/dashboard" replace />

                    } />

                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/support" element={<DashboardSupportPage />} />
            </Routes>
        </div>
    )
}

export default DashboardLayout