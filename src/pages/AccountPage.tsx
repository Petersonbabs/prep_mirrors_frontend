import React, { useState } from 'react';
import {
  UserIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  BellIcon,
  LogOutIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  ClockIcon,
  Loader2
} from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

// Replace with your real Paystack public key from https://dashboard.paystack.com
const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxx';
type ActiveSection = 'profile' | 'billing' | 'security' | 'notifications';
interface SectionButtonProps {
  id: ActiveSection;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: (id: ActiveSection) => void;
}
function SectionButton({
  id,
  label,
  icon,
  active,
  onClick
}: SectionButtonProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
      aria-current={active ? 'page' : undefined}>

      <span className={active ? 'text-indigo-600' : 'text-gray-400'}>
        {icon}
      </span>
      {label}
      {active &&
        <ChevronRightIcon
          className="w-4 h-4 ml-auto text-indigo-400"
          aria-hidden="true" />

      }
    </button>);

}
function ProfileSection() {
  const { profile: userProfile, user, refreshProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local form state
  const [formData, setFormData] = useState({
    fullName: userProfile?.name || '',
    email: userProfile?.email || user?.email || '',
    role: userProfile?.targetRole || ''
  });

  // Sync with profile changes (e.g., initial load)
  React.useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.name || '',
        email: userProfile.email || user?.email || '',
        role: userProfile.targetRole || ''
      });
    }
  }, [userProfile, user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          email: formData.email,
          target_role: formData.role
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
      <div className="space-y-5">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 text-gray-500 text-sm cursor-not-allowed outline-none" />
          <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed here for security reasons.</p>
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            htmlFor="role">
            Job Role / Target Position
          </label>
          <input
            id="role"
            type="text"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircleIcon className="w-4 h-4" aria-hidden="true" />
                Saved!
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>);
}
function BillingSection() {
  const { profile, user, refreshProfile } = useAuth();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const planType = profile?.plan_type || 'free';
  const status = profile?.subscription_status || 'free';
  const trialEnd = profile?.trial_end_date;
  const nextBilling = profile?.next_billing_date;

  const calculateDaysRemaining = (endDate?: string | null) => {
    if (!endDate) return 0;
    const diff = new Date(endDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = calculateDaysRemaining(trialEnd);

  const handleCancel = async () => {
    if (!user) return;
    if (!confirm('Are you sure you want to cancel? This action cannot be undone.')) return;

    setIsActionLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'cancelled' })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      alert('Subscription cancelled successfully.');
    } catch (err) {
      console.error('Error cancelling:', err);
      alert('Failed to cancel. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpgrade = () => {
    alert('Redirecting to secure checkout...');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Billing & Subscription
        </h2>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${planType === 'pro'
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
          : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400'
          }`}>
          {status === 'trialing' ? '7-Day Trial' : `${planType} Plan`}
        </span>
      </div>

      {status === 'trialing' && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-lg shadow-indigo-200 dark:shadow-none">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">Trial ending in</p>
              <h3 className="text-3xl font-bold">{daysRemaining} Days</h3>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div
              className="bg-white h-full rounded-full transition-all duration-1000"
              style={{ width: `${(daysRemaining / 7) * 100}%` }}
            />
          </div>
          <p className="text-indigo-100 text-xs">
            Your trial will end on {trialEnd ? new Date(trialEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}.
            Upgrade to Pro now to keep all features!
          </p>
        </div>
      )}

      {planType === 'pro' && status === 'active' && (
        <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CreditCardIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Next billing date</p>
              <p className="font-bold text-neutral-900 dark:text-white">
                {nextBilling ? new Date(nextBilling).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'} · $19/mo
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Plan Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Unlimited Interviews', included: planType === 'pro' || status === 'trialing' },
            { label: 'AI Real-time Coaching', included: planType === 'pro' || status === 'trialing' },
            { label: 'Detailed Performance Reports', included: true },
            { label: 'All Company Blueprints', included: planType === 'pro' || status === 'trialing' },
          ].map((feature) => (
            <div key={feature.label} className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${feature.included ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                {feature.included ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <ShieldCheckIcon className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-sm ${feature.included ? 'text-neutral-700 dark:text-neutral-200' : 'text-neutral-400 dark:text-neutral-500 line-through'}`}>
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-700">
        {planType === 'free' && status !== 'trialing' ? (
          <button
            onClick={handleUpgrade}
            disabled={isActionLoading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none disabled:opacity-50">
            Upgrade to Pro
          </button>
        ) : (
          <>
            <button
              onClick={() => alert('Opening billing portal...')}
              disabled={isActionLoading}
              className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50">
              Manage Billing
            </button>
            <button
              onClick={handleCancel}
              disabled={isActionLoading}
              className="px-4 py-3 text-red-500 font-medium hover:text-red-600 transition-colors disabled:opacity-50">
              {status === 'trialing' ? 'Cancel Trial' : 'Cancel Plan'}
            </button>
          </>
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Billing History</h3>
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden text-center py-8">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm italic">No billing history available yet.</p>
        </div>
      </div>
    </div>
  );
}
function SecuritySection() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>
      <div className="space-y-5">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1.5"
            htmlFor="currentPassword">

            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />

        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1.5"
            htmlFor="newPassword">

            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />

        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1.5"
            htmlFor="confirmPassword">

            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />

        </div>
        <div className="pt-2">
          <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Update Password
          </button>
        </div>
      </div>
    </div>);

}
function NotificationsSection() {
  const [settings, setSettings] = useState({
    sessionReminders: true,
    weeklyProgress: true,
    newFeatures: false,
    marketingEmails: false
  });
  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const items: {
    key: keyof typeof settings;
    label: string;
    description: string;
  }[] = [
      {
        key: 'sessionReminders',
        label: 'Session Reminders',
        description: 'Get reminded before your scheduled mock interview sessions'
      },
      {
        key: 'weeklyProgress',
        label: 'Weekly Progress Report',
        description: 'Receive a summary of your interview performance each week'
      },
      {
        key: 'newFeatures',
        label: 'New Features',
        description: 'Be the first to know about new tools and improvements'
      },
      {
        key: 'marketingEmails',
        label: 'Marketing Emails',
        description: 'Occasional tips, offers, and updates from our team'
      }];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Notification Preferences
      </h2>
      <div className="space-y-4">
        {items.map((item) =>
          <div
            key={item.key}
            className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-xl">

            <div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
            </div>
            <button
              role="switch"
              aria-checked={settings[item.key]}
              aria-label={`Toggle ${item.label}`}
              onClick={() => toggle(item.key)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings[item.key] ? 'bg-indigo-600' : 'bg-gray-300'}`}>

              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />

            </button>
          </div>
        )}
      </div>
    </div>);

}
const SignOutModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-in border border-neutral-100 dark:border-neutral-700">
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-6">
          <LogOutIcon className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Sign Out</h3>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-sm leading-relaxed">
          Are you sure you want to sign out of PrepMirrors? You'll need to log back in to continue your interview prep.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-soft"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export function AccountPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ActiveSection>('profile');
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const sectionContent: Record<ActiveSection, React.ReactNode> = {
    profile: <ProfileSection />,
    billing: <BillingSection />,
    security: <SecuritySection />,
    notifications: <NotificationsSection />
  };
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Account Settings
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <nav
              className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm space-y-1"
              aria-label="Account sections">

              <SectionButton
                id="profile"
                label="Profile"
                icon={<UserIcon className="w-4 h-4" />}
                active={activeSection === 'profile'}
                onClick={setActiveSection} />

              <SectionButton
                id="billing"
                label="Billing"
                icon={<CreditCardIcon className="w-4 h-4" />}
                active={activeSection === 'billing'}
                onClick={setActiveSection} />

              <SectionButton
                id="security"
                label="Security"
                icon={<ShieldCheckIcon className="w-4 h-4" />}
                active={activeSection === 'security'}
                onClick={setActiveSection} />

              <SectionButton
                id="notifications"
                label="Notifications"
                icon={<BellIcon className="w-4 h-4" />}
                active={activeSection === 'notifications'}
                onClick={setActiveSection} />


              <div className="pt-2 border-t border-gray-100 dark:border-neutral-700 mt-2">
                <button
                  onClick={() => setShowSignOutModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1">
                  <LogOutIcon className="w-4 h-4" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[400px]">
            {sectionContent[activeSection]}
          </main>
        </div>
      </div>

      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleSignOut}
      />
    </div>);

}