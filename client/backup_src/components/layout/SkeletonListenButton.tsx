import { useState } from "react";
import { Volume2 } from "lucide-react";
import { clsx } from "clsx";

interface ListenButtonProps {
  text: string;
  size?: "md" | "lg";
  className?: string;
}

export function ListenButton({ text, size = "md", className }: ListenButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "he-IL";
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const isLg = size === "lg";

  return (
    <button
      onClick={handlePlay}
      aria-label={isPlaying ? "משמיע…" : "השמע הוראות"}
      className={clsx(
        "flex items-center gap-3 rounded-full font-bold transition-all whitespace-nowrap outline-none focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:ring-opacity-50",
        isLg ? "h-16 px-6 text-xl" : "h-[52px] px-5 text-lg",
        isPlaying ? "bg-black text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200",
        className
      )}
    >
      <span>{isPlaying ? "משמיע…" : "השמע הוראות"}</span>
      {isPlaying ? (
        <div className="flex gap-[2px] items-end h-5 w-5">
          <div className="w-[3px] bg-white rounded-full animate-[pulse_1s_ease-in-out_infinite_alternate]" style={{ height: "40%" }} />
          <div className="w-[3px] bg-white rounded-full animate-[pulse_0.8s_ease-in-out_infinite_alternate-reverse]" style={{ height: "80%" }} />
          <div className="w-[3px] bg-white rounded-full animate-[pulse_1.2s_ease-in-out_infinite_alternate]" style={{ height: "100%" }} />
          <div className="w-[3px] bg-white rounded-full animate-[pulse_0.9s_ease-in-out_infinite_alternate-reverse]" style={{ height: "60%" }} />
        </div>
      ) : (
        <Volume2 className={clsx(isLg ? "w-6 h-6" : "w-5 h-5")} />
      )}
    </button>
  );
}
