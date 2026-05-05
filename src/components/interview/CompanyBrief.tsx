// frontend/src/components/interview/CompanyBrief.tsx
import { useEffect, useState } from 'react';
import { Building2, MapPin, DollarSign, Briefcase, Users, Target, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { Company } from '../../lib/types';

interface CompanyBriefProps {
    company: Company;
    loading: boolean;
    onContinue: () => void;
    onBack?: () => void;
}



export default function CompanyBrief({ loading = true, company, onContinue, onBack }: CompanyBriefProps) {

    const [activeTab, setActiveTab] = useState<'overview' | 'culture' | 'tips'>('overview');

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400">Loading company details...</p>
                </div>
            </div>
        );
    }

    if (!company && !loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400">Failed to load company details</p>
                    <button onClick={onBack} className="mt-4 text-primary-500">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-secondary-900/20" />
                <div className="max-w-4xl mx-auto px-4 py-12 relative">
                    {/* Back button */}
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="mb-6 text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                        >
                            ← Back to Dashboard
                        </button>
                    )}

                    {/* Company Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
                            <Sparkles className="w-4 h-4 text-primary-400" />
                            <span className="text-sm text-primary-400">AI-Powered Mock Interview</span>
                        </div>
                        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-3">
                            {company.name}
                        </h1>
                        <p className="text-xl text-primary-400 font-medium mb-4">{company.role}</p>
                        <p className="text-neutral-400 max-w-2xl mx-auto">{company.description}</p>
                    </div>

                    {/* Company Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="bg-neutral-900 rounded-xl p-3 text-center">
                            <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                            <p className="text-xs text-neutral-500">Salary Range</p>
                            <p className="text-sm font-medium text-white">{company.salary}</p>
                        </div>
                        <div className="bg-neutral-900 rounded-xl p-3 text-center">
                            <MapPin className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                            <p className="text-xs text-neutral-500">Location</p>
                            <p className="text-sm font-medium text-white">{company.location}</p>
                        </div>
                        <div className="bg-neutral-900 rounded-xl p-3 text-center">
                            <Briefcase className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                            <p className="text-xs text-neutral-500">Job Type</p>
                            <p className="text-sm font-medium text-white">{company.jobType}</p>
                        </div>
                        <div className="bg-neutral-900 rounded-xl p-3 text-center">
                            <Building2 className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                            <p className="text-xs text-neutral-500">Industry</p>
                            <p className="text-sm font-medium text-white">{company.industry}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-neutral-800 mb-6">
                        {[
                            { id: 'overview', label: 'Company Overview', icon: Building2 },
                            { id: 'culture', label: 'Culture & Values', icon: Users },
                            { id: 'tips', label: 'Preparation Tips', icon: Target },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id
                                    ? 'border-primary-500 text-primary-400'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-6">
                        {activeTab === 'overview' && (
                            <>
                                <div className="bg-neutral-900/50 rounded-xl p-6">
                                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-primary-400" />
                                        About {company.name}
                                    </h3>
                                    <p className="text-neutral-300 leading-relaxed">{company.about}</p>
                                </div>

                                <div className="bg-neutral-900/50 rounded-xl p-6">
                                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-primary-400" />
                                        Mission
                                    </h3>
                                    <p className="text-neutral-300 leading-relaxed">{company.mission}</p>
                                </div>

                                <div className="bg-neutral-900/50 rounded-xl p-6">
                                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary-400" />
                                        Interview Process
                                    </h3>
                                    <div className="space-y-3">
                                        {company.interviewProcess.map((step, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-neutral-300">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'culture' && (
                            <>
                                <div className="bg-neutral-900/50 rounded-xl p-6">
                                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary-400" />
                                        Company Culture
                                    </h3>
                                    <p className="text-neutral-300 leading-relaxed">{company.culture}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-neutral-900/50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-primary-400">{company.size}</p>
                                        <p className="text-xs text-neutral-500">Company Size</p>
                                    </div>
                                    <div className="bg-neutral-900/50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-primary-400">{company.founded}</p>
                                        <p className="text-xs text-neutral-500">Year Founded</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'tips' && (
                            <div className="bg-neutral-900/50 rounded-xl p-6">
                                <h3 className="font-semibold text-white mb-4">How to Prepare</h3>
                                <div className="space-y-4">
                                    {company.preparationTips.map((tip, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <ChevronRight className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-neutral-300">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={onContinue}
                            className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            Start Interview
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}