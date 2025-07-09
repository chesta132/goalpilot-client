import { capitalEachWords, capitalWord } from "@/utils/stringManip";
import type { GoalData, TaskData, TError } from "@/utils/types";
import ButtonV from "../Inputs/ButtonV";
import clsx from "clsx";
import { handleError } from "@/utils/errorHandler";
import callApi from "@/utils/callApi";
import { useNavigate, useParams } from "react-router";
import { Edit } from "lucide-react";
import { useGoalData } from "@/contexts/UseContexts";
import { encrypt } from "@/utils/cryptoUtils";

type TaskProps = {
  task: TaskData;
  setError: React.Dispatch<React.SetStateAction<GoalData & TError>>;
  index: number;
};

const TaskCard = ({ task, setError, index }: TaskProps) => {
  const createdAt = new Date(task.createdAt);
  const targetDate = task.targetDate ? new Date(task.targetDate) : null;
  const goalId = useParams().goalId;
  const navigate = useNavigate();
  const { setData: setGoalData } = useGoalData();

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
      setGoalData((prev) => {
        const newTask = prev.tasks.map((task, taskIndex) => (index === taskIndex ? { ...task, isCompleted: !task.isCompleted } : task));
        return { ...prev, tasks: newTask };
      });
      await callApi("/task", { method: "PUT", body: { goalId, taskId: task._id, isCompleted: !task.isCompleted } });
    } catch (err) {
      handleError(err, setError);
    }
  };

  const handleToEditTask = () => {
    const encryptedData = encrypt(JSON.stringify(task));
    sessionStorage.setItem("task-data", encryptedData);
    navigate(`/task/${task._id}/edit`);
  };

  return (
    <div className="border rounded-lg p-6.5 shadow-md relative bg-theme border-theme-darker gap-5 flex flex-col w-full">
      <div className="flex justify-between w-full">
        <div className="relative flex flex-col gap-3 w-full">
          <h1 className="font-heading font-semibold text-[18px] max-w-[90%]">{capitalWord(task.task)}</h1>
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
                ? task.completedAt
                  ? new Date(task.completedAt).toDateString()
                  : new Date().toDateString()
                : new Date(date).toDateString()}
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
        <Edit className="cursor-pointer size-4.5 absolute right-0 mr-5" onClick={handleToEditTask} />
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
