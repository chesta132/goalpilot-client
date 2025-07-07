import { defaultTaskData } from "@/utils/defaultData";
import type { TaskData, TError } from "@/utils/types";
import { createContext, useState, type ReactNode } from "react";
import { useGoalData, useUserData, useNotification } from "./UseContexts";
import { handleError } from "@/utils/errorHandler";
import callApi from "@/utils/callApi";

type TTaskContent = {
  data: TaskData;
  getData: () => void;
  setData: React.Dispatch<React.SetStateAction<TaskData>>;
  error: TaskData & TError;
  clearError: () => void;
  setError: React.Dispatch<React.SetStateAction<TaskData & TError>>;
  deleteTask: () => Promise<void>;
};

const TaskContext = createContext<TTaskContent>({
  data: defaultTaskData,
  getData: () => {},
  setData: () => {},
  error: { ...defaultTaskData, error: null },
  clearError: () => {},
  setError: () => {},
  deleteTask: async () => {},
});

const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<TaskData>(defaultTaskData);
  const [error, setError] = useState<TaskData & TError>({ ...defaultTaskData, error: null });
  const { openNotification } = useNotification();
  const { refetchData } = useUserData();
  const { getData: getGoalData } = useGoalData();

  const getData = () => {
    const taskData: TaskData = JSON.parse(sessionStorage.getItem("task-data") || JSON.stringify(defaultTaskData));
    setData(taskData);
  };

  const clearError = () => setError({ ...defaultTaskData, error: null });

  const handleUndo = async (taskId: string, goalId: string) => {
    try {
      const response = await callApi("/task/restore", { method: "PUT", body: { taskId } });
      refetchData(false);
      getGoalData(goalId, false);
      openNotification({ message: response.data.notification, button: "default" });
    } catch (err) {
      handleError(err, setError);
    }
  };

  const deleteTask = async () => {
    try {
      const response = await callApi("/task", { method: "DELETE", body: { taskId: data._id } });
      openNotification({ message: response.data.notification, buttonFunc: { f: handleUndo, params: [data._id, data.goalId], label: "Undo" } });
      refetchData(false);
      setData(defaultTaskData);
    } catch (err) {
      handleError(err, setError);
    }
  };

  const contextValue = {
    data,
    setData,
    error,
    getData,
    setError,
    clearError,
    deleteTask,
  };

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>;
};

export { TaskContext, TaskProvider };
