import type { FriendData, TError } from "@/types/types";
import callApi from "@/utils/callApi";
import { handleError } from "@/utils/errorHandler";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNotification } from "./UseContexts";

type TFriendContent = {
  data: FriendData;
  getData: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<FriendData>>;
  loading: boolean;
  error: TError;
  clearError: () => void;
  setError: React.Dispatch<React.SetStateAction<TError>>;
  unFriend: () => Promise<void>;
  requestFriend: (requestTo: string) => Promise<void>;
};

const FriendContext = createContext<TFriendContent>({
  data: { data: [] },
  getData: async () => {},
  setData: () => {},
  loading: true,
  error: { error: null },
  clearError: () => {},
  setError: () => {},
  unFriend: async () => {},
  requestFriend: async () => {},
});

const FriendProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<TFriendContent["data"]>({ data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TFriendContent["error"]>({ error: null });
  const { openNotification } = useNotification();

  const getData = async () => {
    setLoading(true);
    try {
      const response = await callApi("/friend", { method: "GET" });
      setData(response.data);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError({ error: null });

  const unFriend = async () => {
    setLoading(true);
    try {
      const response = await callApi<FriendData>("/friend/unfriend", { method: "DELETE" });
      setData(response.data);
      if (response.data.notification) {
        openNotification({ message: response.data.notification });
      }
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const requestFriend = async (requestTo: string) => {
    setLoading(true);
    try {
      const response = await callApi<FriendData>("/friend/request", { method: "POST", body: { requestTo } });
      // setData(response.data);
      if (response.data.notification) {
        openNotification({ message: response.data.notification });
      }
    } catch (err) {
      throw handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const contextValue: TFriendContent = {
    data,
    setData,
    loading,
    error,
    getData,
    setError,
    clearError,
    unFriend,
    requestFriend,
  };

  return <FriendContext.Provider value={contextValue}>{children}</FriendContext.Provider>;
};

export { FriendContext, FriendProvider };
