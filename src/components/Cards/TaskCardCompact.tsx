import { capitalEachWords, capitalWord } from "@/utils/stringManip";
import type { GoalData, TaskData, TError } from "@/types/types";
import clsx from "clsx";
import { handleError } from "@/utils/errorHandler";
import callApi from "@/utils/callApi";
import { useNavigate, useParams } from "react-router";
import { Edit, Info } from "lucide-react";
import Checkbox from "../Inputs/Checkbox";
import { useGoalData } from "@/contexts/UseContexts";
import { encrypt } from "@/utils/cryptoUtils";

type TaskProps = {
  task: TaskData;
  setError?: React.Dispatch<React.SetStateAction<GoalData & TError>>;
  index: number;
  preview?: { setTask: React.Dispatch<React.SetStateAction<TaskData>> };
  className?: string;
  buttons?: { info?: boolean; edit?: boolean; checkbox?: boolean };
};

const TaskCardCompact = ({ task, setError, index, preview, className, buttons = { edit: true, info: true, checkbox: true } }: TaskProps) => {
  const createdAt = task.createdAt;
  const targetDate = task.targetDate ? new Date(task.targetDate) : null;
  const goalId = useParams().goalId;
  const navigate = useNavigate();
  const { setData: setGoalData, getData: getGoalData } = useGoalData();

  const date = targetDate
    ? new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    : new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());

  const intervalMs = date.getTime() - new Date().getTime();
  const timeLeft = Math.ceil(intervalMs / (1000 * 60 * 60 * 24));

  const timeLeftMonthPlural = timeLeft >= 0 ? (Math.floor(timeLeft / 30) > 1 ? "s" : "") : Math.floor(Math.abs(timeLeft) / 30) > 1 ? "s" : "";
  const timeLeftYearPlural = timeLeft >= 0 ? (Math.floor(timeLeft / 365) > 1 ? "s" : "") : Math.floor(Math.abs(timeLeft) / 365) > 1 ? "s" : "";

  const timeLeftToDisplay =
    timeLeft >= 0
      ? timeLeft === 0
        ? "Today"
        : timeLeft < 30
        ? `${timeLeft} day${timeLeft !== 1 ? "s" : ""} left`
        : timeLeft < 365 && timeLeft >= 30
        ? `${Math.floor(timeLeft / 30)} Month${timeLeftMonthPlural} left`
        : `${Math.floor(timeLeft / 365)} Year${timeLeftMonthPlural} left`
      : timeLeft > -30
      ? `${Math.abs(timeLeft)} day${Math.abs(timeLeft) !== 1 ? "s" : ""} ago`
      : timeLeft > -365 && timeLeft <= -30
      ? `${Math.floor(Math.abs(timeLeft) / 30)} Month${timeLeftYearPlural} ago`
      : `${Math.floor(Math.abs(timeLeft) / 365)} Year${timeLeftYearPlural} ago`;

  const markCompleteToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (preview) {
      preview.setTask((prev) => ({ ...prev, isCompleted: !prev.isCompleted, completedAt: new Date(Date.now()) }));
      return;
    }
    try {
      setGoalData((prev) => {
        const newTask = prev.tasks.map((task, taskIndex) => (index === taskIndex ? { ...task, isCompleted: !task.isCompleted } : task));
        return { ...prev, tasks: newTask };
      });
      await callApi("/task", { method: "PUT", body: { goalId, taskId: task._id, isCompleted: !task.isCompleted } });
      await getGoalData(goalId, false);
    } catch (err) {
      handleError(err, setError!);
    }
  };

  const setTaskData = () => {
    const encryptedData = encrypt(task);
    sessionStorage.setItem("task-data", encryptedData);
  };

  const handleToEditTask = () => {
    if (preview) return;
    setTaskData();
    navigate(`/task/${task._id}/edit`);
  };

  const handleToInfoTask = () => {
    if (preview) return;
    setTaskData();
    navigate(`/task/${task._id}/info`);
  };

  return (
    <div className={clsx("border relative rounded-lg py-5 px-4 shadow-md bg-theme border-theme-darker gap-1 flex w-full", className)}>
      {buttons.checkbox && <Checkbox label="" id={task.id} size={15} checked={task.isCompleted} onChange={markCompleteToggle} />}
      <div className="flex justify-between w-full">
        <div className="relative flex flex-col gap-2 w-full">
          <h1 className="font-heading font-semibold text-[14px] md:text-[15px] max-w-[90%]">{capitalWord(task.task)}</h1>
          <div className="flex gap-x-3 gap-y-1 text-[11px] md:text-[12px] text-gray items-center flex-wrap">
            <p
              className={clsx(
                "bg-theme-darker/60 rounded-full text-[10px] md:text-[11px] px-2 py-1 inline size-fit",
                task.isCompleted ? "text-green-400" : "text-red-600"
              )}
            >
              {task.isCompleted ? "Completed" : "Incomplete"}
            </p>
            •<p>{capitalEachWords(task.difficulty)}</p>•
            <p>
              {task.isCompleted
                ? task.completedAt && new Date(task.completedAt).toFormattedString({ includeThisYear: false })
                : new Date(date).toFormattedString({ includeThisYear: false })}
            </p>
            {!task.isCompleted && "•"}
            {!task.isCompleted && (
              <p className={clsx(timeLeft > 3 && timeLeft <= 7 ? "text-yellow-500 font-medium" : timeLeft <= 3 && "text-red-600 font-medium")}>
                {timeLeftToDisplay}
              </p>
            )}
          </div>
        </div>
        <div className="absolute right-0 mr-5 flex gap-2">
          {buttons.info && <Info className="cursor-pointer size-4.5" onClick={handleToInfoTask} />}
          {buttons.edit && <Edit className="cursor-pointer size-4.5" onClick={handleToEditTask} />}
        </div>
      </div>
    </div>
  );
};

export default TaskCardCompact;
