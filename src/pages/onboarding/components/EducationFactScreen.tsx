import { EducationFact } from "../types";

function EducationFactScreen({
  fact,
  onContinue



}: { fact: EducationFact; onContinue: () => void; }) {
  return (
    <div className="max-w-lg mx-auto w-full pt-4 flex flex-col animate-slide-up">
      <div className="text-6xl mb-6 text-center">{fact.emoji}</div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-500 dark:text-primary-400 text-center mb-3">
        {fact.label}
      </p>
      <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white text-center mb-4 leading-snug">
        {fact.headline}
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed text-center mb-4">
        {fact.body}
      </p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center mb-8 italic">
        {fact.source}
      </p>
      <button
        onClick={onContinue}
        className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-colors text-base shadow-soft">

        Got it, let's continue →
      </button>
    </div>);
}

export default EducationFactScreen