export default function ProgressBar({
  value,
  colorClass = "bg-teal-600",
  label,
}: {
  value: number;
  colorClass?: string;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progres"}
      >
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-600">{value}%</span>
    </div>
  );
}
