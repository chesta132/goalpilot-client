import callApi from "@/utils/callApi";
import { defaultGoalData } from "@/utils/defaultData";
import { handleError } from "@/utils/errorHandler";
import type { ErrorWithValues, GoalData } from "@/utils/types";
import { createContext, useState, type ReactNode } from "react";

type TGoalContent = {
  data: GoalData;
  getData: (goalId: string, load?: boolean) => void;
  setData: React.Dispatch<React.SetStateAction<GoalData>>;
  loading: boolean;
  error: ErrorWithValues;
  clearError: () => void;
  setError: React.Dispatch<React.SetStateAction<ErrorWithValues>>;
};

const GoalContext = createContext<TGoalContent>({
  data: defaultGoalData,
  getData: async () => {},
  setData: () => {},
  loading: true,
  error: { error: null },
  clearError: () => {},
  setError: () => {},
});

const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GoalData>(defaultGoalData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorWithValues>({ error: null });

  const getData = async (goalId: string, load: boolean = true) => {
    setLoading(load);
    try {
      const response = await callApi(`/goal?goalId=${goalId}`, { method: "GET", token: true });
      setData(response.data);
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
  };

  return <GoalContext.Provider value={contextValue}>{children}</GoalContext.Provider>;
};

export { GoalContext, GoalProvider };
