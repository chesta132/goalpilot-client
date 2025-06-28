import { createContext, useState, useEffect, type ReactNode } from "react";
import { generateAccentColors } from "@/utils/colorUtils";
import { useGoalData } from "./UseContexts";

type ThemeSettings = {
  themeMode: "light" | "dark";
  accent: string;
  accentSoft: string;
  accentStrong: string;
  goalAccent: string;
  goalAccentSoft: string;
  goalAccentStrong: string;
  taskCard: "regular" | "compact";
};

const defaultSettings: ThemeSettings = {
  themeMode: "light",
  accent: "#66b2ff",
  accentSoft: "#9fcfff",
  accentStrong: "#2a94ff",
  goalAccent: "#66b2ff",
  goalAccentSoft: "#9fcfff",
  goalAccentStrong: "#2a94ff",
  taskCard: "regular",
};

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newValues: Partial<ThemeSettings>) => void;
  dark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  dark: false,
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
      goalAccent: parsedSettings.goalAccent ?? defaultSettings.goalAccent,
      goalAccentSoft: parsedSettings.goalAccentSoft ?? defaultSettings.goalAccentSoft,
      goalAccentStrong: parsedSettings.goalAccentStrong ?? defaultSettings.goalAccentStrong,
      taskCard: parsedSettings.taskCard ?? defaultSettings.taskCard,
    };
  } catch (error) {
    console.error("Failed to parse settings from localStorage:", error);
    return defaultSettings;
  }
};

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ThemeSettings>(getSettingsFromLocalStorage());
  const [dark, setDark] = useState(false);
  const { data: goalData } = useGoalData();

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
      "--goal-accent": settings.goalAccent,
      "--goal-accent-soft": settings.goalAccentSoft,
      "--goal-accent-strong": settings.goalAccentStrong,
    };

    for (const [key, value] of Object.entries(dynamicCssVar)) {
      document.documentElement.style.setProperty(key, value);
    }

    document.body.classList.add("change-theme");

    setTimeout(() => {
      document.body.classList.remove("change-theme");
    }, 170);

    return () => {
      for (const [key] of Object.entries(dynamicCssVar)) {
        document.documentElement.style.removeProperty(key);
      }
      document.body.classList.remove("change-theme");
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

  useEffect(() => {
    if (goalData.color && goalData.color !== settings.goalAccent) {
      const generatedColors = generateAccentColors(goalData.color);
      setSettings((prev) => ({
        ...prev,
        goalAccent: generatedColors.accent,
        goalAccentSoft: generatedColors.accentSoft,
        goalAccentStrong: generatedColors.accentStrong,
      }));

      localStorage.setItem("settings", JSON.stringify(settings));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalData.color]);

  useEffect(() => {
    if (settings.themeMode === "light") setDark(false);
    else setDark(true);
  }, [settings]);

  const contextValue: ThemeContextType = {
    settings,
    updateSettings,
    dark,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export { ThemeContext, ThemeProvider };
