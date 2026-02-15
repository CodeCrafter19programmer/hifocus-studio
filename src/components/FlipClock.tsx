import { useState, useEffect } from "react";
import FlipCard from "./FlipCard";
import { useSettings } from "@/contexts/SettingsContext";

const FlipClock = () => {
  const { settings } = useSettings();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  let hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const isPM = hours >= 12;

  if (!settings.is24Hour) {
    hours = hours % 12 || 12;
  }

  const pad = (n: number) => n.toString().padStart(2, "0");
  const h = pad(hours);
  const m = pad(minutes);
  const s = pad(seconds);

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <FlipCard value={h[0]} />
        <FlipCard value={h[1]} />

        <div className="flex flex-col gap-3 px-1 sm:gap-4 sm:px-2">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow sm:h-4 sm:w-4" />
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow sm:h-4 sm:w-4" />
        </div>

        <FlipCard value={m[0]} />
        <FlipCard value={m[1]} />

        {settings.showSeconds && (
          <>
            <div className="flex flex-col gap-3 px-1 sm:gap-4 sm:px-2">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse-glow sm:h-3 sm:w-3" />
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse-glow sm:h-3 sm:w-3" />
            </div>
            <FlipCard value={s[0]} size="md" />
            <FlipCard value={s[1]} size="md" />
          </>
        )}

        {!settings.is24Hour && (
          <span className="ml-2 self-end pb-2 font-mono text-lg text-muted-foreground sm:text-xl">
            {isPM ? "PM" : "AM"}
          </span>
        )}
      </div>

      {settings.showDate && (
        <p className="text-sm tracking-widest text-muted-foreground sm:text-base">
          {dateStr}
        </p>
      )}
    </div>
  );
};

export default FlipClock;
