import { useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { getTheme } from "@/lib/themes";

/** Applies the active theme's CSS custom properties to :root */
export const useThemeApply = () => {
  const { settings } = useSettings();

  useEffect(() => {
    const theme = getTheme(settings.theme);
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [settings.theme]);
};
