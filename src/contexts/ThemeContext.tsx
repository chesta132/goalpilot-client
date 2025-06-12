import { createContext, useState, useEffect, type ReactNode } from "react";
import { generateAccentColors } from "@/utils/colorUtils";

type ThemeSettings = {
  themeMode: "light" | "dark";
  accent: string;
  accentSoft: string;
  accentStrong: string;
};

const defaultSettings: ThemeSettings = {
  themeMode: "light",
  accent: "#66b2ff",
  accentSoft: "#9fcfff",
  accentStrong: "#2a94ff",
};

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newValues: Partial<ThemeSettings>) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
});

const getSettingsFromLocalStorage = (): ThemeSettings => {
  try {
    const storedSettings = localStorage.getItem("settings");
    const parsedSettings: Partial<ThemeSettings> = storedSettings ? JSON.parse(storedSettings) : {};

    return {
      themeMode: parsedSettings.themeMode ?? defaultSettings.themeMode,
      accent: parsedSettings.accent ?? defaultSettings.accent,
      accentSoft: parsedSettings.accentSoft ?? defaultSettings.accentSoft,
      accentStrong: parsedSettings.accentStrong ?? defaultSettings.accentStrong,
    };
  } catch (error) {
    console.error("Failed to parse settings from localStorage:", error);
    return defaultSettings;
  }
};

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ThemeSettings>(getSettingsFromLocalStorage());

  useEffect(() => {
    const dynamicCssVar = {
      "--theme": settings.themeMode === "light" ? "#fafbfc" : "#2c2c2c",
      "--theme-dark": settings.themeMode === "light" ? "#f3f3f3" : "#1e1e1e",
      "--theme-darker": settings.themeMode === "light" ? "#e5e8ea" : "#0f0f0f",
      "--theme-reverse": settings.themeMode === "light" ? "#2c2c2c" : "#fafbfc",
      "--theme-reverse-dark": settings.themeMode === "light" ? "#1e1e1e" : "#d2d2d2",
      "--theme-reverse-darker": settings.themeMode === "light" ? "#0e0e0e" : "#b1b1b1",
      "--accent": settings.accent,
      "--accent-soft": settings.accentSoft,
      "--accent-strong": settings.accentStrong,
    };

    for (const [key, value] of Object.entries(dynamicCssVar)) {
      document.documentElement.style.setProperty(key, value);
    }

    return () => {
      for (const [key] of Object.entries(dynamicCssVar)) {
        document.documentElement.style.removeProperty(key);
      }
    };
  }, [settings]);

  const updateSettings = (newValues: Partial<ThemeSettings>) => {
    let updated = { ...settings, ...newValues };
    if (newValues.accent && newValues.accent !== settings.accent) {
      const generatedColors = generateAccentColors(newValues.accent);
      updated = {
        ...updated,
        accent: generatedColors.accent,
        accentSoft: generatedColors.accentSoft,
        accentStrong: generatedColors.accentStrong,
      };
    }
    setSettings(updated);
    localStorage.setItem("settings", JSON.stringify(updated));
  };

  const contextValue: ThemeContextType = {
    settings,
    updateSettings,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export { ThemeContext, ThemeProvider };
