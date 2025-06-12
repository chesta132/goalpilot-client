import { useContext } from "react";
import { UserContext, UserProvider } from "./UserContext";
import { ThemeContext, ThemeProvider } from "./ThemeContext";
import { NotificationContext, NotificationProvider } from "./NotificationContext";

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { useUserData, UserProvider, useTheme, ThemeProvider, useNotification, NotificationProvider };
