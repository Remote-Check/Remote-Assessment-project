import { ChevronRight, FileDown, Download, Play, CheckSquare } from "lucide-react";
import { Link, useParams } from "react-router";
import { clsx } from "clsx";
import { useState } from "react";

const SUMMARY = [
  { label: "סך הכל MoCA", value: "24/30", color: "warn" },
  { label: "מרחבי-חזותי", value: "3/5", color: "warn" },
  { label: "שיום", value: "3/3", color: "pass" },
  { label: "זכירה מושהית", value: "2/5", color: "warn" },
  { label: "קשב", value: "6/6", color: "pass" },
  { label: "משך זמן", value: "14:20", color: "neutral" },
];

export function ClinicianDashboardDetail() {
  const { patientId } = useParams();
  const [rubric, setRubric] = useState({
    contour: true,
    numbers: false,
    hands: false,
  });

  const totalScore = (rubric.contour ? 1 : 0) + (rubric.numbers ? 1 : 0) + (rubric.hands ? 1 : 0);

  const toggleRubric = (key: keyof typeof rubric) => {
    setRubric(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-6">
        <Link to="/dashboard" className="text-gray-500 font-bold hover:text-black flex items-center gap-2 transition-colors w-fit">
          <ChevronRight className="w-5 h-5" />
          <span>מטופלים / ישראלי ישראל</span>
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-3xl">
            י
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-2">ישראל ישראלי</h1>
            <div className="flex gap-4 text-gray-500 font-medium text-lg items-center">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded-md">{patientId || "P-1049"}</span>
              <span>גיל 72</span>
              <span>מבחן שני</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-amber-100 text-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                בבדיקה
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white border-2 border-gray-200 hover:border-black transition-colors text-black">
            <FileDown className="w-5 h-5" />
            <span>PDF</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white border-2 border-gray-200 hover:border-black transition-colors text-black">
            <Download className="w-5 h-5" />
            <span>CSV</span>
          </button>
          <button className="px-8 py-3 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-colors shadow-md text-lg">
            סגור מבחן
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-8">
        {SUMMARY.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{item.label}</div>
            <div className={clsx(
              "text-3xl font-extrabold tabular-nums",
              item.color === 'warn' ? 'text-red-600' : item.color === 'pass' ? 'text-green-600' : 'text-black'
            )}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-extrabold mb-6 mt-12 text-black">בדיקת ציור שעון</h2>
      
      <div className="grid grid-cols-12 gap-8">
        {/* Right side: Drawing (RTL is left visually, wait no RTL means it appears on the right) */}
        <div className="col-span-7 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex-1 min-h-[400px] border-2 border-dashed border-gray-300 rounded-xl relative flex items-center justify-center mb-6 overflow-hidden bg-[#fafafa]">
            {/* Mock drawing */}
            <svg viewBox="0 0 200 200" className="w-full h-full max-w-[300px] text-blue-700 stroke-current opacity-80" strokeWidth="2" fill="none">
              <circle cx="100" cy="100" r="90" />
              <text x="95" y="30" className="text-sm stroke-none fill-black font-mono">12</text>
              <text x="175" y="105" className="text-sm stroke-none fill-black font-mono">3</text>
              <text x="95" y="185" className="text-sm stroke-none fill-black font-mono">6</text>
              <text x="15" y="105" className="text-sm stroke-none fill-black font-mono">9</text>
              <line x1="100" y1="100" x2="100" y2="40" />
              <line x1="100" y1="100" x2="140" y2="100" />
            </svg>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-2 shadow-sm border border-gray-200 flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                <Play className="w-4 h-4" />
              </button>
              <div className="text-sm font-mono font-bold px-2 text-black">0:00 / 0:42</div>
            </div>
          </div>

          <div className="mt-auto">
            <h4 className="font-bold text-gray-500 text-sm mb-3">ציר זמן משיכות (42 שניות)</h4>
            <div className="flex h-12 items-end gap-[2px] w-full">
              {[...Array(40)].map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-blue-600 hover:bg-black transition-colors cursor-pointer rounded-t-[1px]" 
                  style={{ 
                    height: `${20 + Math.random() * 80}%`,
                    opacity: 0.4 + (Math.random() * 0.6)
                  }}
                  title={`משיכה ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Left side: Rubric */}
        <div className="col-span-5 bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <h3 className="text-2xl font-extrabold text-black">ניקוד</h3>
            <div className="text-3xl font-extrabold tabular-nums bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
              <span className="text-black">{totalScore}</span>
              <span className="text-gray-400">/3</span>
            </div>
          </div>

          <div className="space-y-3 mb-8 flex-1">
            {[
              { id: "contour", label: "מתאר (נקודה אחת)", desc: "המעגל סגור ופרופורציונלי" },
              { id: "numbers", label: "מספרים (נקודה אחת)", desc: "כל המספרים נמצאים במיקום הנכון" },
              { id: "hands", label: "מחוגים (נקודה אחת)", desc: "השעה 11:10 בדיוק" },
            ].map((crit) => {
              const isChecked = rubric[crit.id as keyof typeof rubric];
              return (
                <div 
                  key={crit.id}
                  onClick={() => toggleRubric(crit.id as keyof typeof rubric)}
                  className={clsx(
                    "flex gap-4 p-5 rounded-xl cursor-pointer transition-all border-2",
                    isChecked 
                      ? "bg-[#ecfdf5] border-green-200" 
                      : "bg-white border-transparent hover:border-gray-200"
                  )}
                >
                  <div className={clsx(
                    "mt-1 w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-colors",
                    isChecked ? "bg-green-600 text-white" : "bg-gray-200 text-transparent"
                  )}>
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={clsx("font-bold text-lg", isChecked ? "text-green-900" : "text-black")}>
                      {crit.label}
                    </div>
                    <div className={clsx("text-sm mt-1", isChecked ? "text-green-700" : "text-gray-500")}>
                      {crit.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">הערות</label>
            <textarea 
              placeholder="הוסף הערה קלינית…" 
              className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl resize-none text-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-blue-600 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
