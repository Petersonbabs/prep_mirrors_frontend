import React, { ReactNode } from 'react'
import { useAuth } from '../../../lib/hooks/useAuth'
import { Navigate } from 'react-router-dom'

interface OnboardingProps {
    children: ReactNode
}


const OnboardingProvider: React.FC<OnboardingProps> = ({ children }) => {
    const { profile, user, isLoading } = useAuth()
    if (!user && !isLoading) {
        return <Navigate to='/signin' replace/>
    }
    if (profile && profile.onboarding_completed && !isLoading && profile.subscription_tier !== "free") {
        return <Navigate to='/dashboard' replace/>
    }
    return (
        <div>{children}</div>
    )
}

export default OnboardingProvider