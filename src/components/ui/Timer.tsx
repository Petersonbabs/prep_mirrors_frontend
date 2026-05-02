import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { formatTime } from '../../utils/utils';

const Timer = ({ canCount, sessionTime, setSessionTime }: { canCount: boolean, sessionTime: number, setSessionTime: Dispatch<SetStateAction<number>> }) => {
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    // const [sessionTime, setSessionTime] = useState(0);

    useEffect(() => {
        if (canCount) {
            timerRef.current = setInterval(() => setSessionTime((t) => t + 1), 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [canCount]);


    return (
        <div className="flex items-center gap-1.5 bg-neutral-800 rounded-lg px-2.5 py-1">
            <div className={`w-1.5 h-1.5 rounded-full ${canCount ? "bg-green-500" : "bg-neutral-500"}`} />
            <span className="text-xs text-neutral-400 font-mono tabular-nums">
                {formatTime(sessionTime)}
            </span>
        </div>
    )
}

export default Timer