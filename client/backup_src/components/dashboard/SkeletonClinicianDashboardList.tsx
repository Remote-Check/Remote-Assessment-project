import { Search, ChevronLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router";

const PATIENTS = [
  { id: "P-1049", name: "ישראל ישראלי", age: 72, tests: 2, lastActive: "היום, 10:30", status: "review", score: "24/30", trend: "up" },
  { id: "P-1050", name: "דוד לוי", age: 68, tests: 1, lastActive: "אתמול", status: "completed", score: "28/30", trend: "same" },
  { id: "P-1051", name: "שרה אברהם", age: 81, tests: 3, lastActive: "21.04.2026", status: "new", score: "-", trend: "none" },
];

export function ClinicianDashboardList() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-black mb-2">מטופלים</h1>
          <div className="text-gray-500 font-medium text-lg">
            142 פעילים · 18 דורשים סקירה
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="חיפוש לפי שם או מזהה…" 
              className="pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl w-80 text-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-blue-600 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md text-lg">
            <Plus className="w-5 h-5" />
            <span>מטופל חדש</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "מבחנים השבוע", value: "48", delta: "+12%" },
          { label: "ציון MoCA ממוצע", value: "24.5", delta: "-0.5" },
          { label: "זמן ממוצע (דקות)", value: "14:20", delta: "-1:10" },
          { label: "ממתינים לבדיקה", value: "18", delta: "+3", warn: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-4xl font-extrabold text-black tabular-nums">{stat.value}</div>
              <div className={`text-sm font-bold ${stat.warn ? "text-red-600" : "text-green-600"} bg-gray-50 px-2 py-1 rounded-md`}>
                {stat.delta}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider font-bold">
              <th className="px-6 py-4 font-bold">שם</th>
              <th className="px-6 py-4 font-bold">גיל</th>
              <th className="px-6 py-4 font-bold">מבחנים</th>
              <th className="px-6 py-4 font-bold">פעילות אחרונה</th>
              <th className="px-6 py-4 font-bold">סטטוס</th>
              <th className="px-6 py-4 font-bold">ציון MoCA</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {PATIENTS.map((p) => (
              <tr 
                key={p.id}
                onClick={() => navigate(`/dashboard/${p.id}`)}
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-lg text-black">{p.name}</div>
                      <div className="text-sm text-gray-500 font-mono">{p.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-lg tabular-nums">{p.age}</td>
                <td className="px-6 py-4 text-gray-600 text-lg tabular-nums">{p.tests}</td>
                <td className="px-6 py-4 text-gray-600 text-lg tabular-nums">{p.lastActive}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${
                    p.status === 'review' ? 'bg-amber-100 text-amber-800' :
                    p.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {p.status === 'review' ? 'בבדיקה' :
                     p.status === 'completed' ? 'הושלם' : 'חדש'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-extrabold text-xl text-black tabular-nums">{p.score}</div>
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent group-hover:bg-white border border-transparent group-hover:border-gray-200 group-hover:shadow-sm transition-all text-gray-400">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
