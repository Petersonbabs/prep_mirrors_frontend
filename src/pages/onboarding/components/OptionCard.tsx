import { CheckIcon, SparklesIcon } from "lucide-react";
import { Option } from "../types";

function OptionCard({
  option,
  selected,
  onSelect
}: { option: Option; selected: boolean; onSelect: () => void; }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border-2 transition-all duration-300 overflow-hidden ${selected ? 'border-primary-500 bg-primary-500' : 'border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600'}`}>

      <div className="flex items-center gap-3 px-5 py-4">
        {option.emoji &&
          <span className="text-xl flex-shrink-0">{option.emoji}</span>
        }
        <span
          className={`font-semibold text-base flex-1 ${selected ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>

          {option.label}
        </span>
        {selected &&
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <CheckIcon className="w-4 h-4 text-white" />
          </div>
        }
      </div>
      {selected && option.response &&
        <div className="px-5 pb-5 pt-1 border-t border-white/20 animate-fade-in">
          <p className="font-display font-bold text-white text-base mb-1">
            {option.response.headline}
          </p>
          <p className="text-white/85 text-sm leading-relaxed mb-3">
            {option.response.body}
          </p>
          {option.response.stat &&
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-xl px-3 py-1.5">
              <SparklesIcon className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold text-white/90">
                {option.response.stat}
              </span>
            </div>
          }
        </div>
      }
    </button>);

}

export default OptionCard