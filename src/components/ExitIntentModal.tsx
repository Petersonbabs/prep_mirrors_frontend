import React, { useEffect, useState } from 'react';
import { XIcon, CheckCircleIcon } from 'lucide-react';
interface ExitIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, otherText?: string) => void;
}
const REASONS = [
'Too expensive for me right now',
'I need more features before upgrading',
"I'm just browsing, not ready yet",
'I found a better alternative',
"I don't fully understand the pricing",
'Other'];

export function ExitIntentModal({
  isOpen,
  onClose,
  onSubmit
}: ExitIntentModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedReason(null);
      setOtherText('');
      setIsSubmitted(false);
    }
  }, [isOpen]);
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const handleSubmit = () => {
    if (!selectedReason) return;
    onSubmit(selectedReason, selectedReason === 'Other' ? otherText : undefined);
    setIsSubmitted(true);
    // Auto-close after 1.5s
    setTimeout(() => {
      onClose();
    }, 1500);
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title">

      <div
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl animate-slide-up relative overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}>

        {/* Close Button */}
        {!isSubmitted &&
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-10"
          aria-label="Close modal">

            <XIcon className="w-5 h-5" />
          </button>
        }

        <div className="p-6 sm:p-8 overflow-y-auto">
          {isSubmitted ?
          <div className="py-10 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-5">
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-2">
                Thank you for your feedback! 💜
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                Your insights help us improve PrepMirrors.
              </p>
            </div> :

          <div className="animate-fade-in">
              <h2
              id="exit-modal-title"
              className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-2 pr-8">

                Before you go...
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                We'd love to understand what's holding you back. Your feedback
                helps us improve.
              </p>

              <div className="space-y-2.5">
                {REASONS.map((reason) =>
              <label
                key={reason}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${selectedReason === reason ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}>

                    <div className="mt-0.5 flex-shrink-0">
                      <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedReason === reason ? 'border-primary-500' : 'border-neutral-300 dark:border-neutral-600'}`}>

                        {selectedReason === reason &&
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    }
                      </div>
                    </div>
                    <span
                  className={`text-sm leading-tight ${selectedReason === reason ? 'text-primary-900 dark:text-primary-100 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}>

                      {reason}
                    </span>
                  </label>
              )}
              </div>

              {selectedReason === 'Other' &&
            <div className="mt-3 animate-fade-in">
                  <textarea
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Tell us more..."
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none h-24" />

                </div>
            }

              <div className="mt-8 flex flex-col gap-3">
                <button
                onClick={handleSubmit}
                disabled={!selectedReason}
                className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-colors shadow-soft">

                  Submit Feedback
                </button>
                <button
                onClick={onClose}
                className="w-full py-2 text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors">

                  No thanks
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}