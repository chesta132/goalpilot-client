type Settings = {
  lightDark: "light" | "dark";
  accent: string;
  accentSoft: string;
  accentStrong: string;
};

const defaultSettings: Settings = { lightDark: "light", accent: "#66b2ff", accentSoft: "#9fcfff", accentStrong: "#2a94ff" };
const currentSettings: Settings = JSON.parse(localStorage.getItem("settings") || "{}");

const newSettings = {
  lightDark: currentSettings.lightDark ?? defaultSettings.lightDark,
  accent: currentSettings.accent ?? defaultSettings.accent,
  accentSoft: currentSettings.accentSoft ?? defaultSettings.accentSoft,
  accentStrong: currentSettings.accentStrong ?? defaultSettings.accentStrong,
};
const setSettings = () => {
  if (
    newSettings.lightDark !== currentSettings.lightDark ||
    newSettings.accent !== currentSettings.accent ||
    newSettings.accentSoft !== currentSettings.accentSoft ||
    newSettings.accentStrong !== currentSettings.accentStrong
  ) {
    localStorage.setItem("settings", JSON.stringify(newSettings));
  }
};

setSettings();

// const nextSettings: Settings = JSON.parse(localStorage.getItem("settings")!);

const getSettings = (): Settings => {
  const currentSettings: Settings = JSON.parse(localStorage.getItem("settings")!);
  return {
    lightDark: currentSettings.lightDark ?? defaultSettings.lightDark,
    accent: currentSettings.accent ?? defaultSettings.accent,
    accentSoft: currentSettings.accentSoft ?? defaultSettings.accentSoft,
    accentStrong: currentSettings.accentStrong ?? defaultSettings.accentStrong,
  };
};

// Set theme function to body
const setTheme = () => {
  const nextSettings = getSettings();
  const dynamicCssVar = {
    "--theme": nextSettings.lightDark === "light" ? "#fafbfc" : "#2c2c2c",
    "--theme-dark": nextSettings.lightDark === "light" ? "#f3f3f3" : "#1e1e1e",
    "--theme-darker": nextSettings.lightDark === "light" ? "#e5e8ea" : "#0f0f0f",
    "--theme-reverse": nextSettings.lightDark === "light" ? "#2c2c2c" : "#fafbfc",
    "--theme-reverse-dark": nextSettings.lightDark === "light" ? "#1e1e1e" : "#d2d2d2",
    "--theme-reverse-darker": nextSettings.lightDark === "light" ? "#0e0e0e" : "#b1b1b1",

    "--accent": nextSettings.accent,
    "--accent-soft": nextSettings.accentSoft,
    "--accent-strong": nextSettings.accentStrong,
  };

  for (const [key, value] of Object.entries(dynamicCssVar)) {
    document.documentElement.style.setProperty(key, value);
  }

  return () => {
    for (const [key] of Object.entries(dynamicCssVar)) {
      document.documentElement.style.removeProperty(key);
    }
  };
};

export { setTheme, setSettings, getSettings };
