import { useState } from "react";

export function CsvExportConfirmDialog({
  open,
  exporting,
  scopeLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  exporting: boolean;
  scopeLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="csv-export-title"
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 text-right shadow-xl"
      >
        <h2 id="csv-export-title" className="mb-3 text-2xl font-bold text-black">
          אישור ייצוא CSV
        </h2>
        <p className="mb-5 text-base font-medium leading-relaxed text-gray-700">
          קובץ ה-CSV עבור {scopeLabel} מיועד לשימוש קליני בלבד. הוא עשוי לכלול נתונים מזהים או נתונים
          זמניים לפני סיום סקירה, ולכן יש לשמור אותו רק במקום מאובטח.
        </p>

        <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-950">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-black"
          />
          <span>אני מבין/ה שהייצוא עשוי לכלול מידע קליני רגיש או נתונים שטרם נסקרו.</span>
        </label>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              setAcknowledged(false);
              onCancel();
            }}
            disabled={exporting}
            className="min-h-12 rounded-xl border-2 border-gray-300 px-5 py-2 font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
          >
            ביטול
          </button>
          <button
            type="button"
            onClick={() => {
              setAcknowledged(false);
              onConfirm();
            }}
            disabled={!acknowledged || exporting}
            className="min-h-12 rounded-xl bg-black px-5 py-2 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? "מייצא..." : "ייצא CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
