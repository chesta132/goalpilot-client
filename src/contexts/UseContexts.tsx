import { useContext } from "react";
import { UserContext, UserProvider } from "./UserContext";
import { ThemeContext, ThemeProvider } from "./ThemeContext";
import { NotificationContext, NotificationProvider } from "./NotificationContext";
import { GoalContext, GoalProvider } from "./GoalContext";
import { TaskContext, TaskProvider } from "./TaskContext";
import { SearchContext, SearchProvider } from "./SearchContext";
import { FriendContext, FriendProvider } from "./FriendContext";

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
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const useGoalData = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error("useGoalData must be used within a GoalProvider");
  }
  return context;
};

const useTaskData = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskData must be used within a TaskProvider");
  }
  return context;
};

const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

const useFriend = () => {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error("useFriend must be used within a FriendProvider");
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
  useSearch,
  SearchProvider,
  useFriend,
  FriendProvider,
};
