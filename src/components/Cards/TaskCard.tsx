import toCapitalize from "@/utils/toCapitalize";
import type { GoalData, TaskData, TError } from "@/utils/types";
import ButtonV from "../Inputs/ButtonV";
import clsx from "clsx";
import { handleError } from "@/utils/errorHandler";
import callApi from "@/utils/callApi";
import { useParams } from "react-router";
import { useState } from "react";
import { DeleteTaskPopup, EditTaskPopup } from "../Popups/EditTaskPopup";
import { Info } from "lucide-react";

type TaskProps = {
  task: TaskData;
  goal: GoalData;
  setError: React.Dispatch<React.SetStateAction<Error>>;
  deletes: (taskId: string) => void;
  refetch: () => void;
};

type Error = TError & {
  task?: string;
  description?: string;
  targetDate?: string | Date;
};

const TaskCard = ({ task, setError, goal, deletes, refetch }: TaskProps) => {
  const createdAt = new Date(task.createdAt);
  const targetDate = task.targetDate ? new Date(task.targetDate) : null;
  const goalId = useParams().goalId;
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);
  const [taskInfoPopup, setTaskInfoPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

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
      await callApi("/task", { method: "PUT", token: true, body: { goalId, taskId: task._id, isCompleted: !isCompleted } });
      setIsCompleted((prev) => !prev);
    } catch (err) {
      handleError(err, setError);
    }
  };

  const deleteTask = () => {
    setTaskInfoPopup(false);
    setDeletePopup(false);
    deletes(task._id);
  };

  return (
    <div className="border rounded-xl p-6.5 shadow-md bg-theme border-theme-darker gap-5 flex flex-col">
      {taskInfoPopup && (
        <EditTaskPopup
          setIsCompleted={setIsCompleted}
          deletes={deleteTask}
          data={{ ...task, isCompleted }}
          setClose={() => setTaskInfoPopup(false)}
          timeLeft={timeLeft}
          refetch={refetch}
        />
      )}
      {deletePopup && <DeleteTaskPopup deletes={deleteTask} setClose={() => setDeletePopup(false)} />}
      <div className="flex justify-between">
        <div className="relative flex flex-col gap-3">
          <h1 className="font-heading font-semibold text-[18px]">{toCapitalize(task.task)}</h1>
          <p className={clsx("bg-theme-darker/60 rounded-full text-[12px] px-2 py-1 inline w-fit", isCompleted ? "text-green-400" : "text-red-600")}>
            {isCompleted ? "Completed" : "Incomplete"}
          </p>
          <div className="flex gap-3 text-[14px] text-gray">
            <p>{toCapitalize(task.difficulty)}</p>•
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
          <p className="text-[15px] text-theme-reverse-darker">{task.description}</p>
        </div>
        <Info className="cursor-pointer" onClick={() => setTaskInfoPopup(true)} />
      </div>
      <div className="flex justify-end gap-4">
        <ButtonV
          onClick={() => setDeletePopup(true)}
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
