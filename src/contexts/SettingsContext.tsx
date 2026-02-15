import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Settings {
  is24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  theme: "midnight" | "espresso" | "denim" | "coral" | "vintage" | "emerald" | "industrial";
}

const defaultSettings: Settings = {
  is24Hour: true,
  showSeconds: true,
  showDate: true,
  theme: "midnight",
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be inside SettingsProvider");
  return ctx;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem("hifocus-settings");
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem("hifocus-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
