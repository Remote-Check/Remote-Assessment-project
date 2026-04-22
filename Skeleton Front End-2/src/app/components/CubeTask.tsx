import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ListenButton } from "./ListenButton";
import { BaseCanvas } from "./BaseCanvas";
import { useAssessmentStore } from "../store/AssessmentContext";

export function CubeTask() {
  const navigate = useNavigate();
  const { state, updateTaskData } = useAssessmentStore();
  
  const savedData = state.tasks.cube || { strokes: [] };
  const [hasDrawn, setHasDrawn] = useState(savedData.strokes.length > 0);

  const handleDrawChange = (strokes: any[]) => {
    setHasDrawn(strokes.length > 0);
    updateTaskData('cube', { strokes });
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-3">
            2. העתקת קוביה
          </div>
          <h2 className="text-4xl font-extrabold text-black">
            העתק את הקוביה הבאה
          </h2>
          <p className="text-gray-600 font-medium mt-2 text-xl">
            נסה לדייק ככל האפשר
          </p>
        </div>
        <ListenButton text="העתק את הקוביה המוצגת למטה, השתדל לדייק עד כמה שניתן." size="lg" />
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex-1 flex flex-row gap-8 items-center justify-center">
        
        {/* Cube Reference Image Placeholder */}
        <div className="w-1/3 flex flex-col items-center justify-center border-l-2 border-gray-200 pl-8 h-[400px]">
           <div className="w-[200px] h-[200px] border-4 border-gray-800 flex items-center justify-center bg-white shadow-sm">
             <div className="w-full h-full relative">
               {/* Crude CSS Cube Representation */}
               <div className="absolute top-4 left-4 w-32 h-32 border-2 border-gray-800 bg-transparent"></div>
               <div className="absolute bottom-4 right-4 w-32 h-32 border-2 border-gray-800 bg-transparent"></div>
               <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <line x1="16" y1="16" x2="68" y2="68" stroke="#1f2937" strokeWidth="2" />
                  <line x1="144" y1="16" x2="196" y2="68" stroke="#1f2937" strokeWidth="2" />
                  <line x1="16" y1="144" x2="68" y2="196" stroke="#1f2937" strokeWidth="2" />
                  <line x1="144" y1="144" x2="196" y2="196" stroke="#1f2937" strokeWidth="2" />
               </svg>
             </div>
           </div>
           <p className="mt-6 text-gray-500 font-semibold">דוגמה להעתקה</p>
        </div>

        <div className="flex flex-col items-center">
          <BaseCanvas 
            width={500} 
            height={400} 
            initialStrokes={savedData.strokes}
            onDrawChange={handleDrawChange}
          />
        </div>
      </div>
    </div>
  );
}