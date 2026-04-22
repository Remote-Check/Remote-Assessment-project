import { useState } from "react";
import { useNavigate } from "react-router";
import { ListenButton } from "../layout/SkeletonListenButton";

export function VigilanceTask() {
  const navigate = useNavigate();
  const [tapped, setTapped] = useState(0);

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-3">
            7. קשב (Vigilance)
          </div>
          <h2 className="text-4xl font-extrabold text-black">
            הקש בכל פעם שתשמע את האות "א"
          </h2>
        </div>
        <ListenButton text="אני אקריא סדרת אותיות, בכל פעם שאומר את האות א', עליך להקיש פעם אחת במסך." size="lg" />
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex-1 flex flex-col items-center justify-center">
        <button
          onClick={() => setTapped(prev => prev + 1)}
          className="w-64 h-64 rounded-full bg-blue-100 border-4 border-blue-500 hover:bg-blue-200 active:bg-blue-300 active:scale-95 transition-all flex items-center justify-center shadow-lg"
        >
          <span className="text-4xl font-black text-blue-900">הקש כאן</span>
        </button>
        <p className="mt-6 text-gray-500 font-medium">מספר הקשות: {tapped}</p>

        <button
          onClick={() => navigate('/patient/serial7')}
          className="mt-16 py-5 px-12 rounded-xl bg-black text-white text-xl font-bold hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600"
        >
          המשך למשימה הבאה
        </button>
      </div>
    </div>
  );
}