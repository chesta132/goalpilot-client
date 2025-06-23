import { useContext } from "react";
import { UserContext, UserProvider } from "./UserContext";
import { ThemeContext, ThemeProvider } from "./ThemeContext";
import { NotificationContext, NotificationProvider } from "./NotificationContext";
import { GoalContext, GoalProvider } from "./GoalContext";
import { TaskContext, TaskProvider } from "./TaskContext";

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

const useGoalData = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

const useTaskData = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

/* eslint-disable react-refresh/only-export-components */
export {
  useUserData,
  UserProvider,
  useTheme,
  ThemeProvider,
  useNotification,
  NotificationProvider,
  useGoalData,
  GoalProvider,
  useTaskData,
  TaskProvider,
};
