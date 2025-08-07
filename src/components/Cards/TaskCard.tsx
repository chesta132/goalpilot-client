import { capitalEachWords, capitalWord } from "@/utils/stringManip";
import type { GoalData, TaskData, TError } from "@/types/types";
import ButtonV from "../Inputs/ButtonV";
import clsx from "clsx";
import { handleError } from "@/utils/errorHandler";
import callApi from "@/utils/callApi";
import { Link, useParams } from "react-router";
import { Edit, Info } from "lucide-react";
import { useGoalData } from "@/contexts/UseContexts";
import { encrypt } from "@/utils/cryptoUtils";
import { getTimeLeftToDisplay } from "@/utils/commonUtils";

type TaskProps = {
  task: TaskData;
  setError?: React.Dispatch<React.SetStateAction<GoalData & TError>>;
  index: number;
  preview?: { setTask: React.Dispatch<React.SetStateAction<TaskData>> };
  className?: string;
};

const TaskCard = ({ task, setError, index, preview, className }: TaskProps) => {
  const createdAt = task.createdAt;
  const targetDate = task.targetDate ? new Date(task.targetDate) : null;
  const goalId = useParams().goalId;
  const { setData: setGoalData, getData: getGoalData } = useGoalData();

  const date = targetDate
    ? new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    : new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());

  const intervalMs = date.getTime() - new Date().getTime();
  const timeLeft = Math.ceil(intervalMs / (1000 * 60 * 60 * 24));

  const timeLeftToDisplay = getTimeLeftToDisplay(timeLeft);

  const markCompleteToggle = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

  return (
    <div className={clsx("border rounded-lg p-6.5 shadow-md relative bg-theme border-theme-darker gap-5 flex flex-col w-full", className)}>
      <div className="flex justify-between w-full">
        <div className="relative flex flex-col gap-3 w-full">
          <h1 className="font-heading font-semibold text-[18px] max-w-[85%]">{capitalWord(task.task)}</h1>
          <p
            className={clsx(
              "bg-theme-darker/60 rounded-full text-[12px] px-2 py-1 inline w-fit",
              task.isCompleted ? "text-green-400" : "text-red-600"
            )}
          >
            {task.isCompleted ? "Completed" : "Incomplete"}
          </p>
          <div className="flex gap-3 text-[14px] text-gray flex-wrap">
            <p>{capitalEachWords(task.difficulty)}</p>•
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
          <p className="text-[15px] text-theme-reverse-darker">{task.description}</p>
        </div>
        <div className="absolute right-0 mr-5 flex gap-2">
          <Link to={preview ? "." : `/task/${task._id}/info`} onClick={setTaskData}>
            <Info className="cursor-pointer size-4.5" />
          </Link>
          <Link to={preview ? "." : `/task/${task._id}/edit`} onClick={setTaskData}>
            <Edit className="cursor-pointer size-4.5" />
          </Link>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <ButtonV
          onClick={markCompleteToggle}
          text={task.isCompleted ? "Mark Incomplete" : "Mark Complete"}
          className={clsx(
            "h-10 w-fit !px-6 text-[13px] !text-theme-reverse border border-transparent bg-(--goal-accent)! hover:bg-(--goal-accent-strong)!",
            task.isCompleted && "bg-transparent! hover:bg-theme-dark!",
            task.isCompleted ? "border-(--goal-accent)!" : "border-transparent!"
          )}
        />
      </div>
    </div>
  );
};

export default TaskCard;
