import { defaultTaskData } from "@/utils/defaultData";
import type { TaskData, TError } from "@/types/types";
import { createContext, useState, type ReactNode } from "react";
import { useGoalData, useUserData, useNotification } from "./UseContexts";
import { handleError } from "@/utils/errorHandler";
import callApi from "@/utils/callApi";

type TTaskContent = {
  data: TaskData;
  loading: boolean;
  getData: (taskId: string) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<TaskData>>;
  error: TaskData & TError;
  clearError: () => void;
  setError: React.Dispatch<React.SetStateAction<TaskData & TError>>;
  deleteTask: () => Promise<void>;
  resetData: () => void;
};

const TaskContext = createContext<TTaskContent>({
  data: defaultTaskData,
  loading: true,
  getData: async () => {},
  setData: () => {},
  error: { ...defaultTaskData, error: null },
  clearError: () => {},
  setError: () => {},
  deleteTask: async () => {},
  resetData: () => {},
});

const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<TaskData>(defaultTaskData);
  const [error, setError] = useState<TaskData & TError>({ ...defaultTaskData, error: null });
  const [loading, setLoading] = useState(true);
  const { openNotification } = useNotification();
  const { refetchData } = useUserData();
  const { getData: getGoalData } = useGoalData();

  const getData = async (taskId: string, withLoad = true) => {
    setLoading(withLoad);
    try {
      const response = await callApi(`/task?taskId=${taskId}`, { method: "GET" });
      setData(response.data);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError({ ...defaultTaskData, error: null });

  const handleUndo = async (taskId: string, goalId: string) => {
    setLoading(true);
    try {
      const response = await callApi("/task/restore", { method: "PUT", body: { taskId } });
      refetchData(false);
      getGoalData(goalId, false);
      openNotification({ message: response.data.notification, button: "default" });
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    setLoading(true);
    try {
      const response = await callApi("/task", { method: "DELETE", body: { taskId: data._id } });
      openNotification({ message: response.data.notification, buttonFunc: { f: handleUndo, params: [data._id, data.goalId], label: "Undo" } });
      refetchData(false);
      setData(defaultTaskData);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const resetData = () => {
    setData(defaultTaskData);
  };

  const contextValue = {
    data,
    setData,
    loading,
    error,
    getData,
    setError,
    clearError,
    deleteTask,
    resetData,
  };

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>;
};

export { TaskContext, TaskProvider };
