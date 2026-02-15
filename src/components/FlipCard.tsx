import { useState, useEffect, useRef } from "react";

interface FlipCardProps {
  value: string;
  size?: "sm" | "md" | "lg";
}

const FlipCard = ({ value, size = "lg" }: FlipCardProps) => {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const mounted = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (value !== current) {
      setPrevious(current);
      setFlipping(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCurrent(value);
        setFlipping(false);
      }, 500);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [value]);

  const sizeMap = {
    sm: { outer: "h-16 w-12 sm:h-20 sm:w-14 md:h-28 md:w-20", text: "text-3xl sm:text-4xl md:text-6xl leading-[4rem] sm:leading-[5rem] md:leading-[7rem]" },
    md: { outer: "h-20 w-14 sm:h-32 sm:w-22 md:h-44 md:w-32 lg:h-52 lg:w-36", text: "text-4xl sm:text-6xl md:text-8xl lg:text-9xl leading-[5rem] sm:leading-[8rem] md:leading-[11rem] lg:leading-[13rem]" },
    lg: { outer: "h-28 w-20 sm:h-40 sm:w-28 md:h-52 md:w-36 lg:h-[17rem] lg:w-48", text: "text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] leading-[7rem] sm:leading-[10rem] md:leading-[13rem] lg:leading-[17rem]" },
  };

  const { outer, text } = sizeMap[size];
  const baseTextClass = `font-mono font-bold text-digit-foreground ${text} text-center w-full`;

  // Renders a half of a digit card
  const Half = ({ digit, half, className = "", style = {} }: { digit: string; half: "top" | "bottom"; className?: string; style?: React.CSSProperties }) => (
    <div
      className={`absolute inset-x-0 ${half === "top" ? "top-0 rounded-t-lg" : "bottom-0 rounded-b-lg"} h-1/2 overflow-hidden bg-digit ${className}`}
      style={style}
    >
      {/* Full-height container positioned so the correct half is visible */}
      <div
        className={baseTextClass}
        style={{
          position: "absolute",
          left: 0, right: 0,
          height: "200%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...(half === "top" ? { top: 0 } : { bottom: 0 }),
        }}
      >
        {digit}
      </div>
      {half === "bottom" && <div className="absolute inset-0 bg-foreground/[0.03]" />}
    </div>
  );

  return (
    <div className={`relative ${outer} select-none`} style={{ perspective: "600px" }}>
      {/* Static top: shows new when not flipping, prev when flipping */}
      <Half digit={flipping ? previous : current} half="top" />
      {/* Static bottom: always shows current (new) */}
      <Half digit={current} half="bottom" />

      {/* Animated top flap (falls away showing previous) */}
      {flipping && (
        <Half
          digit={previous}
          half="top"
          className="flip-top-animate z-20"
          style={{ transformOrigin: "bottom center", backfaceVisibility: "hidden" }}
        />
      )}

      {/* Animated bottom flap (reveals new) */}
      {flipping && (
        <Half
          digit={value}
          half="bottom"
          className="flip-bottom-animate z-20"
          style={{
            transform: "perspective(600px) rotateX(90deg)",
            transformOrigin: "top center",
            backfaceVisibility: "hidden",
          }}
        />
      )}

      {/* Center divider */}
      <div className="absolute inset-x-0 top-1/2 z-30 h-[2px] -translate-y-[1px] bg-background/40" />
    </div>
  );
};

export default FlipCard;
