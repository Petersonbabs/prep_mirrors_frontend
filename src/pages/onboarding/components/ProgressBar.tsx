function ProgressBar({ current, total }: { current: number; total: number; }) {
  const pct = Math.round(current / total * 100);
  return (
    <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${pct}%`
        }} />

    </div>);

}

export default ProgressBar