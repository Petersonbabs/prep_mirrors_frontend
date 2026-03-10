export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 pt-24 pb-16 w-full">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-display font-bold text-4xl text-neutral-900 dark:text-white mb-4">
                    Privacy Policy
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 mb-10 pb-10 border-b border-neutral-100 dark:border-neutral-800">
                    Last updated: March 10, 2026
                </p>

                <div className="space-y-8 text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    <section>
                        <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-4">
                            1. Information We Collect
                        </h2>
                        <p className="mb-4">
                            We collect information that you provide directly to us when you
                            create an account, update your profile, use the interactive
                            features of our services, participate in mock interviews, or
                            communicate with us.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Account Information:</strong> Name, email address,
                                password, and target role.
                            </li>
                            <li>
                                <strong>Interview Data:</strong> Audio recordings, transcripts,
                                and performance scores from your mock interviews.
                            </li>
                            <li>
                                <strong>Usage Data:</strong> Information about how you use our
                                platform, including session durations and feature interactions.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="mb-4">
                            We use the information we collect to provide, maintain, and
                            improve our services. Specifically, we use your data to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Generate personalized AI feedback on your interview performance.
                            </li>
                            <li>Track your progress and provide actionable insights.</li>
                            <li>
                                Process transactions and send related information, including
                                confirmations and receipts.
                            </li>
                            <li>
                                Send technical notices, updates, security alerts, and support
                                messages.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-4">
                            3. Data Security and Privacy
                        </h2>
                        <p>
                            Your privacy is our priority. We implement appropriate technical
                            and organizational security measures to protect your personal
                            information against accidental or unlawful destruction, loss,
                            alteration, or unauthorized disclosure. Your interview audio is
                            processed securely and is never shared with third parties for
                            marketing purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-4">
                            4. Your Rights
                        </h2>
                        <p>
                            You have the right to access, correct, or delete your personal
                            data at any time. You can manage your information directly from
                            your Account Settings. If you wish to permanently delete your
                            account and all associated interview data, you may do so through
                            the Danger Zone in your settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-4">
                            5. Contact Us
                        </h2>
                        <p>
                            If you have any questions about this Privacy Policy, please
                            contact us at privacy@prepmirrors.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
