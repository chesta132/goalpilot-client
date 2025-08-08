import { createContext, useState, useEffect, type ReactNode } from "react";
import { generateAccentColors } from "@/utils/colorUtils";

export type ThemeSettings = {
  themeMode: "light" | "dark";
  accent: string;
  accentSoft: string;
  accentStrong: string;
  goalAccent: string;
  goalAccentSoft: string;
  goalAccentStrong: string;
  taskCard: "regular" | "compact";
  defaultGoalStatus: "active" | "completed" | "paused" | "canceled" | "pending" | "";
  defaultTaskDifficulty: "easy" | "medium" | "hard" | "very hard" | "";
  showGoalsShortcut: boolean;
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
  defaultGoalStatus: "",
  defaultTaskDifficulty: "",
  showGoalsShortcut: false,
};

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newValues: Partial<ThemeSettings>) => void;
  setToDefault: (valueToDefault: Partial<Record<keyof ThemeSettings, boolean | 0 | 1>>) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  setToDefault: () => {},
});

const getSettingsFromLocalStorage = (): ThemeSettings => {
  try {
    const storedSettings = localStorage.getItem("settings");
    if (!storedSettings) return defaultSettings;
    const parsedSettings: Partial<ThemeSettings> = JSON.parse(storedSettings);

    return {
      themeMode: parsedSettings.themeMode ?? defaultSettings.themeMode,
      accent: parsedSettings.accent ?? defaultSettings.accent,
      accentSoft: parsedSettings.accentSoft ?? defaultSettings.accentSoft,
      accentStrong: parsedSettings.accentStrong ?? defaultSettings.accentStrong,
      goalAccent: parsedSettings.goalAccent ?? defaultSettings.goalAccent,
      goalAccentSoft: parsedSettings.goalAccentSoft ?? defaultSettings.goalAccentSoft,
      goalAccentStrong: parsedSettings.goalAccentStrong ?? defaultSettings.goalAccentStrong,
      taskCard: parsedSettings.taskCard ?? defaultSettings.taskCard,
      defaultGoalStatus: parsedSettings.defaultGoalStatus ?? defaultSettings.defaultGoalStatus,
      defaultTaskDifficulty: parsedSettings.defaultTaskDifficulty ?? defaultSettings.defaultTaskDifficulty,
      showGoalsShortcut: parsedSettings.showGoalsShortcut ?? defaultSettings.showGoalsShortcut,
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
      "--goal-accent": settings.goalAccent,
      "--goal-accent-soft": settings.goalAccentSoft,
      "--goal-accent-strong": settings.goalAccentStrong,
      "color-scheme": settings.themeMode,
    };

    document.body.classList.add("change-theme");
    for (const [key, value] of Object.entries(dynamicCssVar)) {
      document.documentElement.style.setProperty(key, value);
    }

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
  };

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const setToDefault = (valueToDef: Partial<Record<keyof ThemeSettings, boolean | 0 | 1>>) => {
    let toUpdate = {} as ThemeSettings;
    for (const [k, value] of Object.entries(valueToDef)) {
      const key = k as keyof ThemeSettings;
      if (!value) continue;
      toUpdate = { ...toUpdate, [key]: defaultSettings[key] };
    }
    setSettings((prev) => ({ ...prev, ...toUpdate }));
  };

  const contextValue: ThemeContextType = {
    settings,
    updateSettings,
    setToDefault,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export { ThemeContext, ThemeProvider };
