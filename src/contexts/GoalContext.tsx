import callApi from "@/utils/callApi";
import { defaultGoalData } from "@/utils/defaultData";
import { handleError } from "@/utils/errorHandler";
import type { ErrorWithValues, GoalData } from "@/utils/types";
import { createContext, useState, type ReactNode } from "react";
import { useNotification, useUserData } from "./UseContexts";

type TGoalContent = {
  data: GoalData;
  getData: (goalId: string, load?: boolean) => Promise<void | string>;
  setData: React.Dispatch<React.SetStateAction<GoalData>>;
  loading: boolean;
  error: ErrorWithValues;
  clearError: () => void;
  setError: React.Dispatch<React.SetStateAction<ErrorWithValues>>;
  deleteGoal: () => Promise<void>;
};

const GoalContext = createContext<TGoalContent>({
  data: defaultGoalData,
  getData: async () => {},
  setData: () => {},
  loading: true,
  error: { error: null },
  clearError: () => {},
  setError: () => {},
  deleteGoal: async () => {},
});

const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GoalData>(defaultGoalData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorWithValues>({ error: null });
  const { openNotification } = useNotification();
  const { refetchData } = useUserData();

  const getData = async (goalId: string, load: boolean = true) => {
    setLoading(load);
    if (goalId === undefined) return "reload";
    try {
      const response = await callApi(`/goal?goalId=${goalId}`, { method: "GET", token: true });
      setData(response.data);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async (goalId: string) => {
    try {
      const response = await callApi("/goal/restore", { method: "PUT", token: true, body: { goalId } });
      refetchData(false);
      openNotification({ message: response.data.notification, button: "default" });
    } catch (err) {
      handleError(err, setError);
    }
  };

  const deleteGoal = async () => {
    setLoading(true);
    try {
      const response = await callApi("/goal", { method: "DELETE", token: true, body: { goalId: data._id } });
      openNotification({ message: response.data.notification, buttonFunc: { f: handleUndo, params: [data._id], label: "Undo" } });
      refetchData(false);
      setData(defaultGoalData);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError({ error: null });

  const contextValue = {
    data,
    setData,
    loading,
    error,
    getData,
    setError,
    clearError,
    deleteGoal,
  };

  return <GoalContext.Provider value={contextValue}>{children}</GoalContext.Provider>;
};

export { GoalContext, GoalProvider };
