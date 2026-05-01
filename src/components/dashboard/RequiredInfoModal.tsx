// frontend/src/components/dashboard/RequiredInfoModal.tsx
import { useState } from 'react';
import { X, Briefcase, GraduationCap, Target } from 'lucide-react';

interface RequiredInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { targetRole: string; experienceLevel: string; goal: string }) => void;
    isLoading?: boolean;
}

const EXPERIENCE_LEVELS = [
    { id: 'entry', label: 'Entry Level (0-2 years)' },
    { id: 'junior', label: 'Junior (1-3 years)' },
    { id: 'mid', label: 'Mid-Level (3-6 years)' },
    { id: 'senior', label: 'Senior (6+ years)' },
    { id: 'lead', label: 'Lead / Manager' },
];

const COMMON_ROLES = [
    'Software Engineer',
    'Frontend Engineer',
    'Backend Engineer',
    'Full Stack Engineer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
    'Project Manager',
];

export function RequiredInfoModal({ isOpen, onClose, onSave, isLoading }: RequiredInfoModalProps) {
    const [targetRole, setTargetRole] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [goal, setGoal] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetRole || !experienceLevel) return;
        onSave({ targetRole, experienceLevel, goal });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full shadow-2xl animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b dark:border-neutral-800">
                    <h2 className="text-xl font-semibold">Complete Your Profile</h2>
                    <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Target Role */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Target Role *
                        </label>
                        <input
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g., Software Engineer"
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800"
                            required
                            list="common-roles"
                        />
                        <datalist id="common-roles">
                            {COMMON_ROLES.map(role => <option key={role} value={role} />)}
                        </datalist>
                    </div>

                    {/* Experience Level */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Experience Level *
                        </label>
                        <div className="space-y-2">
                            {EXPERIENCE_LEVELS.map(level => (
                                <label key={level.id} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                    <input
                                        type="radio"
                                        name="experienceLevel"
                                        value={level.id}
                                        checked={experienceLevel === level.id}
                                        onChange={(e) => setExperienceLevel(e.target.value)}
                                        className="w-4 h-4 text-primary-500"
                                    />
                                    <span>{level.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Goal (Optional) */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Career Goal (Optional)
                        </label>
                        <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g., I want to land a senior engineering role at a tech company..."
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!targetRole || !experienceLevel || isLoading}
                            className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Generating...' : 'Generate Interviews'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}