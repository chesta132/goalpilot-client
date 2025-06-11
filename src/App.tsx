import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./pages/Sign In/SignIn.tsx";
import SignUp from "./pages/Sign Up/SignUp.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Callback from "./pages/Google Callback/Callback.tsx";
import { useEffect } from "react";

type Settings = {
  lightDark: "light" | "dark";
  accent: string;
  accentSoft: string;
  accentStrong: string;
};

const App = () => {
  const defaultSettings: Settings = { lightDark: "light", accent: "#66b2ff", accentSoft: "#9fcfff", accentStrong: "#2a94ff" };
  const currentSettings: Settings = JSON.parse(localStorage.getItem("settings") || "{}");

  const newSettings = {
    lightDark: currentSettings.lightDark ?? defaultSettings.lightDark,
    accent: currentSettings.accent ?? defaultSettings.accent,
    accentSoft: currentSettings.accentSoft ?? defaultSettings.accentSoft,
    accentStrong: currentSettings.accentStrong ?? defaultSettings.accentStrong,
  };
  if (
    newSettings.lightDark !== currentSettings.lightDark ||
    newSettings.accent !== currentSettings.accent ||
    newSettings.accentSoft !== currentSettings.accentSoft ||
    newSettings.accentStrong !== currentSettings.accentStrong
  ) {
    localStorage.setItem("settings", JSON.stringify(newSettings));
  }
  const nextSettings: Settings = JSON.parse(localStorage.getItem("settings")!);

  useEffect(() => {
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
  }, [nextSettings]);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" index element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/google/callback" element={<Callback />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/goal/:goalId" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
