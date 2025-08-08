import type { Friend, FriendData, TError } from "@/types/types";
import callApi from "@/utils/callApi";
import { handleError } from "@/utils/errorHandler";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNotification } from "./UseContexts";

type FindProps = { friendId?: string; userId?: string }

type TFriendContent = {
  data: FriendData;
  getData: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<FriendData>>;
  loading: boolean;
  error: TError;
  clearFriendError: () => void;
  setError: React.Dispatch<React.SetStateAction<TError>>;
  unFriend: () => Promise<void>;
  requestFriend: (requestTo: string) => Promise<void>;
  find: ({ friendId, userId }: FindProps) => Friend | undefined;
};

const FriendContext = createContext<TFriendContent>({
  data: { data: [] },
  getData: async () => {},
  setData: () => {},
  loading: true,
  error: { error: null },
  clearFriendError: () => {},
  setError: () => {},
  unFriend: async () => {},
  requestFriend: async () => {},
  find: () => undefined,
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

  const clearFriendError = () => setError({ error: null });

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
      setData(response.data);
      if (response.data.notification) {
        openNotification({ message: response.data.notification });
      }
    } catch (err) {
      throw handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const find = ({ friendId, userId }: FindProps) => {
    const friendValidate = (data: Friend) => friendId === data.friend.id;
    const userValidate = (data: Friend) => userId === data.user.id;

    if (friendId && userId) {
      const finded = data.data.find((data) => friendValidate(data) && userValidate(data));
      return finded;
    }

    const finded = data.data.find((data) => (friendId && friendValidate(data)) || (userId && userValidate(data)));
    return finded;
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
    clearFriendError,
    unFriend,
    requestFriend,
    find
  };

  return <FriendContext.Provider value={contextValue}>{children}</FriendContext.Provider>;
};

export { FriendContext, FriendProvider };
