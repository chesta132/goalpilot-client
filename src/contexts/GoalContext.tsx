import callApi from "@/utils/callApi";
import { defaultGoalData } from "@/utils/defaultData";
import { handleError } from "@/utils/errorHandler";
import type { GoalData, TError } from "@/types/types";
import { createContext, useState, type ReactNode } from "react";
import { useNotification, useUserData } from "./UseContexts";

type TGoalContent = {
  data: GoalData;
  getData: (goalId?: string, load?: boolean) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<GoalData>>;
  loading: boolean;
  error: GoalData & TError;
  clearError: () => void;
  setError: React.Dispatch<React.SetStateAction<GoalData & TError>>;
  deleteGoal: () => Promise<void>;
};

const GoalContext = createContext<TGoalContent>({
  data: defaultGoalData,
  getData: async () => {},
  setData: () => {},
  loading: true,
  error: { ...defaultGoalData, error: null, status: "" },
  clearError: () => {},
  setError: () => {},
  deleteGoal: async () => {},
});

const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GoalData>(defaultGoalData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GoalData & TError>({ ...defaultGoalData, error: null, status: "" });
  const { openNotification } = useNotification();
  const { refetchData } = useUserData();

  const getData = async (goalId?: string, load: boolean = true) => {
    setLoading(load);
    try {
      const response = await callApi(`/goal?goalId=${goalId || data._id}`, { method: "GET" });
      setData(response.data);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async (goalId: string) => {
    try {
      const response = await callApi("/goal/restore", { method: "PUT", body: { goalId } });
      refetchData(false);
      openNotification({ message: response.data.notification, button: "default" });
    } catch (err) {
      handleError(err, setError);
    }
  };

  const deleteGoal = async () => {
    setLoading(true);
    try {
      const response = await callApi("/goal", { method: "DELETE", body: { goalId: data._id } });
      openNotification({ message: response.data.notification, buttonFunc: { f: handleUndo, params: [data._id], label: "Undo" } });
      refetchData(false);
      setData(defaultGoalData);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError({ ...defaultGoalData, error: null, status: "" });

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
