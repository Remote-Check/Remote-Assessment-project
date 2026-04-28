import { useState } from "react";
import { ListenButton } from "./ListenButton";
import { clsx } from "clsx";
import { useAssessmentStore } from "../store/AssessmentContext";
import { DevStimulusNotice, useStimuliManifest } from "./StimuliManifestProvider";
import { DEFAULT_MOCA_VERSION, type MocaVersion } from "../../lib/scoring/moca-config";

interface NamingItem {
  id: "item-1" | "item-2" | "item-3";
  assetId: "item-1" | "item-2" | "item-3";
}

const NAMING_ITEMS_BY_VERSION: Record<MocaVersion, NamingItem[]> = {
  "8.1": [
    { id: "item-1", assetId: "item-1" },
    { id: "item-2", assetId: "item-2" },
    { id: "item-3", assetId: "item-3" },
  ],
  "8.2": [
    { id: "item-1", assetId: "item-1" },
    { id: "item-2", assetId: "item-2" },
    { id: "item-3", assetId: "item-3" },
  ],
  "8.3": [
    { id: "item-1", assetId: "item-1" },
    { id: "item-2", assetId: "item-2" },
    { id: "item-3", assetId: "item-3" },
  ],
};

export function NamingTask() {
  const { state, updateTaskData } = useAssessmentStore();
  const { getAsset, isLoading } = useStimuliManifest();
  const [currentIndex, setCurrentIndex] = useState(0);
  const mocaVersion = (state.scoringContext?.mocaVersion ?? DEFAULT_MOCA_VERSION) as MocaVersion;
  const namingItems = NAMING_ITEMS_BY_VERSION[mocaVersion] ?? NAMING_ITEMS_BY_VERSION[DEFAULT_MOCA_VERSION];
  
  const savedData = state.tasks.naming || { answers: {} };
  const [answers, setAnswers] = useState<Record<string, string>>(savedData.answers);

  const currentAnimal = namingItems[currentIndex];
  const stimulusAsset = getAsset("moca-naming", currentAnimal.assetId);
  const imageSrc = stimulusAsset?.signedUrl ?? null;
  const selectedAnswer = answers[currentAnimal.id];
  const answeredCount = namingItems.filter((item) => answers[item.id]).length;
  const isComplete = answeredCount === namingItems.length;

  const handleAnswerChange = (answer: string) => {
    const nextAnswers = { ...answers, [currentAnimal.id]: answer };
    setAnswers(nextAnswers);
    updateTaskData('naming', { answers: nextAnswers });
  };

  const handleNext = () => {
    if (currentIndex < namingItems.length - 1) {
      setCurrentIndex((prev: number) => prev + 1);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl min-w-0 flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="text-gray-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-2 sm:mb-3">
            משימת שיום · פריט {currentIndex + 1} מתוך {namingItems.length}
          </div>
          <h2 className="text-2xl font-extrabold leading-tight text-black sm:text-3xl">
            מה שם החיה בתמונה?
          </h2>
        </div>
        <ListenButton text="מה שם החיה בתמונה?" size="lg" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
        <div className="flex gap-2" aria-label="התקדמות פריטי השיום">
          {namingItems.map((item, i) => {
            const itemAnswered = !!answers[item.id];
            const isCurrent = i === currentIndex;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(i)}
                disabled={!itemAnswered && !isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`פריט ${i + 1}${itemAnswered ? " נבחרה תשובה" : ""}`}
                className={clsx(
                  "h-3 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600",
                  isCurrent ? "w-12 bg-black" : "w-8",
                  itemAnswered && !isCurrent ? "bg-gray-500" : "bg-gray-200",
                  !itemAnswered && !isCurrent ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                )}
              />
            );
          })}
        </div>
        <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-extrabold text-gray-700" aria-live="polite">
          נבחרו {answeredCount} מתוך {namingItems.length}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:rounded-2xl sm:p-5 md:grid-cols-[minmax(240px,0.85fr)_minmax(300px,1fr)] md:gap-5">
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:min-h-[260px] sm:p-5">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="תמונת חיה לזיהוי"
              className="aspect-square w-full max-w-[260px] rounded-lg object-contain shadow-inner grayscale contrast-125 sm:max-w-[300px] lg:max-w-[320px]"
            />
          ) : !isLoading ? (
            <DevStimulusNotice className="w-full text-center" />
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-3 sm:gap-4">
          <div className="text-center text-base font-medium text-gray-500 sm:text-lg">
            כתוב את שם החיה כפי שנאמר
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <label className="sr-only" htmlFor={`naming-answer-${currentAnimal.id}`}>
              שם החיה
            </label>
            <input
              id={`naming-answer-${currentAnimal.id}`}
              type="text"
              dir="rtl"
              value={selectedAnswer ?? ""}
              onChange={(event) => handleAnswerChange(event.target.value)}
              className="min-h-16 rounded-xl border-2 border-gray-200 bg-white px-5 text-center text-2xl font-extrabold text-gray-950 outline-none transition-colors focus:border-black focus:ring-4 focus:ring-black/10 sm:min-h-20 sm:px-6 sm:text-3xl"
              autoComplete="off"
              inputMode="text"
            />
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:mt-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="min-h-12 rounded-xl border border-gray-200 bg-white px-5 text-base font-extrabold text-gray-800 transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600"
            >
              לפריט הקודם
            </button>

            {currentIndex < namingItems.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedAnswer?.trim()}
                className="min-h-12 rounded-xl bg-black px-5 text-base font-extrabold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600"
              >
                לפריט הבא
              </button>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-extrabold text-gray-700" role="status" aria-live="polite">
            {isComplete
              ? "כל פריטי השיום נרשמו. אפשר להמשיך למשימה הבאה."
              : selectedAnswer?.trim()
                ? "התשובה נשמרה. אפשר לעבור לפריט הבא."
                : "כתוב תשובה כדי להמשיך לפריט הבא."}
          </div>
        </div>
      </div>
    </div>
  );
}
