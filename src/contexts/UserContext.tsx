import { createContext, useState, useEffect, type ReactNode } from "react";
import callApi from "@/utils/callApi";
import { handleError } from "@/utils/errorHandler";
import type { UserData, TError } from "@/utils/types";
import { defaultUserData } from "@/utils/defaultData";

interface IUserContent {
  data: UserData | null;
  setData: React.Dispatch<React.SetStateAction<UserData | null>>;
  loading: boolean;
  error: UserData & TError;
  refetchData: (withLoad?: boolean, direct?: boolean) => Promise<void>;
  clearError: () => void;
  setError: React.Dispatch<React.SetStateAction<UserData & TError>>;
}

const UserContext = createContext<IUserContent>({
  data: null,
  setData: () => {},
  loading: true,
  error: { ...defaultUserData, error: null },
  refetchData: async () => {},
  clearError: () => {},
  setError: () => {},
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<UserData & TError>({ ...defaultUserData, error: null });

  const fetchData = async (withLoad?: boolean, direct?: boolean) => {
    if (withLoad) setLoading(true);
    setError({ ...defaultUserData, error: null });
    try {
      const response = await callApi("/user", { method: "PATCH", directToken: direct });
      setData(response.data);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL
  useEffect(() => {
    fetchData(true, true);
    const interval = setInterval(() => {
      callApi("/user/heartbeat", { method: "PATCH" });
    }, 50000); // 50 seconds

    return () => clearInterval(interval);
  }, []);

  const clearError = () => setError({ ...defaultUserData, error: null });

  const contextValue = {
    data,
    setData,
    loading,
    error,
    refetchData: fetchData,
    clearError,
    setError,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
