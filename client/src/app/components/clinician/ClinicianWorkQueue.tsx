import { clsx } from "clsx";
import type { ClinicianQueueStatus } from "./clinicianQueue";

type QueueValue = "all" | ClinicianQueueStatus;

interface ClinicianWorkQueueProps {
  value: QueueValue;
  summary: Record<QueueValue, number>;
  onChange: (value: QueueValue) => void;
}

const FILTERS: Array<{ value: QueueValue; label: string }> = [
  { value: "all", label: "כל התיקים" },
  { value: "review", label: "ממתינים לסקירה" },
  { value: "in_progress", label: "בתהליך" },
  { value: "new", label: "טרם התחילו" },
  { value: "completed", label: "הושלמו" },
];

export function ClinicianWorkQueue({ value, summary, onChange }: ClinicianWorkQueueProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-extrabold text-black">תור עבודה</h2>
        <div className="text-xs font-bold text-gray-500">{summary.all} תיקים</div>
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="סינון תור עבודה">
        {FILTERS.map((filter) => {
          const active = value === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={active}
              aria-label={`${filter.label} ${summary[filter.value]}`}
              onClick={() => onChange(filter.value)}
              className={clsx(
                "inline-flex h-8 items-center justify-center gap-2 rounded-lg px-3 text-sm font-extrabold transition-colors",
                active
                  ? "bg-black text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-800 hover:bg-gray-50",
              )}
            >
              <span>{filter.label}</span>
              <span
                className={clsx(
                  "tabular-nums",
                  active
                    ? "text-white"
                    : filter.value === "review"
                      ? "text-red-600"
                      : "text-gray-500",
                )}
              >
                {summary[filter.value]}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

