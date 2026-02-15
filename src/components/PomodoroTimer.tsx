import { useState, useEffect, useCallback, useRef } from "react";
import FlipCard from "./FlipCard";
import { useSettings } from "@/contexts/SettingsContext";
import { playSound } from "@/lib/sounds";
import { Play, Pause, RotateCcw, Minus, Plus } from "lucide-react";

const PomodoroTimer = () => {
  const { settings } = useSettings();
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const totalSeconds = duration * 60;

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            playSound(settings.alertSound);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Auto-hide controls when running
  useEffect(() => {
    if (isRunning) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
    } else {
      setControlsVisible(true);
    }
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, [isRunning, controlsVisible]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (!isRunning) return;
    e.stopPropagation();
    setControlsVisible((v) => !v);
  }, [isRunning]);

  const start = useCallback(() => {
    if (isComplete) {
      setRemaining(totalSeconds);
      setIsComplete(false);
    }
    setIsRunning(true);
  }, [isComplete, totalSeconds]);

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setIsComplete(false);
    setRemaining(totalSeconds);
  };

  const adjustDuration = (delta: number) => {
    if (isRunning) return;
    const next = Math.max(2, Math.min(120, duration + delta));
    setDuration(next);
    setRemaining(next * 60);
    setIsComplete(false);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  const m = pad(minutes);
  const s = pad(seconds);

  const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in" onClick={handleContainerClick}>
      {/* Duration adjuster */}
      {!isRunning && remaining === totalSeconds && !isComplete && (
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); adjustDuration(-1); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:scale-110 hover:text-foreground active:scale-95"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="font-mono text-3xl text-foreground tabular-nums">
            {duration}<span className="ml-1 text-lg text-muted-foreground">min</span>
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); adjustDuration(1); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:scale-110 hover:text-foreground active:scale-95"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Clock display */}
      <div className={`flex items-center gap-2 sm:gap-3 md:gap-4 ${isComplete ? "animate-pulse" : ""}`}>
        <FlipCard value={m[0]} />
        <FlipCard value={m[1]} />
        <div className="flex flex-col gap-3 px-1 sm:gap-4 sm:px-2">
          <div className={`h-3 w-3 rounded-full sm:h-4 sm:w-4 ${isRunning ? "bg-primary animate-pulse-glow" : "bg-muted-foreground/40"}`} />
          <div className={`h-3 w-3 rounded-full sm:h-4 sm:w-4 ${isRunning ? "bg-primary animate-pulse-glow" : "bg-muted-foreground/40"}`} />
        </div>
        <FlipCard value={s[0]} />
        <FlipCard value={s[1]} />
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full max-w-md overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls - hide when running and controlsVisible is false */}
      <div className={`flex items-center gap-4 transition-all duration-500 ${controlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        {!isRunning ? (
          <button
            onClick={(e) => { e.stopPropagation(); start(); }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-95"
          >
            <Play className="ml-0.5 h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); pause(); }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform hover:scale-110 active:scale-95"
          >
            <Pause className="h-6 w-6" />
          </button>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); reset(); }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:scale-110 hover:text-foreground active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {isComplete && (
        <p className="text-lg font-medium text-primary animate-pulse">Focus session complete!</p>
      )}
    </div>
  );
};

export default PomodoroTimer;
