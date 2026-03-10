import { CheckIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function CommitButton({ onCommit }: { onCommit: () => void; }) {
  const [progress, setProgress] = useState(0);
  const [committed, setCommitted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdDuration = 2000;
  const startHold = () => {
    if (committed) return;
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(elapsed / holdDuration * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(intervalRef.current!);
        setCommitted(true);
        setTimeout(onCommit, 600);
      }
    }, 16);
  };
  const stopHold = () => {
    if (committed) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
  };
  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );
  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - progress / 100 * circumference;
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-28 h-28 select-none">
        {progress > 0 &&
          <div
            className="absolute inset-0 rounded-full bg-primary-400/30 blur-xl transition-opacity duration-200"
            style={{
              opacity: progress / 100
            }} />

        }
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100">

          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#E0E7FF"
            strokeWidth="4" />

          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#6366F1"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-75" />

        </svg>
        <button
          onMouseDown={startHold}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={startHold}
          onTouchEnd={stopHold}
          className={`absolute inset-2 rounded-full flex items-center justify-center transition-all duration-200 select-none ${committed ? 'bg-secondary-500 scale-110' : progress > 0 ? 'bg-primary-600 scale-105' : 'bg-primary-500 active:scale-95'}`}
          style={{
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}>

          {committed ?
            <CheckIcon className="w-10 h-10 text-white" /> :

            <img
              src="/[favicon]-Prep-mirror-white-bg.png"
              alt="PrepMirrors"
              className="w-12 h-12 rounded-full"
              draggable={false} />

          }
        </button>
      </div>
      <p
        className={`text-sm font-semibold text-center transition-colors ${committed ? 'text-secondary-600 dark:text-secondary-400' : 'text-primary-600 dark:text-primary-400'}`}>

        {committed ?
          '✅ Commitment made!' :
          progress > 0 ?
            'Keep holding...' :
            'Tap and hold to commit'}
      </p>
    </div>);

}

export default CommitButton;