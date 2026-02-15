import { useState, useCallback, useEffect } from "react";
import FlipClock from "@/components/FlipClock";
import CountdownTimer from "@/components/CountdownTimer";
import PomodoroTimer from "@/components/PomodoroTimer";
import NavBar from "@/components/NavBar";
import SettingsPanel from "@/components/SettingsPanel";
import { Routes, Route, useLocation } from "react-router-dom";
import About from "./About";
import Themes from "./Themes";
import { useThemeApply } from "@/hooks/useThemeApply";

const Index = () => {
  useThemeApply();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const location = useLocation();

  const isTimerRoute = location.pathname === "/" || location.pathname.startsWith("/countdown") || location.pathname === "/pomodoro";

  // Auto-hide chrome after 3s of inactivity on timer routes
  useEffect(() => {
    if (!isTimerRoute || settingsOpen) return;
    const timer = setTimeout(() => setChromeVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [chromeVisible, isTimerRoute, settingsOpen]);

  // Always show chrome on non-timer routes
  useEffect(() => {
    if (!isTimerRoute) setChromeVisible(true);
  }, [isTimerRoute]);

  const handleScreenTap = useCallback(() => {
    if (!isTimerRoute) return;
    setChromeVisible((v) => !v);
  }, [isTimerRoute]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Parse countdown params from URL
  const getCountdownParams = () => {
    const path = location.pathname;
    const match = path.match(/\/countdown\/(\d+)h(\d+)m(\d+)s/);
    if (match) {
      return { hours: parseInt(match[1]), minutes: parseInt(match[2]), seconds: parseInt(match[3]) };
    }
    return undefined;
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-background"
      onClick={handleScreenTap}
    >
      <div
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-500 ${chromeVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <NavBar
          onSettingsClick={() => { setSettingsOpen(true); setChromeVisible(true); }}
          onFullscreen={toggleFullscreen}
        />
      </div>

      <main className={`flex flex-1 items-center justify-center px-4 w-full ${!isTimerRoute ? "pt-20" : ""}`}>
        <Routes>
          <Route path="/" element={<FlipClock />} />
          <Route path="/countdown" element={<CountdownTimer initialTime={getCountdownParams()} />} />
          <Route path="/countdown/:time" element={<CountdownTimer initialTime={getCountdownParams()} />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} />
          <Route path="/about" element={<About />} />
          <Route path="/themes" element={<Themes />} />
        </Routes>
      </main>

      <footer className={`pb-4 text-center transition-all duration-500 ${chromeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}`}>
        <p className="text-xs text-muted-foreground/50 tracking-wider">HIFOCUS</p>
      </footer>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Index;
