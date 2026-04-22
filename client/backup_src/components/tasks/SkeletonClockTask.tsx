import { useState } from "react";
import { useNavigate } from "react-router";
import { ListenButton } from "../layout/SkeletonListenButton";
import { BaseCanvas } from "../BaseCanvas";

export function ClockTask() {
  const navigate = useNavigate();
  const [hasDrawn, setHasDrawn] = useState(false);

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-3">
            3. ציור שעון
          </div>
          <h2 className="text-4xl font-extrabold text-black">
            צייר שעון עגול וגדול
          </h2>
          <p className="text-gray-600 font-medium mt-2 text-xl">
            כולל את כל המספרים
            <br />
            הראה את השעה: <strong>עשרה לאחת-עשרה</strong> (11:10)
          </p>
        </div>
        <ListenButton text="צייר שעון, הכנס בו את כל המספרים וכוון את השעה לעשרה לאחת עשרה." size="lg" />
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex-1 flex flex-col items-center justify-center">
        <BaseCanvas 
           
          height={400} 
          onDrawChange={(strokes: any) => setHasDrawn(strokes.length > 0)}
        />
        
        <button
          onClick={() => navigate('/patient/naming')}
          disabled={!hasDrawn}
          className="mt-8 py-5 px-12 rounded-xl bg-black text-white text-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600"
        >
          המשך למשימה הבאה
        </button>
      </div>
    </div>
  );
}