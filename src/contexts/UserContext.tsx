import { createContext, useState, useEffect, type ReactNode } from "react";
import callApi from "@/utils/callApi";
import { handleError } from "@/utils/errorHandler";
import type { UserData, ErrorWithValues } from "@/utils/types";

interface IUserContent {
  data: UserData | null;
  loading: boolean;
  error: ErrorWithValues;
  refetchData: (withLoad?: boolean, direct?: boolean) => Promise<void>;
  clearError: () => void;
  setError: React.Dispatch<React.SetStateAction<ErrorWithValues>>;
}

const UserContext = createContext<IUserContent>({
  data: null,
  loading: true,
  error: { error: null },
  refetchData: async () => {},
  clearError: () => {},
  setError: () => {},
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorWithValues>({ error: null });

  const fetchData = async (withLoad?: boolean, direct?: boolean) => {
    if (withLoad) setLoading(true);
    setError({ error: null });
    try {
      const response = await callApi("/user", { method: "PATCH", token: true, directToken: direct });
      setData(response.data);
    } catch (err) {
      console.log(err);
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL
  useEffect(() => {
    fetchData(true, true);
    const interval = setInterval(() => {
      callApi("/user/heartbeat", { method: "PATCH", token: true });
    }, 50000); // 50 seconds

    return () => clearInterval(interval);
  }, []);

  const clearError = () => setError({ error: null });

  const contextValue = {
    data,
    loading,
    error,
    refetchData: fetchData,
    clearError,
    setError,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
