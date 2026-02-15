import { useState, useEffect, useCallback, useRef } from "react";
import FlipCard from "./FlipCard";
import { Play, Pause, RotateCcw } from "lucide-react";

interface CountdownTimerProps {
  initialTime?: { hours: number; minutes: number; seconds: number };
}

const CountdownTimer = ({ initialTime }: CountdownTimerProps) => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [inputH, setInputH] = useState(initialTime?.hours?.toString() ?? "0");
  const [inputM, setInputM] = useState(initialTime?.minutes?.toString() ?? "10");
  const [inputS, setInputS] = useState(initialTime?.seconds?.toString() ?? "0");
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (initialTime) {
      const total = initialTime.hours * 3600 + initialTime.minutes * 60 + initialTime.seconds;
      setTotalSeconds(total);
      setRemaining(total);
    }
  }, []);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
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

  const start = useCallback(() => {
    if (remaining === 0 && !isRunning) {
      const total = parseInt(inputH || "0") * 3600 + parseInt(inputM || "0") * 60 + parseInt(inputS || "0");
      if (total <= 0) return;
      setTotalSeconds(total);
      setRemaining(total);
      setIsComplete(false);
    }
    setIsRunning(true);
  }, [remaining, isRunning, inputH, inputM, inputS]);

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setIsComplete(false);
    setRemaining(totalSeconds);
  };

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const h = pad(hours);
  const m = pad(minutes);
  const s = pad(seconds);

  const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      {/* Input row when not running and no time set */}
      {!isRunning && remaining === 0 && !isComplete && (
        <div className="flex items-center gap-3">
          {[
            { value: inputH, set: setInputH, label: "h" },
            { value: inputM, set: setInputM, label: "m" },
            { value: inputS, set: setInputS, label: "s" },
          ].map(({ value, set, label }) => (
            <div key={label} className="flex items-end gap-1">
              <input
                type="number"
                min={0}
                max={label === "h" ? 99 : 59}
                value={value}
                onChange={(e) => set(e.target.value)}
                className="w-16 rounded-lg border border-border bg-secondary px-3 py-2 text-center font-mono text-xl text-foreground outline-none focus:ring-2 focus:ring-primary sm:w-20 sm:text-2xl"
              />
              <span className="pb-2 text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Clock display */}
      <div className={`flex items-center gap-2 sm:gap-3 md:gap-4 ${isComplete ? "animate-pulse" : ""}`}>
        <FlipCard value={h[0]} />
        <FlipCard value={h[1]} />
        <div className="flex flex-col gap-3 px-1 sm:gap-4 sm:px-2">
          <div className={`h-3 w-3 rounded-full sm:h-4 sm:w-4 ${isRunning ? "bg-primary animate-pulse-glow" : "bg-muted-foreground/40"}`} />
          <div className={`h-3 w-3 rounded-full sm:h-4 sm:w-4 ${isRunning ? "bg-primary animate-pulse-glow" : "bg-muted-foreground/40"}`} />
        </div>
        <FlipCard value={m[0]} />
        <FlipCard value={m[1]} />
        <div className="flex flex-col gap-3 px-1 sm:gap-4 sm:px-2">
          <div className={`h-2 w-2 rounded-full sm:h-3 sm:w-3 ${isRunning ? "bg-muted-foreground/40 animate-pulse-glow" : "bg-muted-foreground/20"}`} />
          <div className={`h-2 w-2 rounded-full sm:h-3 sm:w-3 ${isRunning ? "bg-muted-foreground/40 animate-pulse-glow" : "bg-muted-foreground/20"}`} />
        </div>
        <FlipCard value={s[0]} size="md" />
        <FlipCard value={s[1]} size="md" />
      </div>

      {/* Progress bar */}
      {totalSeconds > 0 && (
        <div className="h-1 w-full max-w-md overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isRunning ? (
          <button
            onClick={start}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-95"
          >
            <Play className="ml-0.5 h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={pause}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform hover:scale-110 active:scale-95"
          >
            <Pause className="h-6 w-6" />
          </button>
        )}

        <button
          onClick={reset}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:scale-110 hover:text-foreground active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {isComplete && (
        <p className="text-lg font-medium text-primary animate-pulse">Time's up!</p>
      )}
    </div>
  );
};

export default CountdownTimer;
