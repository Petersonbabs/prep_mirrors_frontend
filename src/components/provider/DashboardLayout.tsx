import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardPage } from "../../pages/(dashboard)/DashboardPage"
import { useAuth } from "../../lib/hooks/useAuth"
import { ProgressPage } from "../../pages/(dashboard)/ProgressPage"
import { AccountPage } from "../../pages/(dashboard)/AccountPage"
import { SettingsPage } from "../../pages/(dashboard)/SettingsPage"
import BillingPage from "../../pages/(dashboard)/BillingPage"
import { DashboardSupportPage } from "../../pages/(dashboard)/support"
import { InterviewFlow } from "../../pages/(dashboard)/InterviewFlow"
import { NotificationsPage } from "../dashboard/NotificationsPage"

const DashboardLayout = () => {
    const { user, isLoading } = useAuth();

    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={
                        (!isLoading && !user) ? <Navigate to="/signin" replace /> :
                            <DashboardPage />
                    } />

                {/*
                  The whole interview — brief, technical, feedback, coach,
                  behavioral — lives in InterviewFlow, keyed by company id in
                  the URL so a refresh mid-interview resumes from the phase
                  recorded on the session rather than dumping the user out.
                */}
                <Route path="/interview/:companyId" element={<InterviewFlow />} />

                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/support" element={<DashboardSupportPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />

                {/* Anything else under /dashboard (including links to the
                    removed interview-script/interview-session/feedback/coach
                    routes) lands back on the dashboard rather than a blank page. */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </div>
    )
}

export default DashboardLayout
