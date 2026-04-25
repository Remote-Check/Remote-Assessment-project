import { useState } from "react";
import { Hash, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

export interface PatientFormProps {
  open: boolean;
  onClose: () => void;
  onCreated: (patientId: string) => void;
}

export function PatientForm({ open, onClose, onCreated }: PatientFormProps) {
  const [caseId, setCaseId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const reset = () => {
    setCaseId("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedCaseId = caseId.trim();
    if (!trimmedCaseId) {
      setError("יש למלא מזהה תיק.");
      return;
    }

    const { data: authData } = await supabase.auth.getSession();
    const session = authData.session;
    if (!session) {
      setError("יש להתחבר מחדש.");
      return;
    }

    setSaving(true);
    try {
      const { data, error: insertError } = await supabase
        .from("patients")
        .insert({
          clinician_id: session.user.id,
          full_name: trimmedCaseId,
          phone: null,
          date_of_birth: null,
          id_number: null,
          notes: null,
        })
        .select("id")
        .single();

      if (insertError || !data) {
        throw new Error(insertError?.message ?? "פתיחת תיק נכשלה.");
      }

      reset();
      onCreated(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "פתיחת תיק נכשלה.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6 font-['Heebo',sans-serif]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-200 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
              <Hash className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-black">פתיחת תיק חדש</h2>
              <p className="text-gray-500 text-sm">ה-MVP משתמש במזהה תיק בלבד</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
            aria-label="סגור"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">מזהה תיק*</label>
            <input
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="למשל CASE-20260425-001"
              className="w-full h-12 px-4 text-lg border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-black/10 outline-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 font-bold">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-14 rounded-xl bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-60"
            >
              {saving ? "שומר..." : "פתח תיק"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
