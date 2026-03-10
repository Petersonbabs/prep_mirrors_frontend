import { useState } from 'react'
import { faqs } from '../../../data/faqs'
import { ChevronDownIcon } from 'lucide-react'

function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
 
  return (
    <section className="py-24 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl text-neutral-900 dark:text-white mb-4">
            🤔 Have Questions? We Have Answers..
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Here are the answers to your most common questions. No guesswork,
            just clarity.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors"
                >
                  <span className="font-display font-semibold text-lg text-neutral-900 dark:text-white pr-8">
                    {faq.q}
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-neutral-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Faqs