import { ReactNode } from "react"
import Footer from "../layout/Footer"
import { Route, Routes, useNavigate } from "react-router-dom"
import { HomePage } from "../../pages/HomePage"
import PrivacyPolicyPage from "../../pages/(public)/privacy"
import TermsOfServicePage from "../../pages/(public)/terms"
import { SupportPage } from "../../pages/(public)/support"
import PracticePage from "../../pages/(public)/practice"

const PublicLayout = () => {
    const navigate = useNavigate()
    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={<HomePage
                        onGetStarted={() => navigate('/auth')}
                        onSignIn={() => navigate('/dashboard')}
                    />} />
                {/* Public diagnostic funnel. :roleSlug lets a single page back
                    per-role landing URLs (/practice/product-manager) for ads
                    and search without duplicating the flow. */}
                <Route path="/practice" element={<PracticePage />} />
                <Route path="/practice/:roleSlug" element={<PracticePage />} />

                <Route path="/privacy" element={<PrivacyPolicyPage />} />

                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/support" element={<SupportPage />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default PublicLayout