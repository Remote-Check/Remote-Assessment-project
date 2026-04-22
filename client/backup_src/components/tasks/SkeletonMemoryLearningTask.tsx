import { ListenButton } from "../layout/SkeletonListenButton";
import { useNavigate } from "react-router";
import { clsx } from "clsx";

export function MemoryTask() {
  const navigate = useNavigate();
  // 5 words for MoCA memory in Hebrew
  const words = ["פנים", "קטיפה", "כנסייה", "חרצית", "אדום"];
  
  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-3">
            משימת זיכרון · למידה
          </div>
          <h2 className="text-4xl font-extrabold text-black">זכור את המילים הבאות</h2>
        </div>
        <ListenButton text="פנים, קטיפה, כנסייה, חרצית, אדום" size="lg" />
      </div>

      <div className="bg-gray-50 p-10 rounded-2xl border border-gray-100 flex-1 min-h-[500px] flex flex-col justify-center items-center text-center">
        <div className="text-gray-600 font-medium mb-12 text-2xl max-w-2xl">
          המערכת תקריא 5 מילים. עליך להקשיב היטב, לזכור אותן, ולחזור עליהן כעת.
          <br /><br />
          תתבקש לחזור עליהן שוב בסוף המבדק.
        </div>
        
        <div className="flex gap-4 justify-center flex-wrap mb-16">
          {words.map((word, i) => (
            <div key={i} className="bg-white shadow-sm border-2 border-gray-100 text-black rounded-xl px-10 py-6 text-3xl font-bold">
              {word}
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="py-5 px-12 rounded-xl bg-black text-white text-xl font-bold hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600"
        >
          המשך למשימה הבאה
        </button>
      </div>
    </div>
  );
}