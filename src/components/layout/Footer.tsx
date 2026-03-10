import React from 'react'
import { UnderDevelopmentComponent } from '../../utils/utils'

const Footer = () => {
    return (
        <footer className="bg-neutral-900 dark:bg-neutral-950 text-neutral-400 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src="/[favicon]-Prep-mirror-white-bg.png"
                                alt="PrepMirrors"
                                className="w-7 h-7 rounded-lg" />

                            <span className="font-display font-bold text-white">
                                PrepMirrors
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            AI-powered interview practice for job seekers and new graduates.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-display font-semibold text-white mb-3 text-sm">
                            Product
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/#features" className="hover:text-white transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="/pricing" className="hover:text-white transition-colors">
                                    Pricing
                                </a>
                            </li>
                            <UnderDevelopmentComponent>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Changelog
                                    </a>
                                </li>
                            </UnderDevelopmentComponent>
                        </ul>
                    </div>
                    <UnderDevelopmentComponent>
                        <div>
                            <h4 className="font-display font-semibold text-white mb-3 text-sm">
                                Company
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Careers
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-display font-semibold text-white mb-3 text-sm">
                                Support
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </UnderDevelopmentComponent>
                </div>
                <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm">© 2026 PrepMirrors. All rights reserved.</p>
                    <div className="flex items-center gap-1.5 text-sm">
                        <span>Made with</span>
                        <lord-icon
                            src="https://cdn.lordicon.com/ulnqfwhq.json"
                            trigger="loop"
                            colors="primary:#ef4444,secondary:#fca5a5"
                            style={
                                {
                                    width: '18px',
                                    height: '18px'
                                } as React.CSSProperties
                            } />

                        <span>for job seekers everywhere</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer