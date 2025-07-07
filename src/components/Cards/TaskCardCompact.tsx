import toCapitalize from "@/utils/toCapitalize";
import type { GoalData, TaskData, TError } from "@/utils/types";
import clsx from "clsx";
import { handleError } from "@/utils/errorHandler";
import callApi from "@/utils/callApi";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { Edit } from "lucide-react";
import Checkbox from "../Inputs/Checkbox";

type TaskProps = {
  task: TaskData;
  setError: React.Dispatch<React.SetStateAction<GoalData & TError>>;
};

const TaskCardCompact = ({ task, setError }: TaskProps) => {
  const createdAt = new Date(task.createdAt);
  const targetDate = task.targetDate ? new Date(task.targetDate) : null;
  const goalId = useParams().goalId;
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);

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

  const markCompleteToggle = async () => {
    try {
      await callApi("/task", { method: "PUT", body: { goalId, taskId: task._id, isCompleted: !isCompleted } });
      setIsCompleted((prev) => !prev);
    } catch (err) {
      handleError(err, setError);
    }
  };

  const handleToInfoTask = () => {
    sessionStorage.setItem("task-data", JSON.stringify(task));
    navigate(`/task/${task._id}/edit`);
  };

  return (
    <div className="border relative rounded-lg py-5 px-4 shadow-md bg-theme border-theme-darker gap-1 flex">
      <Checkbox label="" size={15} checked={isCompleted} onChange={markCompleteToggle} />
      <div className="flex justify-between">
        <div className="relative flex flex-col gap-2">
          <h1 className="font-heading font-semibold text-[16px]">{toCapitalize(task.task)}</h1>
          <div className="flex gap-3 text-[12px] text-gray items-center">
            <p
              className={clsx(
                "bg-theme-darker/60 rounded-full text-[11.5px] px-2 py-1 inline size-fit",
                isCompleted ? "text-green-400" : "text-red-600"
              )}
            >
              {isCompleted ? "Completed" : "Incomplete"}
            </p>
            •<p>{toCapitalize(task.difficulty)}</p>•
            <p>
              {isCompleted
                ? task.completedAt
                  ? new Date(task.completedAt).toDateString()
                  : new Date().toDateString()
                : new Date(date).toDateString()}
            </p>
            {!isCompleted && "•"}
            {!isCompleted && (
              <p className={clsx(timeLeft > 3 && timeLeft <= 7 ? "text-yellow-500 font-medium" : timeLeft <= 3 && "text-red-600 font-medium")}>
                {timeLeftToDisplay}
              </p>
            )}
          </div>
        </div>
        <Edit className="cursor-pointer size-4.5 absolute right-0 mr-4" onClick={handleToInfoTask} />
      </div>
    </div>
  );
};

export default TaskCardCompact;
