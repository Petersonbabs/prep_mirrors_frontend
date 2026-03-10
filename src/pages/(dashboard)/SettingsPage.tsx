import React, { useState } from 'react';
import {
  BellIcon,
  MoonIcon,
  ShieldIcon,
  GlobeIcon,
  VolumeIcon,
  EyeIcon,
  MailIcon,
  SmartphoneIcon } from
'lucide-react';
interface SettingToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}
function SettingToggle({
  label,
  description,
  enabled,
  onToggle
}: SettingToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900 dark:text-white">
          {label}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          {description}
        </p>
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${enabled ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}>

        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />

      </button>
    </div>);

}
interface SettingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}
function SettingSection({ title, icon, children }: SettingSectionProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-700 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500">
          {icon}
        </div>
        <h2 className="font-display font-semibold text-neutral-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="px-5 divide-y divide-neutral-100 dark:divide-neutral-700">
        {children}
      </div>
    </div>);

}
export function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    interviewReminders: true,
    darkMode: false,
    soundEffects: true,
    reducedMotion: false,
    profileVisibility: true,
    shareProgress: false,
    analyticsTracking: true
  });
  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Settings
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your preferences and account settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <SettingSection
            title="Notifications"
            icon={<BellIcon className="w-4 h-4" />}>

            <SettingToggle
              label="Email Notifications"
              description="Receive updates and tips via email"
              enabled={settings.emailNotifications}
              onToggle={() => toggle('emailNotifications')} />

            <SettingToggle
              label="Push Notifications"
              description="Get notified in your browser"
              enabled={settings.pushNotifications}
              onToggle={() => toggle('pushNotifications')} />

            <SettingToggle
              label="Weekly Progress Report"
              description="Receive a summary of your progress each week"
              enabled={settings.weeklyReport}
              onToggle={() => toggle('weeklyReport')} />

            <SettingToggle
              label="Interview Reminders"
              description="Get reminded before scheduled practice sessions"
              enabled={settings.interviewReminders}
              onToggle={() => toggle('interviewReminders')} />

          </SettingSection>

          {/* Appearance */}
          <SettingSection
            title="Appearance"
            icon={<MoonIcon className="w-4 h-4" />}>

            <SettingToggle
              label="Dark Mode"
              description="Use dark theme across the app"
              enabled={settings.darkMode}
              onToggle={() => toggle('darkMode')} />

            <SettingToggle
              label="Sound Effects"
              description="Play sounds for achievements and actions"
              enabled={settings.soundEffects}
              onToggle={() => toggle('soundEffects')} />

            <SettingToggle
              label="Reduced Motion"
              description="Minimize animations throughout the app"
              enabled={settings.reducedMotion}
              onToggle={() => toggle('reducedMotion')} />

          </SettingSection>

          {/* Privacy */}
          <SettingSection
            title="Privacy"
            icon={<ShieldIcon className="w-4 h-4" />}>

            <SettingToggle
              label="Profile Visibility"
              description="Allow others to see your profile"
              enabled={settings.profileVisibility}
              onToggle={() => toggle('profileVisibility')} />

            <SettingToggle
              label="Share Progress"
              description="Share your achievements on social media"
              enabled={settings.shareProgress}
              onToggle={() => toggle('shareProgress')} />

            <SettingToggle
              label="Analytics Tracking"
              description="Help us improve by sharing usage data"
              enabled={settings.analyticsTracking}
              onToggle={() => toggle('analyticsTracking')} />

          </SettingSection>

          {/* Danger zone */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-700">
              <h2 className="font-display font-semibold text-red-600 dark:text-red-400">
                Danger Zone
              </h2>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Delete Account
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}