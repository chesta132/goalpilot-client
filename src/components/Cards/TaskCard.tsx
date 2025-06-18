import toCapitalize from "@/utils/toCapitalize";
import type { GoalData, TaskData, TError } from "@/utils/types";
import ButtonV from "../Inputs/ButtonV";
import clsx from "clsx";
import { handleError } from "@/utils/errorHandler";
import callApi from "@/utils/callApi";
import { useParams } from "react-router";
import { useState } from "react";

type TaskProps = {
  task: TaskData;
  goal: GoalData;
  setError: React.Dispatch<React.SetStateAction<Error>>;
};

type Error = TError & {
  task?: string;
  description?: string;
  targetDate?: string | Date;
};

const TaskCard = ({ task, setError, goal }: TaskProps) => {
  const createdAt = new Date(task.createdAt);
  const targetDate = task.targetDate ? new Date(task.targetDate) : null;
  const goalId = useParams().goalId;
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);

  const date = targetDate
    ? new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    : new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());

  const intervalMs = date.getTime() - new Date().getTime();
  const timeLeft = Math.ceil(intervalMs / (1000 * 60 * 60 * 24));

  const dateToDisplay = timeLeft > 0 ? `${timeLeft} days left` : timeLeft < 0 ? `${Math.abs(timeLeft)} days ago` : "Today";

  const markCompleteToggle = async () => {
    try {
      await callApi("/task", { method: "PUT", token: true, body: { goalId, taskId: task._id, isCompleted: !isCompleted } });
      setIsCompleted((prev) => !prev);
    } catch (err) {
      handleError(err, setError);
    }
  };

  return (
    <div className="border rounded-xl p-6.5 shadow-md bg-theme border-theme-darker gap-5 flex flex-col">
      <div className="relative flex flex-col gap-3">
        <h1 className="font-heading font-semibold text-[18px]">{toCapitalize(task.task)}</h1>
        <p className={clsx("bg-theme-darker/60 rounded-full text-[12px] px-2 py-1 inline w-fit", isCompleted ? "text-green-400" : "text-red-600")}>
          {isCompleted ? "Completed" : "Incomplete"}
        </p>
        <div className="flex gap-3 text-[14px] text-gray">
          <p>{toCapitalize(task.difficulty)}</p>•
          <p>
            {isCompleted ? (task.completedAt ? new Date(task.completedAt).toDateString() : new Date().toDateString()) : date.toDateString()}
          </p>
          {!isCompleted && "•"}
          {!isCompleted && (
            <p className={clsx("", timeLeft > 3 ? "text-yellow-500 font-medium" : timeLeft <= 0 && "text-red-600 font-medium")}>
              {dateToDisplay}
            </p>
          )}
        </div>
        <p className="text-[15px] text-theme-reverse-darker">{task.description}</p>
      </div>
      <div className="flex justify-end gap-4">
        <ButtonV
          text="Delete Task"
          className="h-10 w-fit !px-6 text-[13px] bg-theme !text-theme-reverse border-red-800 border hover:bg-red-700 hover:!text-white"
        />
        <ButtonV
          onClick={markCompleteToggle}
          text={isCompleted ? "Mark Incomplete" : "Mark Complete"}
          className={clsx(
            "h-10 w-fit !px-6 text-[13px] !text-theme-reverse border border-transparent",
            isCompleted && "bg-transparent hover:bg-theme-dark"
          )}
          style={{ borderColor: isCompleted ? goal.color : "transparent" }}
        />
      </div>
    </div>
  );
};

export default TaskCard;
