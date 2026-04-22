import { useState, useEffect, useRef } from "react";
import { Play, Pause, AlertTriangle } from "lucide-react";
import { AudioStore } from "../store/audioStore";

export function PlaybackAudio({ audioId }: { audioId: string | null }) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioId) return;

    let url: string | null = null;

    if (audioId.startsWith('http')) {
      setAudioUrl(audioId);
    } else {
      AudioStore.getAudio(audioId)
        .then(blob => {
          if (blob) {
            url = URL.createObjectURL(blob);
            setAudioUrl(url);
          } else {
            setError("לא נמצאה הקלטה עבור משימה זו.");
          }
        })
        .catch(err => {
          console.error("Failed to load audio:", err);
          setError("אירעה שגיאה בטעינת ההקלטה.");
        });
    }

    return () => {
      if (url && !url.startsWith('http')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [audioId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const setAudioData = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!audioId) {
    return (
      <div className="w-full p-8 bg-gray-50 border border-gray-200 border-dashed rounded-xl flex items-center justify-center text-gray-400 font-medium">
        המטופל לא הקליט תשובה במשימה זו.
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center justify-center gap-3 font-medium">
        <AlertTriangle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  if (!audioUrl) {
    return (
      <div className="w-full p-8 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 font-medium animate-pulse">
        טוען הקלטה...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 mx-auto">
      <audio ref={audioRef} src={audioUrl} className="hidden" />
      
      <button 
        onClick={togglePlayback}
        className="w-12 h-12 flex-shrink-0 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600"
        aria-label={isPlaying ? "השהה ניגון" : "הפעל ניגון"}
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
      </button>
      
      <div className="flex-1 flex flex-col gap-1">
        <input 
          type="range" 
          min="0" 
          max={duration || 1} 
          step="0.01" 
          value={progress}
          onChange={handleScrub}
          className="w-full accent-black cursor-pointer"
          aria-label="ציר זמן הקלטה"
        />
        <div className="flex justify-between text-xs font-mono font-bold text-gray-500">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}