import { useState, useCallback } from "react";
import FlipClock from "@/components/FlipClock";
import CountdownTimer from "@/components/CountdownTimer";
import NavBar from "@/components/NavBar";
import SettingsPanel from "@/components/SettingsPanel";
import { Routes, Route, useLocation } from "react-router-dom";
import About from "./About";
import Themes from "./Themes";
import { useThemeApply } from "@/hooks/useThemeApply";

const Index = () => {
  useThemeApply();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();

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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <NavBar
        onSettingsClick={() => setSettingsOpen(true)}
        onFullscreen={toggleFullscreen}
      />

      <main className="flex flex-1 items-center justify-center px-4">
        <Routes>
          <Route path="/" element={<FlipClock />} />
          <Route path="/countdown" element={<CountdownTimer initialTime={getCountdownParams()} />} />
          <Route path="/countdown/:time" element={<CountdownTimer initialTime={getCountdownParams()} />} />
          <Route path="/about" element={<About />} />
          <Route path="/themes" element={<Themes />} />
        </Routes>
      </main>

      <footer className="pb-4 text-center">
        <p className="text-xs text-muted-foreground/50 tracking-wider">HIFOCUS</p>
      </footer>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Index;
