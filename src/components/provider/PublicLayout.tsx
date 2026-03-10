import { ReactNode } from "react"
import Footer from "../layout/Footer"
import { Route, Routes, useNavigate } from "react-router-dom"
import { HomePage } from "../../pages/HomePage"
import PrivacyPolicyPage from "../../pages/(public)/privacy"
import TermsOfServicePage from "../../pages/(public)/terms"

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
                <Route path="/privacy" element={<PrivacyPolicyPage />} />

                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default PublicLayout