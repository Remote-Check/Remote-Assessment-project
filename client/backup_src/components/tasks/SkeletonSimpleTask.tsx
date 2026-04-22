import { useNavigate } from "react-router";
import { ListenButton } from "../layout/SkeletonListenButton";

export function SimpleTask({
  stepNumber,
  stepTitle,
  mainTitle,
  description,
  audioText,
  nextRoute,
}: {
  stepNumber: number;
  stepTitle: string;
  mainTitle: string;
  description: React.ReactNode;
  audioText: string;
  nextRoute: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-3">
            {stepNumber}. {stepTitle}
          </div>
          <h2 className="text-4xl font-extrabold text-black">{mainTitle}</h2>
        </div>
        <ListenButton text={audioText} size="lg" />
      </div>

      <div className="bg-gray-50 p-10 rounded-2xl border border-gray-100 flex-1 min-h-[500px] flex flex-col justify-center items-center text-center">
        <div className="text-gray-600 font-medium mb-12 text-2xl max-w-2xl">
          {description}
        </div>
        
        <button
          onClick={() => navigate(nextRoute)}
          className="py-5 px-12 rounded-xl bg-black text-white text-xl font-bold hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600"
        >
          {nextRoute === '/dashboard' ? 'סיים מבדק' : 'המשך למשימה הבאה'}
        </button>
      </div>
    </div>
  );
}