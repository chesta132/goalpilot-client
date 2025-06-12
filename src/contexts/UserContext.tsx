import { createContext, useState, useEffect, type ReactNode } from "react";
import callApi from "@/utils/callApi";
import errorHandler from "@/utils/errorHandler";
import type { UserData, TError } from "@/utils/types";

interface IUserContent {
  data: UserData | null;
  loading: boolean;
  error: TError | null;
  refetchData: (withLoad?: boolean) => Promise<void>;
  clearError: () => void;
  setError: (prev: TError | null) => React.Dispatch<React.SetStateAction<TError | null>> | void;
}

const UserContext = createContext<IUserContent>({
  data: null,
  loading: true,
  error: null,
  refetchData: async () => {},
  clearError: () => {},
  setError: () => {},
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TError | null>(null);

  const fetchData = async (withLoad?: boolean) => {
    if (withLoad) setLoading(true);
    setError(null);
    try {
      const response = await callApi("/user", { method: "PATCH", token: true });
      setData(response.data);
    } catch (err) {
      errorHandler(err, setError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      callApi("/user/heartbeat", { method: "PATCH", token: true });
    }, 50000); // 50 seconds

    return () => clearInterval(interval);
  }, []);

  const clearError = () => setError(null);

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
