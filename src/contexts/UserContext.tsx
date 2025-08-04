import { createContext, useState, useEffect, type ReactNode } from "react";
import callApi from "@/utils/callApi";
import { handleError } from "@/utils/errorHandler";
import type { UserData, TError, UserProfile } from "@/types/types";
import { defaultUserData } from "@/utils/defaultData";

interface IUserContent {
  data: UserData | null;
  setData: React.Dispatch<React.SetStateAction<UserData | null>>;
  loading: boolean;
  error: UserData & TError;
  refetchData: (withLoad?: boolean, direct?: boolean) => Promise<void>;
  clearError: () => void;
  setError: React.Dispatch<React.SetStateAction<UserData & TError>>;
  getProfileInitial: (name?: string) => string;
  getProfileData: (username: string, withLoad?: boolean) => Promise<void>;
  profileData: UserProfile | null;
  setProfileData: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const UserContext = createContext<IUserContent>({
  data: null,
  setData: () => {},
  loading: true,
  error: { ...defaultUserData, error: null },
  refetchData: async () => {},
  clearError: () => {},
  setError: () => {},
  getProfileInitial: () => "",
  getProfileData: async () => {},
  profileData: null,
  setProfileData: () => {},
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<UserData & TError>({ ...defaultUserData, error: null });

  const fetchData = async (withLoad?: boolean, direct?: boolean) => {
    const path = window.location.pathname;
    if (withLoad) setLoading(true);
    setError({ ...defaultUserData, error: null });
    try {
      const response = await callApi("/user", { method: "PATCH", directToken: path !== "/signin" && path !== "/signup" && direct });
      setData(response.data);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const getProfileData = async (username: string, withLoad = true) => {
    if (withLoad) setLoading(true);
    setError({ ...defaultUserData, error: null });
    try {
      const response = await callApi(`/user?username=${username}`, { method: "GET" });
      setProfileData(response.data);
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

  const getProfileInitial = (name?: string) => {
    const splittedFullName = name?.split(" ") || (data && data.fullName.split(" "));
    if (!splittedFullName) return "";
    return splittedFullName[0][0] + (splittedFullName[1] ? splittedFullName[1][0] : "");
  };

  const contextValue: IUserContent = {
    data,
    setData,
    loading,
    error,
    refetchData: fetchData,
    clearError,
    setError,
    getProfileInitial,
    getProfileData,
    profileData,
    setProfileData
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
